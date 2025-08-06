import uvicorn
import os
import json
import tempfile
import asyncio
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime
import shutil
import re
import uuid

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel, Field

# Import agent modules
try:
    from customer_needs_agent import CustomerNeedsAgent
    from analysis_agents import GapAnalysisAgent, ModuleMatchAgent, create_analysis_agents
    from report_agent import RFPResponseGenerator
    from muRag_vlm import load_and_chunk_documents, create_faiss_index, execute_complete_rfp_analysis

    print("✅ All agent modules imported successfully")
    AGENTS_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ Warning: Agent modules not available: {e}")
    AGENTS_AVAILABLE = False


# ===============================================================================
# PYDANTIC MODELS FOR REQUEST/RESPONSE
# ===============================================================================

class CompanyInfo(BaseModel):
    company_name: str = Field(..., description="Full legal company name")
    trading_name: Optional[str] = Field(None, description="Trading name if different")
    address: str = Field(..., description="Physical address")
    website: str = Field(..., description="Company website")
    entity_type: str = Field(..., description="Type of business entity")
    country: str = Field(..., description="Country of residence")
    contact_name: str = Field(..., description="Main contact person")
    contact_position: str = Field(..., description="Contact person's position")
    phone: str = Field(..., description="Phone number")
    email: str = Field(..., description="Email address")
    signatory_name: str = Field(..., description="Person authorized to sign")
    signatory_title: str = Field(..., description="Signatory's title")


class DomainAnalysisRequest(BaseModel):
    domain: str = Field(..., description="Domain to analyze (e.g., 'security', 'cloud', 'ai')")
    target_score: Optional[float] = Field(0.7, description="Target faithfulness score")


class AnalysisResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    file_path: Optional[str] = None
    analysis_id: Optional[str] = None


class SystemStatus(BaseModel):
    system_ready: bool
    documents_indexed: int
    rfp_mappings: int
    api_configured: bool
    agents_available: bool
    version: str = "3.1.0"


# ===============================================================================
# FASTAPI APPLICATION SETUP
# ===============================================================================

app = FastAPI(
    title="RFP Analysis System API",
    description="Real RFP analysis system with AI-powered insights using specialized agents",
    version="3.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================================================================
# GLOBAL VARIABLES AND SYSTEM INITIALIZATION
# ===============================================================================

# Real storage - no mock data
real_data_storage = {
    "analyses": {},
    "reports": {},
    "system_stats": {},
    "active_analysis": None,
    "vectorstore": None,
    "document_registry": {},
    "rfp_mappings": {}
}

# API Keys from environment variables
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY", "8201d29393384428ba1c32e5e16a55d2d67188d618f94476b26ef0414e59e8dc")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCCKsZYOSP53ZGjF9p0ro1eNUYcdODCbtk")

# Global system instances
customer_agent = None
gap_analysis_agent = None
module_match_agent = None
vectorstore = None
llm = None

# WebSocket connections
active_connections: List[WebSocket] = []


async def broadcast_progress(message: dict):
    """Broadcast real-time progress to connected clients"""
    if active_connections:
        disconnected = []
        for connection in active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)
        for conn in disconnected:
            active_connections.remove(conn)


def initialize_real_system():
    """Initialize the actual RFP analysis system with all agents"""
    global customer_agent, gap_analysis_agent, module_match_agent, vectorstore, llm

    if not AGENTS_AVAILABLE:
        print("⚠️ Agent modules not available - system will have limited functionality")
        return False

    try:
        # Initialize core agents
        customer_agent = CustomerNeedsAgent(TOGETHER_API_KEY)
        gap_analysis_agent = GapAnalysisAgent(GEMINI_API_KEY)
        module_match_agent = ModuleMatchAgent(GEMINI_API_KEY)

        # Initialize Together LLM for RAG system
        from together import Together
        llm = Together(api_key=TOGETHER_API_KEY)

        # Try to load existing vector store
        # Try to load existing vector store, or rebuild if corrupted
        try:
            from langchain_community.vectorstores import FAISS
            from langchain_huggingface import HuggingFaceEmbeddings
            from muRag_vlm import load_and_chunk_documents, create_faiss_index

            embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

            if Path("./faiss_index").exists():
                try:
                    vectorstore = FAISS.load_local(
                        "./faiss_index",
                        embedding_model,
                        allow_dangerous_deserialization=True
                    )
                    print("✅ Existing vector store loaded")
                except Exception as load_error:
                    print(f"⚠️ Corrupted FAISS index detected: {load_error}")
                    print("🔄 Rebuilding vector store from documents...")

                    # Rebuild from scratch
                    chunks, registry, mapping = load_and_chunk_documents()
                    vectorstore = create_faiss_index(chunks)

                    # Save updated memory
                    with open("./document_registry.json", "w", encoding="utf-8") as f:
                        json.dump(registry, f, indent=2, ensure_ascii=False)
                    with open("./rfp_response_mapping.json", "w", encoding="utf-8") as f:
                        json.dump(mapping, f, indent=2, ensure_ascii=False)

                    print("✅ Vector store rebuilt and saved")

            else:
                print("📊 No existing vector store found - will create on first document processing")
                vectorstore = None

            real_data_storage["vectorstore"] = vectorstore

        except Exception as e:
            print(f"⚠️ Could not initialize vector store: {e}")

        # Load existing document registry
        try:
            if Path("./document_registry.json").exists():
                with open("./document_registry.json", "r", encoding="utf-8") as f:
                    real_data_storage["document_registry"] = json.load(f)
            if Path("./rfp_response_mapping.json").exists():
                with open("./rfp_response_mapping.json", "r", encoding="utf-8") as f:
                    real_data_storage["rfp_mappings"] = json.load(f)
            print(
                f"✅ Loaded {len(real_data_storage['document_registry'])} documents and {len(real_data_storage['rfp_mappings'])} mappings")
        except Exception as e:
            print(f"⚠️ Could not load existing data: {e}")

        return True

    except Exception as e:
        print(f"❌ Error initializing real system: {e}")
        return False


# ===============================================================================
# WEBSOCKET FOR REAL-TIME UPDATES
# ===============================================================================

@app.websocket("/ws/analysis")
async def websocket_endpoint(websocket: WebSocket):
    """Real-time analysis updates"""
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({"type": "ping", "message": "Connected to real backend"})
    except WebSocketDisconnect:
        active_connections.remove(websocket)


# ===============================================================================
# HEALTH CHECK AND STATUS ENDPOINTS
# ===============================================================================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "RFP Analysis System API - Real Backend with Agents",
        "version": "3.1.0",
        "status": "operational",
        "agents_available": AGENTS_AVAILABLE,
        "docs": "/docs"
    }


@app.get("/api/health")
async def health_check():
    """Health check with real system status"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "agents_available": AGENTS_AVAILABLE,
        "vectorstore_loaded": vectorstore is not None,
        "documents_indexed": len(real_data_storage["document_registry"]),
        "version": "3.1.0"
    }


@app.get("/api/status", response_model=SystemStatus)
async def get_system_status():
    """Get real system status"""
    return SystemStatus(
        system_ready=AGENTS_AVAILABLE,
        documents_indexed=len(real_data_storage["document_registry"]),
        rfp_mappings=len(real_data_storage["rfp_mappings"]),
        api_configured=bool(TOGETHER_API_KEY and GEMINI_API_KEY),
        agents_available=AGENTS_AVAILABLE,
        version="3.1.0"
    )


# ===============================================================================
# AGENT-SPECIFIC ENDPOINTS
# ===============================================================================

@app.post("/api/customer_needs", response_model=AnalysisResponse)
async def analyze_customer_needs(
        rfp_file: UploadFile = File(...),
        background_tasks: BackgroundTasks = None
):
    """Analyze customer needs from an RFP file using CustomerNeedsAgent"""
    if not AGENTS_AVAILABLE or customer_agent is None:
        raise HTTPException(status_code=503, detail="Customer Needs Agent not available")

    analysis_id = str(uuid.uuid4())
    try:
        # Save uploaded file temporarily
        temp_dir = Path(tempfile.gettempdir()) / "rfp_uploads"
        temp_dir.mkdir(exist_ok=True)
        temp_file_path = temp_dir / rfp_file.filename
        with open(temp_file_path, "wb") as f:
            shutil.copyfileobj(rfp_file.file, f)

        await broadcast_progress({
            "type": "progress",
            "analysis_id": analysis_id,
            "message": f"Processing RFP file: {rfp_file.filename}"
        })

        # Process RFP with CustomerNeedsAgent
        result = customer_agent.process_rfp(str(temp_file_path))

        # Store analysis result
        real_data_storage["analyses"][analysis_id] = {
            "id": analysis_id,
            "type": "customer_needs",
            "status": "completed" if result["success"] else "failed",
            "result": result,
            "timestamp": datetime.now().isoformat()
        }

        # Clean up temporary file
        background_tasks.add_task(os.remove, temp_file_path)

        return AnalysisResponse(
            success=result["success"],
            message="Customer needs analysis completed" if result["success"] else result["error"],
            data=result,
            file_path=result["output_path"] if result["success"] else None,
            analysis_id=analysis_id
        )

    except Exception as e:
        real_data_storage["analyses"][analysis_id] = {
            "id": analysis_id,
            "type": "customer_needs",
            "status": "failed",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        raise HTTPException(status_code=500, detail=f"Error processing RFP: {str(e)}")


@app.post("/api/gap_analysis", response_model=AnalysisResponse)
async def perform_gap_analysis(
        client_file: UploadFile = File(...),
        company_file: UploadFile = File(...),
        employee_file: Optional[UploadFile] = File(None),
        background_tasks: BackgroundTasks = None
):
    """Perform gap analysis using GapAnalysisAgent"""
    if not AGENTS_AVAILABLE or gap_analysis_agent is None:
        raise HTTPException(status_code=503, detail="Gap Analysis Agent not available")

    analysis_id = str(uuid.uuid4())
    try:
        # Save uploaded files temporarily
        temp_dir = Path(tempfile.gettempdir()) / "rfp_uploads"
        temp_dir.mkdir(exist_ok=True)

        files = {
            "client": await client_file.read(),
            "company": await company_file.read()
        }
        if employee_file:
            files["employee"] = await employee_file.read()

        await broadcast_progress({
            "type": "progress",
            "analysis_id": analysis_id,
            "message": "Performing gap analysis"
        })

        # Process with GapAnalysisAgent
        analysis_result, artifacts = gap_analysis_agent.use(files)

        # Save PDF artifact if generated
        output_path = None
        if "pdf_report" in artifacts:
            output_path = f"gap_analysis_report_{analysis_id}.pdf"
            with open(output_path, "wb") as f:
                f.write(artifacts["pdf_report"].getvalue())

        # Store analysis result
        real_data_storage["analyses"][analysis_id] = {
            "id": analysis_id,
            "type": "gap_analysis",
            "status": "completed",
            "result": {"analysis_text": analysis_result, "artifacts": list(artifacts.keys())},
            "timestamp": datetime.now().isoformat()
        }

        return AnalysisResponse(
            success=True,
            message="Gap analysis completed",
            data={"analysis_text": analysis_result, "artifacts": list(artifacts.keys())},
            file_path=output_path,
            analysis_id=analysis_id
        )

    except Exception as e:
        real_data_storage["analyses"][analysis_id] = {
            "id": analysis_id,
            "type": "gap_analysis",
            "status": "failed",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        raise HTTPException(status_code=500, detail=f"Error performing gap analysis: {str(e)}")


@app.post("/api/module_match", response_model=AnalysisResponse)
async def perform_module_match(
        client_file: UploadFile = File(...),
        company_file: UploadFile = File(...),
        background_tasks: BackgroundTasks = None
):
    """Perform module matching using ModuleMatchAgent"""
    if not AGENTS_AVAILABLE or module_match_agent is None:
        raise HTTPException(status_code=503, detail="Module Match Agent not available")

    analysis_id = str(uuid.uuid4())
    try:
        # Save uploaded files temporarily
        temp_dir = Path(tempfile.gettempdir()) / "rfp_uploads"
        temp_dir.mkdir(exist_ok=True)

        files = {
            "client": await client_file.read(),
            "company": await company_file.read()
        }

        await broadcast_progress({
            "type": "progress",
            "analysis_id": analysis_id,
            "message": "Performing module matching"
        })

        # Process with ModuleMatchAgent
        match_result, artifacts = module_match_agent.use(files)

        # Save chart artifact if generated
        output_path = None
        if "chart" in artifacts:
            output_path = f"module_match_chart_{analysis_id}.png"
            artifacts["chart"].savefig(output_path, dpi=300, bbox_inches="tight")

        # Store analysis result
        real_data_storage["analyses"][analysis_id] = {
            "id": analysis_id,
            "type": "module_match",
            "status": "completed",
            "result": {"match_text": match_result, "artifacts": list(artifacts.keys())},
            "timestamp": datetime.now().isoformat()
        }

        return AnalysisResponse(
            success=True,
            message="Module matching completed",
            data={"match_text": match_result, "artifacts": list(artifacts.keys())},
            file_path=output_path,
            analysis_id=analysis_id
        )

    except Exception as e:
        real_data_storage["analyses"][analysis_id] = {
            "id": analysis_id,
            "type": "module_match",
            "status": "failed",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        raise HTTPException(status_code=500, detail=f"Error performing module matching: {str(e)}")


@app.post("/api/rfp_response", response_model=AnalysisResponse)
async def generate_rfp_response(
        pdf1: UploadFile = File(...),
        pdf2: UploadFile = File(...),
        company_info: CompanyInfo = None,
        background_tasks: BackgroundTasks = None
):
    """Generate RFP response using RFPResponseGenerator"""
    if not AGENTS_AVAILABLE:
        raise HTTPException(status_code=503, detail="RFP Response Generator not available")

    analysis_id = str(uuid.uuid4())
    try:
        # Save uploaded files temporarily
        temp_dir = Path(tempfile.gettempdir()) / "rfp_uploads"
        temp_dir.mkdir(exist_ok=True)
        pdf1_path = temp_dir / pdf1.filename
        pdf2_path = temp_dir / pdf2.filename

        with open(pdf1_path, "wb") as f:
            shutil.copyfileobj(pdf1.file, f)
        with open(pdf2_path, "wb") as f:
            shutil.copyfileobj(pdf2.file, f)

        await broadcast_progress({
            "type": "progress",
            "analysis_id": analysis_id,
            "message": "Generating RFP response"
        })

        # Initialize RFPResponseGenerator
        generator = RFPResponseGenerator(str(pdf1_path), str(pdf2_path))
        response_content = generator.generate_rfp_response(company_info.dict())

        # Save response
        response_file = f"RFP_Response_{analysis_id}.md"
        with open(response_file, "w", encoding="utf-8") as f:
            f.write(response_content)

        # Store analysis result
        real_data_storage["analyses"][analysis_id] = {
            "id": analysis_id,
            "type": "rfp_response",
            "status": "completed",
            "result": {"response_length": len(response_content)},
            "timestamp": datetime.now().isoformat()
        }

        # Clean up temporary files
        background_tasks.add_task(os.remove, pdf1_path)
        background_tasks.add_task(os.remove, pdf2_path)

        return AnalysisResponse(
            success=True,
            message="RFP response generated",
            data={"response_length": len(response_content)},
            file_path=response_file,
            analysis_id=analysis_id
        )

    except Exception as e:
        real_data_storage["analyses"][analysis_id] = {
            "id": analysis_id,
            "type": "rfp_response",
            "status": "failed",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        raise HTTPException(status_code=500, detail=f"Error generating RFP response: {str(e)}")


@app.post("/api/rag_analysis", response_model=AnalysisResponse)
async def perform_rag_analysis(
        domain_request: DomainAnalysisRequest,
        background_tasks: BackgroundTasks = None
):
    """Perform RAG-based strategic analysis using muRag_vlm"""
    if not AGENTS_AVAILABLE or vectorstore is None or llm is None:
        raise HTTPException(status_code=503, detail="RAG system not available")

    analysis_id = str(uuid.uuid4())
    try:
        await broadcast_progress({
            "type": "progress",
            "analysis_id": analysis_id,
            "message": f"Performing RAG analysis for domain: {domain_request.domain}"
        })

        # Execute RAG analysis
        complete_analysis = execute_complete_rfp_analysis(vectorstore, llm, domain_request.domain)

        # Save analysis result
        output_path = f"rag_analysis_{analysis_id}.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(complete_analysis, f, ensure_ascii=False, indent=2)

        # Store analysis result
        real_data_storage["analyses"][analysis_id] = {
            "id": analysis_id,
            "type": "rag_analysis",
            "status": "completed",
            "result": complete_analysis,
            "timestamp": datetime.now().isoformat()
        }

        return AnalysisResponse(
            success=True,
            message=f"RAG analysis completed for domain: {domain_request.domain}",
            data=complete_analysis,
            file_path=output_path,
            analysis_id=analysis_id
        )

    except Exception as e:
        real_data_storage["analyses"][analysis_id] = {
            "id": analysis_id,
            "type": "rag_analysis",
            "status": "failed",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        raise HTTPException(status_code=500, detail=f"Error performing RAG analysis: {str(e)}")


# ===============================================================================
# SYSTEM STATISTICS AND MONITORING
# ===============================================================================

@app.get("/api/system/stats")
async def get_real_system_stats():
    """Get comprehensive system statistics"""
    stats = {
        "analyses": {
            "total": len(real_data_storage["analyses"]),
            "completed": len([a for a in real_data_storage["analyses"].values() if a.get("status") == "completed"]),
            "in_progress": 1 if real_data_storage.get("active_analysis") else 0
        },
        "reports": {
            "total": len(real_data_storage["reports"]),
            "types": list(set(r.get("type", "unknown") for r in real_data_storage["reports"].values()))
        },
        "documents": {
            "indexed": len(real_data_storage["document_registry"]),
            "mappings": len(real_data_storage["rfp_mappings"])
        },
        "system": {
            "agents_available": AGENTS_AVAILABLE,
            "vectorstore_loaded": vectorstore is not None,
            "active_connections": len(active_connections),
            "version": "3.1.0"
        },
        "timestamp": datetime.now().isoformat()
    }
    return stats


@app.post("/api/system/reset")
async def reset_real_system():
    """Reset system while preserving real analysis capabilities"""
    global real_data_storage
    real_data_storage["analyses"] = {}
    real_data_storage["reports"] = {}
    real_data_storage["active_analysis"] = None
    return {
        "success": True,
        "message": "System reset - analysis capabilities preserved",
        "backend_status": "ready" if AGENTS_AVAILABLE else "limited"
    }


# ===============================================================================
# STARTUP AND SHUTDOWN
# ===============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize real system on startup"""
    print("🚀 Starting Real RFP Analysis System API...")
    print("=" * 50)
    global AGENTS_AVAILABLE
    success = initialize_real_system()
    AGENTS_AVAILABLE = success
    if success:
        print("✅ Real backend system initialized successfully")
        print(f"📊 Documents indexed: {len(real_data_storage['document_registry'])}")
        print(f"🔗 RFP mappings: {len(real_data_storage['rfp_mappings'])}")
        print("🧠 AI agents ready for analysis")
    else:
        print("⚠️ Backend system initialization failed - limited functionality available")
    print("🌐 Server ready at http://localhost:8000")
    print("📚 API Documentation at http://localhost:8000/docs")
    print("🔥 NO MOCK DATA - All responses generated from real backend")
    print("=" * 50)


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("🔄 Shutting down Real RFP Analysis System...")
    for connection in active_connections:
        try:
            await connection.close()
        except:
            pass
    print("✅ Shutdown complete")


# ===============================================================================
# LEGACY FRUIT ENDPOINTS (FOR COMPATIBILITY)
# ===============================================================================

class Fruit(BaseModel):
    name: str


class Fruits(BaseModel):
    fruits: List[Fruit]


fruits_storage = []


@app.get("/fruits", response_model=Fruits)
def get_fruits():
    """Legacy fruit endpoint"""
    return Fruits(fruits=fruits_storage)


@app.post("/fruits")
def add_fruit(fruit: Fruit):
    """Legacy fruit endpoint"""
    fruits_storage.append(fruit)
    return fruit


# ===============================================================================
# MAIN EXECUTION
# ===============================================================================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
        access_log=True
    )