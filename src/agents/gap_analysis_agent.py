import pandas as pd
import google.generativeai as genai
from .base_agent import Agent
import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from tools.gap_analysis_tool import GapAnalysisTool

class GapAnalysisAgent(Agent):
    def __init__(self):
        super().__init__()
        self.tool = GapAnalysisTool()
        genai.configure(api_key="AIzaSyCCKsZYOSP53ZGjF9p0ro1eNUYcdODCbtk")
        self.model = genai.GenerativeModel("models/gemini-2.5-flash")

    @property
    def name(self) -> str:
        return "Gap Analysis Agent"

    @property
    def description(self) -> str:
        return "Analyse les écarts entre besoins clients et ressources internes"

    def use(self, files: dict) -> tuple[str, dict]:
        # Utilisation de l'outil MCP
        analysis_result, artifacts = self.tool.use(files)
        
        # Génération du PDF
        pdf_buffer = io.BytesIO()
        doc = SimpleDocTemplate(pdf_buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        story = [Paragraph("Rapport d'Analyse", styles['Title'])]
        
        for line in analysis_result.split('\n'):
            story.append(Paragraph(line, styles['Normal']))
        
        doc.build(story)
        pdf_buffer.seek(0)
        
        return analysis_result, {
            'pdf_report': pdf_buffer,
            **artifacts
        }