"""
Système RAG (Retrieval-Augmented Generation) avancé avec support VLM et analyse RFP
==================================================================================

Ce module implémente un système RAG intelligent pour l'analyse stratégique des RFP :

FONCTIONNALITÉS CORE :
- PDFs texte standard (extraction PyPDF)
- PDFs scannés/images (extraction via VLM - Vision Language Model)
- Gestion intelligente des sources avec IDs uniques
- Filtrage par statut RFP (approuvé/rejeté)

ANALYSE STRATÉGIQUE RFP :
- Identification de patterns récurrents dans les exigences
- Analyse comparative approved vs rejected
- Détection des facteurs de succès/échec
- Extraction des enseignements métier
- Recommandations pour futures réponses

Auteur: [Votre nom]
Date: Juillet 2025
Version: 3.1 (avec Judge Pipeline corrigé)
"""

# ===============================================================================
# INSTALLATION DES DÉPENDANCES
# ===============================================================================
# Installer les dépendances nécessaires (à lancer une seule fois)
# pip install langchain langchain-community together faiss-cpu PyPDF2 pypdf pdf2image pillow sentence-transformers
# pip install google-generativeai deepeval  # Pour le judge pipeline Gemini

# ===============================================================================
# IMPORTS ET CONFIGURATION
# ===============================================================================

# Imports système et utilitaires
import os                    # Gestion fichiers/dossiers
import re                    # Expressions régulières pour extraction numéros projet
import json                  # Sauvegarde registre documents
import uuid                  # Génération IDs uniques
import base64                # Encodage images pour VLM
from io import BytesIO       # Buffer mémoire pour images
import sys                   # Redirection de sortie pour logging
from datetime import datetime # Horodatage des logs
import contextlib            # Gestion de contexte pour redirection

# Imports pour le traitement des documents avec fallbacks
try:
    from langchain_community.document_loaders import PyPDFDirectoryLoader  # Chargement PDFs
    from langchain.text_splitter import RecursiveCharacterTextSplitter      # Découpage en chunks
    from langchain_huggingface import HuggingFaceEmbeddings                 # Embeddings texte
    from langchain_community.vectorstores import FAISS                     # Base vectorielle
except ImportError:
    # Fallback pour anciennes versions de langchain
    try:
        from langchain.document_loaders import PyPDFDirectoryLoader
        from langchain.text_splitter import RecursiveCharacterTextSplitter
        from langchain_community.embeddings import HuggingFaceEmbeddings
        from langchain.vectorstores import FAISS
    except ImportError:
        print("⚠️ Modules LangChain non disponibles. Veuillez installer avec: pip install langchain langchain-community")
        PyPDFDirectoryLoader = None
        RecursiveCharacterTextSplitter = None
        HuggingFaceEmbeddings = None
        FAISS = None

# Imports pour traitement PDF et images
try:
    import PyPDF2                    # Analyse PDFs pour détection scan
    from pdf2image import convert_from_path  # Conversion PDF → images
    from PIL import Image           # Manipulation images
except ImportError:
    print("⚠️ Modules PDF/Image non disponibles. Fonctionnalités VLM désactivées.")
    PyPDF2 = None
    convert_from_path = None
    Image = None

# API Together pour LLM + VLM
try:
    from together import Together                                           # API Together (LLM + VLM)
except ImportError:
    print("⚠️ Module Together non disponible. Fonctionnalités LLM désactivées.")
    Together = None

# Judge Pipeline avec Gemini pour évaluation de fidélité
try:
    import google.generativeai as genai
    from deepeval.models.base_model import DeepEvalBaseLLM
    from deepeval.metrics import FaithfulnessMetric
    from deepeval.test_case import LLMTestCase
    judge_available = True
except ImportError:
    print("⚠️ Modules Judge Pipeline non disponibles (google-generativeai, deepeval)")
    judge_available = False

# ===============================================================================
# CONFIGURATION GLOBALE
# ===============================================================================

# Initialiser le modèle d'embeddings (transforme le texte en vecteurs numériques)
# Modèle léger et efficace pour la recherche sémantique
try:
    if HuggingFaceEmbeddings is not None:
        embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    else:
        embedding_model = None
        print("⚠️ Modèle d'embeddings non disponible. Veuillez installer les dépendances.")
except Exception as e:
    embedding_model = None
    print(f"⚠️ Erreur lors du chargement du modèle d'embeddings: {e}")

# ===============================================================================
# VARIABLES GLOBALES POUR JUDGE PIPELINE
# ===============================================================================

# Variables globales pour stocker la dernière réponse et les documents récupérés
last_answer = None
last_retrieved_docs = None

# Variables globales simples pour le dernier score et raison (pour promptEnhancer.py)
last_evaluation_score = None
last_evaluation_reason = None
last_analysis_prompt = None  # Stocker le prompt utilisé pour l'analyse complète

# ===============================================================================
# SYSTÈME DE LOGGING AUTOMATIQUE
# ===============================================================================

class ConsoleLogger:
    """
    Classe pour capturer et sauvegarder automatiquement tous les prints du système
    dans un fichier de log avec horodatage.
    """
    
    def __init__(self, log_filename=None):
        """
        Initialise le système de logging.
        
        Args:
            log_filename (str, optional): Nom du fichier de log. 
                                        Si None, génère automatiquement avec timestamp.
        """
        if log_filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            log_filename = f"rfp_analysis_log_{timestamp}.txt"
        
        self.log_filename = log_filename
        self.original_stdout = sys.stdout
        self.log_file = None
        
    def start_logging(self):
        """Démarre l'enregistrement des logs"""
        try:
            self.log_file = open(self.log_filename, 'w', encoding='utf-8')
            # Créer un wrapper qui écrit à la fois dans le terminal ET dans le fichier
            sys.stdout = self.TeeOutput(self.original_stdout, self.log_file)
            
            # Message d'initialisation
            print("=" * 80)
            print("🚀 DÉMARRAGE SYSTÈME RAG STRATÉGIQUE POUR ANALYSE RFP")
            print("=" * 80)
            print(f"📁 Logs sauvegardés dans: {self.log_filename}")
            print(f"🕐 Session démarrée: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print("=" * 80)
            
        except Exception as e:
            print(f"❌ Erreur initialisation logging: {e}")
            
    def stop_logging(self):
        """Arrête l'enregistrement des logs"""
        if self.log_file:
            print("\n" + "=" * 80)
            print("📄 FIN DE SESSION - LOGS SAUVEGARDÉS")
            print("=" * 80)
            print(f"📁 Fichier de log: {self.log_filename}")
            print(f"🕐 Session terminée: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print("💾 Tous les résultats ont été conservés pour référence future")
            print("=" * 80)
            
            sys.stdout = self.original_stdout
            self.log_file.close()
            self.log_file = None
            
    class TeeOutput:
        """Classe pour écrire simultanément dans le terminal et le fichier"""
        
        def __init__(self, terminal, file):
            self.terminal = terminal
            self.file = file
            
        def write(self, message):
            self.terminal.write(message)  # Afficher dans le terminal
            self.file.write(message)      # Sauvegarder dans le fichier
            self.file.flush()             # Forcer l'écriture immédiate
            
        def flush(self):
            self.terminal.flush()
            self.file.flush()

# Instance globale du logger
console_logger = ConsoleLogger()

# Configuration du Judge Pipeline Gemini
GOOGLE_API_KEY = "AIzaSyCEtBwwTcJitPxX6Vum92Bz6q5-Ga86hU4"
judge_llm = None
faith_metric = None

if judge_available and GOOGLE_API_KEY:
    try:
        os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY
        genai.configure(api_key=GOOGLE_API_KEY)
        
        class GeminiJudge(DeepEvalBaseLLM):
            def __init__(self, model_name="gemini-2.0-flash-exp"):
                super().__init__(model_name=model_name)
                self.model = genai.GenerativeModel(model_name)
                self.model_name = model_name
            def get_model_name(self): return self.model_name
            def load_model(self): return self
            def generate(self, prompt):
                return self.model.generate_content(prompt, safety_settings={'HARASSMENT':'BLOCK_NONE'}).text
            async def a_generate(self, prompt):
                return self.generate(prompt)
        
        judge_llm = GeminiJudge()
        faith_metric = FaithfulnessMetric(model=judge_llm, include_reason=True, threshold=0.7)
        print("✅ Judge Pipeline Gemini configuré")
    except Exception as e:
        print(f"⚠️ Erreur configuration Judge Pipeline: {e}")
        judge_llm = None

# ===============================================================================
# FONCTIONS JUDGE PIPELINE POUR ÉVALUATION AUTOMATIQUE
# ===============================================================================

def assess_faithfulness(question, answer, retrieved_docs, threshold=0.7):
    """
    Évalue la fidélité d'une réponse par rapport aux documents récupérés.
    
    Args:
        question (str): Question posée
        answer (str): Réponse générée par le RAG
        retrieved_docs (list): Documents récupérés
        threshold (float): Seuil de fidélité (0.7 par défaut)
        
    Returns:
        dict: Résultat de l'évaluation avec score, raison et recommandation
    """
    if not judge_llm or not faith_metric:
        return {
            "score": None,
            "reason": "Judge Pipeline non disponible",
            "needs_enhancement": False,
            "status": "disabled"
        }
    
    try:
        # Préparer le contexte des documents récupérés
        if isinstance(retrieved_docs, list):
            retrieval_context = [doc.page_content if hasattr(doc, 'page_content') else str(doc) for doc in retrieved_docs]
        else:
            retrieval_context = [str(retrieved_docs)]
        
        # Configurer le seuil
        faith_metric.threshold = threshold
        
        # Créer le test case
        tc = LLMTestCase(
            input=question, 
            actual_output=answer, 
            retrieval_context=retrieval_context
        )
        
        # Mesurer la fidélité
        faith_metric.measure(tc)
        
        # Stocker dans les variables globales simples
        global last_evaluation_score, last_evaluation_reason
        last_evaluation_score = faith_metric.score
        last_evaluation_reason = faith_metric.reason
        
        return {
            "score": faith_metric.score,
            "reason": faith_metric.reason,
            "needs_enhancement": faith_metric.score < threshold,
            "status": "evaluated"
        }
    except Exception as e:
        return {
            "score": None,
            "reason": f"Erreur lors de l'évaluation: {e}",
            "needs_enhancement": False,
            "status": "error"
        }

def evaluate_faithfulness_after_generation(question: str, answer: str, retrieved_docs: list):
    """
    NOUVELLE FONCTION : Évalue la fidélité APRÈS génération de la réponse.
    
    Cette fonction remplace l'ancienne logique qui tentait d'évaluer avant.
    Elle doit être appelée uniquement après que le LLM ait généré sa réponse.
    
    Args:
        question (str): Question posée par l'utilisateur
        answer (str): Réponse RÉELLE générée par le LLM
        retrieved_docs (list): Documents RÉELS utilisés pour générer la réponse
        
    Returns:
        dict: Résultat complet avec évaluation
    """
    if not answer or not retrieved_docs:
        return {
            "question": question,
            "answer": answer or "Aucune réponse disponible",
            "retrieved_count": len(retrieved_docs) if retrieved_docs else 0,
            "evaluation": {
                "score": None,
                "reason": "Données insuffisantes pour évaluation",
                "needs_enhancement": False,
                "status": "insufficient_data"
            }
        }
    
    # Évaluer la fidélité avec les vraies données
    evaluation = assess_faithfulness(question, answer, retrieved_docs)
    
    # Retourner le résultat structuré
    return {
        "question": question,
        "answer": answer,
        "retrieved_count": len(retrieved_docs),
        "evaluation": evaluation
    }

def print_judge_result(result):
    """
    Affiche le résultat du judge pipeline de manière lisible.
    
    Args:
        result (dict): Résultat du judge pipeline
    """
    print("\n" + "="*60)
    print("🔍 ÉVALUATION AUTOMATIQUE DE FIDÉLITÉ")
    print("="*60)
    
    print(f"❓ Question: {result['question']}")
    print(f"📄 Documents utilisés: {result['retrieved_count']}")
    
    eval_data = result['evaluation']
    
    if eval_data['status'] == 'evaluated':
        score = eval_data['score']
        if score is not None:
            # Affichage coloré selon le score
            if score >= 0.8:
                print(f"✅ Score de fidélité: {score:.2f} (Excellent)")
            elif score >= 0.7:
                print(f"🟡 Score de fidélité: {score:.2f} (Acceptable)")
            else:
                print(f"❌ Score de fidélité: {score:.2f} (Nécessite amélioration)")
            
            print(f"📝 Raison: {eval_data['reason']}")
            
            if eval_data['needs_enhancement']:
                print("⚠️  RECOMMANDATION: Cette réponse nécessite des améliorations")
            else:
                print("✅ RECOMMANDATION: Réponse fidèle aux sources")
        else:
            print("❌ Erreur dans l'évaluation")
    else:
        print(f"ℹ️  Statut: {eval_data['reason']}")

# ===============================================================================
# FONCTIONS DE DÉTECTION ET ANALYSE DES PDFs
# ===============================================================================

def is_pdf_scanned(pdf_path):
    """
    Détermine si un PDF contient principalement des images scannées.
    
    Algorithme de détection :
    1. Lit les 3 premières pages du PDF
    2. Extrait le texte de chaque page
    3. Si moins de 100 caractères de texte → considéré comme scanné
    
    Args:
        pdf_path (str): Chemin vers le fichier PDF à analyser
        
    Returns:
        bool: True si le PDF semble être scanné, False sinon
        
    Note:
        Cette méthode n'est pas parfaite mais fonctionne bien dans la plupart des cas.
        Un PDF avec très peu de texte peut être classé à tort comme scanné.
    """
    try:
        # Ouvrir le PDF en mode binaire pour lecture
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            total_text_length = 0
            
            # Limiter l'analyse aux 3 premières pages pour optimiser les performances
            # (la plupart des PDFs ont un contenu homogène)
            max_pages_to_check = min(3, len(pdf_reader.pages))
            
            # Parcourir chaque page et extraire le texte
            for page_num in range(max_pages_to_check):
                page = pdf_reader.pages[page_num]
                text = page.extract_text()
                total_text_length += len(text.strip())
            
            # Seuil de décision : si moins de 100 caractères de texte extractible,
            # c'est probablement un PDF scanné (images)
            return total_text_length < 100
            
    except Exception as e:
        print(f"⚠️ Erreur lors de l'analyse de {pdf_path}: {e}")
        # En cas d'erreur, considérer comme PDF standard par sécurité
        return False

# ===============================================================================
# FONCTIONS DE TRAITEMENT D'IMAGES ET VLM
# ===============================================================================

def image_to_base64(image):
    """
    Convertit une image PIL en format base64 pour transmission à l'API VLM.
    
    Le format base64 est requis par l'API Together pour envoyer des images
    dans les requêtes HTTP/JSON.
    
    Args:
        image (PIL.Image): Image PIL à convertir
        
    Returns:
        str: Chaîne base64 représentant l'image
    """
    # Créer un buffer mémoire pour stocker l'image
    buffer = BytesIO()
    # Sauvegarder l'image en format PNG dans le buffer
    image.save(buffer, format="PNG")
    # Encoder le contenu du buffer en base64
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return img_str

def extract_text_from_scanned_pdf(pdf_path, vlm_client):
    """
    Extrait le texte d'un PDF scanné en utilisant un Vision Language Model (VLM).
    
    Processus :
    1. Convertit chaque page PDF en image (200 DPI pour qualité optimale)
    2. Encode chaque image en base64
    3. Envoie l'image au VLM avec un prompt d'extraction de texte
    4. Compile tous les textes extraits en un seul document
    
    Args:
        pdf_path (str): Chemin vers le PDF scanné
        vlm_client (Together): Client API Together configuré
        
    Returns:
        str: Texte extrait de toutes les pages, séparé par des marqueurs de page
             Retourne chaîne vide en cas d'échec
    """
    try:
        print(f"🖼️ Traitement du PDF scanné: {pdf_path}")
        
        # Convertir le PDF en images haute résolution
        # DPI=200 offre un bon compromis qualité/performance pour l'OCR
        images = convert_from_path(pdf_path, dpi=200)
        extracted_texts = []
        
        # Traiter chaque page individuellement
        for i, image in enumerate(images):
            print(f"  📄 Traitement de la page {i+1}/{len(images)}")
            
            # Convertir l'image au format requis par l'API
            img_base64 = image_to_base64(image)
            
            # Construire la requête pour le VLM
            # Format spécifique requis par l'API Together pour les images
            messages = [
                {
                    "role": "user", 
                    "content": [
                        {
                            "type": "text", 
                            # Prompt optimisé pour l'extraction de texte précise
                            "text": "Extract all text from this image. Provide only the extracted text, no commentary."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{img_base64}"
                            }
                        }
                    ]
                }
            ]
            
            # Appel au modèle VLM (Vision Language Model)
            # Llama-3.2-90B-Vision spécialisé dans l'analyse d'images et OCR
            response = vlm_client.chat.completions.create(
                model="meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
                messages=messages,
                stream=False  # Mode synchrone pour garantir l'ordre des pages
            )
            
            # Extraire le texte de la réponse
            page_text = response.choices[0].message.content
            # Ajouter un marqueur de page pour la traçabilité
            extracted_texts.append(f"--- Page {i+1} ---\n{page_text}")
        
        # Combiner tous les textes extraits avec séparateurs
        return "\n\n".join(extracted_texts)
        
    except Exception as e:
        print(f"❌ Erreur lors du traitement VLM de {pdf_path}: {e}")
        # Retourner chaîne vide en cas d'échec (permet le fallback)
        return ""

# ===============================================================================
# GESTION DES DOCUMENTS ET MÉTADONNÉES
# ===============================================================================

def create_document_with_id(content, metadata, doc_type="text"):
    """
    Crée un document avec un ID unique et des métadonnées enrichies.
    
    Cette fonction génère un objet document compatible avec LangChain
    mais avec des métadonnées supplémentaires pour la traçabilité.
    
    Args:
        content (str): Contenu textuel du document
        metadata (dict): Métadonnées existantes
        doc_type (str): Type de document ('text', 'vlm_extracted', etc.)
        
    Returns:
        DocumentWithId: Objet document avec ID unique et métadonnées enrichies
    """
    # Générer un UUID unique pour ce document
    doc_id = str(uuid.uuid4())
    
    # Créer une classe document personnalisée compatible LangChain
    class DocumentWithId:
        """
        Classe document personnalisée avec support des IDs uniques.
        Compatible avec l'interface LangChain Document.
        """
        def __init__(self, page_content, metadata):
            self.page_content = page_content  # Contenu du document
            self.metadata = metadata          # Métadonnées
            # Enrichir les métadonnées avec l'ID et le type
            self.metadata['doc_id'] = doc_id
            self.metadata['doc_type'] = doc_type
    
    return DocumentWithId(content, metadata)

# ===============================================================================
# FONCTIONS UTILITAIRES POUR RFP + RÉPONSES
# ===============================================================================

def extract_project_number(filename, doc_type):
    """
    Extrait le numéro de projet d'un nom de fichier RFP ou Response.
    
    Formats attendus :
    - rfp1.pdf, rfp2.pdf, rfp10.pdf → 1, 2, 10
    - response1.pdf, response2.pdf, response10.pdf → 1, 2, 10
    
    Args:
        filename (str): Nom du fichier (ex: "rfp5.pdf")
        doc_type (str): Type de document ("rfp" ou "response")
        
    Returns:
        str: Numéro de projet ou None si format non reconnu
    """
    # Pattern pour extraire le numéro selon le type
    if doc_type == "rfp":
        pattern = r'rfp(\d+)\.pdf'
    elif doc_type == "response":
        pattern = r'response(\d+)\.pdf'
    else:
        return None
    
    match = re.match(pattern, filename.lower())
    return match.group(1) if match else None

def process_single_pdf(folder, pdf_file, doc_category, rfp_status, project_number, vlm_client):
    """
    Traite un seul fichier PDF avec métadonnées enrichies.
    
    Args:
        folder (str): Chemin du dossier contenant le PDF
        pdf_file (str): Nom du fichier PDF
        doc_category (str): "rfp" ou "response"
        rfp_status (str): "approved" ou "rejected"
        project_number (str): Numéro de projet
        vlm_client: Client VLM pour PDFs scannés
        
    Returns:
        list: Liste de documents créés
    """
    pdf_path = os.path.join(folder, pdf_file)
    print(f"    📄 Analyse de {pdf_file} (Projet {project_number})...")
    
    documents = []
    
    # ===== DÉTECTION DU TYPE DE PDF =====
    if is_pdf_scanned(pdf_path):
        # ----- PDF SCANNÉ DÉTECTÉ -----
        print(f"    🖼️ PDF scanné détecté: {pdf_file}")
        
        if vlm_client is None:
            # Fallback : pas de VLM disponible
            print(f"    ⚠️ VLM non disponible, passage en mode texte standard pour {pdf_file}")
            loader = PyPDFDirectoryLoader(folder)
            temp_docs = loader.load()
            documents = [doc for doc in temp_docs if pdf_file in doc.metadata.get('source', '')]
            doc_type = "text_fallback"
        else:
            # Traitement VLM optimal
            extracted_text = extract_text_from_scanned_pdf(pdf_path, vlm_client)
            
            if extracted_text:
                # Créer un document avec le texte extrait par VLM
                metadata = {
                    'source': pdf_path,
                    'source_folder': folder,
                    'rfp_status': rfp_status,
                    'doc_category': doc_category,
                    'project_number': project_number,
                    'extraction_method': 'vlm',
                    'original_file': pdf_file
                }
                
                doc = create_document_with_id(extracted_text, metadata, "vlm_extracted")
                documents = [doc]
                doc_type = "vlm_extracted"
            else:
                print(f"    ❌ Échec de l'extraction VLM pour {pdf_file}")
                return []
    else:
        # ----- PDF TEXTE STANDARD -----
        print(f"    📝 PDF texte standard: {pdf_file}")
        # Utiliser l'extraction texte classique (PyPDF)
        loader = PyPDFDirectoryLoader(folder)
        temp_docs = loader.load()
        
        # Filtrer pour ne garder que le fichier actuel
        documents = [doc for doc in temp_docs if pdf_file in doc.metadata.get('source', '')]
        doc_type = "text_standard"
    
    # ===== ENRICHISSEMENT DES MÉTADONNÉES =====
    for doc in documents:
        # Assurer la compatibilité des métadonnées
        if not hasattr(doc.metadata, 'get'):
            doc.metadata = {}
        
        # Ajouter les métadonnées standardisées
        doc.metadata['source_folder'] = folder
        doc.metadata['rfp_status'] = rfp_status
        doc.metadata['doc_category'] = doc_category
        doc.metadata['project_number'] = project_number
        doc.metadata['doc_type'] = doc_type
        doc.metadata['original_file'] = pdf_file
        
        # Générer un ID unique si pas déjà présent
        if 'doc_id' not in doc.metadata:
            doc.metadata['doc_id'] = str(uuid.uuid4())
    
    return documents

# ===============================================================================
# FONCTION PRINCIPALE DE CHARGEMENT ET TRAITEMENT DES DOCUMENTS RFP + RÉPONSES
# ===============================================================================

def load_and_chunk_documents(pdf_folders=["./approvedRfp/rfp", "./approvedRfp/ResponseRfp", "./rejectedRfp/rfp", "./rejectedRfp/ResponsRfp"], vlm_client=None):
    """
    Fonction principale de chargement et traitement des documents PDF RFP + Réponses.
    
    Args:
        pdf_folders (list): Liste des 4 dossiers spécifiques à traiter
        vlm_client (Together, optional): Client API pour le traitement VLM des scannés
        
    Returns:
        tuple: (chunks, document_registry, rfp_response_mapping)
    """
    print("🔄 Chargement des documents RFP et Réponses depuis les 4 dossiers...")
    all_documents = []                # Stockage de tous les documents traités
    document_registry = {}            # Registre pour la traçabilité
    rfp_response_mapping = {}         # Correspondance RFP ↔ Réponse par projet

    # ===== MAPPING DES DOSSIERS AVEC LEURS CARACTÉRISTIQUES =====
    folder_mapping = {
        "./approvedRfp/rfp": {"rfp_status": "approved", "doc_category": "rfp"},
        "./approvedRfp/ResponseRfp": {"rfp_status": "approved", "doc_category": "response"}, 
        "./rejectedRfp/rfp": {"rfp_status": "rejected", "doc_category": "rfp"},
        "./rejectedRfp/ResponsRfp": {"rfp_status": "rejected", "doc_category": "response"}
    }

    # ===== TRAITEMENT DIRECT DE CHAQUE DOSSIER =====
    for folder_path in pdf_folders:
        if not os.path.exists(folder_path):
            print(f"⚠️ Le dossier {folder_path} n'existe pas")
            continue
            
        # Récupérer les caractéristiques du dossier
        folder_info = folder_mapping.get(folder_path, {"rfp_status": "unknown", "doc_category": "unknown"})
        rfp_status = folder_info["rfp_status"]
        doc_category = folder_info["doc_category"]
        
        print(f"📁 Traitement du dossier {folder_path} ({rfp_status.upper()} {doc_category.upper()})...")
        
        # Lister tous les fichiers PDF du dossier
        pdf_files = [f for f in os.listdir(folder_path) if f.lower().endswith('.pdf')]
        
        for pdf_file in pdf_files:
            # Extraction du numéro de projet selon le type de document
            project_number = extract_project_number(pdf_file, doc_category)
            if project_number is None:
                print(f"    ⚠️ Format non reconnu pour {pdf_file}, traitement comme document isolé")
                project_number = "unknown"
            
            # Traitement du document PDF
            docs = process_single_pdf(
                folder=folder_path, 
                pdf_file=pdf_file, 
                doc_category=doc_category,
                rfp_status=rfp_status,
                project_number=project_number,
                vlm_client=vlm_client
            )
            
            # Ajouter à la collection et au registre
            all_documents.extend(docs)
            for doc in docs:
                document_registry[doc.metadata['doc_id']] = {
                    'file': pdf_file,
                    'folder': folder_path,
                    'type': doc.metadata['doc_type'],
                    'status': rfp_status,
                    'category': doc_category,
                    'project_number': project_number
                }
                
                # Gérer le mapping RFP-Réponse
                if project_number not in rfp_response_mapping:
                    rfp_response_mapping[project_number] = {'rfp': None, 'response': None, 'status': rfp_status}
                
                # Assigner l'ID selon le type de document
                if doc_category == "rfp":
                    rfp_response_mapping[project_number]['rfp'] = doc.metadata['doc_id']
                elif doc_category == "response":
                    rfp_response_mapping[project_number]['response'] = doc.metadata['doc_id']
        
        print(f"✅ Dossier {folder_path} terminé")
    
    # ===== VÉRIFICATION ET VALIDATION =====
    if not all_documents:
        print("⚠️ Aucun document trouvé dans les dossiers spécifiés")
        return [], {}, {}

    # ===== AFFICHAGE STATISTIQUES =====
    print(f"\n📊 STATISTIQUES DE TRAITEMENT:")
    print(f"  📄 Total documents: {len(all_documents)}")
    print(f"  🔗 Projets mappés: {len(rfp_response_mapping)}")
    
    # Compter les paires complètes RFP-Réponse
    complete_pairs = sum(1 for mapping in rfp_response_mapping.values() 
                        if mapping['rfp'] and mapping['response'])
    print(f"  ✅ Paires RFP-Réponse complètes: {complete_pairs}")

    # ===== DÉCOUPAGE EN CHUNKS =====
    print(f"🧩 Découpage en chunks de {len(all_documents)} documents...")
    # Paramètres optimisés pour la recherche sémantique
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,      # Taille optimale pour les embeddings
        chunk_overlap=200     # Chevauchement pour préserver le contexte
    )
    chunks = splitter.split_documents(all_documents)
    
    # ===== SAUVEGARDE DES REGISTRES =====
    # Sauvegarder le registre des documents
    with open("./document_registry.json", "w", encoding="utf-8") as f:
        json.dump(document_registry, f, indent=2, ensure_ascii=False)
    
    # Sauvegarder le mapping RFP-Réponse
    with open("./rfp_response_mapping.json", "w", encoding="utf-8") as f:
        json.dump(rfp_response_mapping, f, indent=2, ensure_ascii=False)
    
    print(f"💾 Registres sauvegardés:")
    print(f"  📋 Documents: {len(document_registry)} entrées")
    print(f"  🔗 Mapping RFP-Réponse: {len(rfp_response_mapping)} projets")
    
    return chunks, document_registry, rfp_response_mapping

# ===============================================================================
# FONCTIONS D'INDEXATION ET DE RECHERCHE VECTORIELLE
# ===============================================================================

def create_faiss_index(chunks, faiss_path="./faiss_index"):
    """
    Crée un index FAISS pour la recherche vectorielle sémantique.
    
    FAISS (Facebook AI Similarity Search) permet une recherche rapide
    dans de grandes collections de vecteurs d'embeddings.
    
    Args:
        chunks (list): Liste des chunks de documents à indexer
        faiss_path (str): Chemin de sauvegarde de l'index
        
    Returns:
        FAISS: Objet vectorstore FAISS prêt pour la recherche
    """
    print("🧠 Génération des embeddings et création de l'index FAISS...")
    # Créer l'index vectoriel à partir des chunks et du modèle d'embeddings
    vectorstore = FAISS.from_documents(chunks, embedding_model)
    # Sauvegarder l'index sur disque pour réutilisation
    vectorstore.save_local(faiss_path)
    return vectorstore

def retrieve_similar_chunks(vectorstore, query, k=5):
    """
    Recherche simple de chunks similaires dans l'index vectoriel.
    
    Args:
        vectorstore (FAISS): Index vectoriel FAISS
        query (str): Requête de recherche
        k (int): Nombre de chunks à retourner
        
    Returns:
        list: Liste des k chunks les plus similaires
    """
    return vectorstore.similarity_search(query, k=k)

def retrieve_similar_chunks_with_filter(vectorstore, query, k=5, rfp_status=None):
    """
    Recherche de chunks similaires avec filtrage par statut RFP.
    
    Cette fonction permet de limiter la recherche aux RFP approuvés
    ou rejetés selon le besoin.
    
    Args:
        vectorstore (FAISS): Index vectoriel FAISS
        query (str): Requête de recherche
        k (int): Nombre de chunks à retourner
        rfp_status (str, optional): 'approved', 'rejected', ou None pour tous
        
    Returns:
        list: Liste des chunks filtrés et similaires
        
    Note:
        La stratégie de filtrage récupère plus de documents que nécessaire
        puis filtre par métadonnées pour garantir d'avoir assez de résultats.
    """
    if rfp_status is None:
        # Pas de filtre : recherche normale
        return vectorstore.similarity_search(query, k=k)
    else:
        # Avec filtre : récupérer plus de documents puis filtrer
        # Facteur 5 pour compenser les documents filtrés
        docs = vectorstore.similarity_search(query, k=k*5)
        # Filtrer par statut RFP dans les métadonnées
        filtered_docs = [doc for doc in docs if doc.metadata.get('rfp_status') == rfp_status]
        # Retourner seulement les k premiers résultats
        return filtered_docs[:k]

# ===============================================================================
# FONCTIONS D'ANALYSE STRATÉGIQUE RFP
# ===============================================================================

def analyze_rfp_patterns(vectorstore, category="exigences techniques", k=10):
    """
    🧠 RECONNAISSANCE INTELLIGENTE DE PATTERNS DANS LES RFP
    ======================================================
    
    Cette fonction est le cœur de la valeur ajoutée du système : elle identifie 
    automatiquement les patterns récurrents dans les demandes clients pour une 
    catégorie donnée.
    
    Args:
        vectorstore (FAISS): Index vectoriel FAISS pour la recherche sémantique
        category (str): Catégorie à analyser pour reconnaissance de patterns
        k (int): Nombre de documents à analyser par statut (approved/rejected)
        
    Returns:
        dict: Analyse de patterns avec métriques de récurrence et exemples concrets
    """
    print(f"🔍 Analyse des patterns pour: {category}")
    
    # ===== RECHERCHE DANS LES RFP APPROUVÉS =====
    approved_docs = retrieve_similar_chunks_with_filter(
        vectorstore, category, k=k, rfp_status="approved"
    )
    
    # ===== RECHERCHE DANS LES RFP REJETÉS =====
    rejected_docs = retrieve_similar_chunks_with_filter(
        vectorstore, category, k=k, rfp_status="rejected"
    )
    
    # ===== CONSTRUCTION DE L'ANALYSE COMPARATIVE =====
    analysis = {
        "category": category,
        "approved_count": len(approved_docs),     
        "rejected_count": len(rejected_docs),     
        "approved_patterns": [doc.page_content[:200] + "..." for doc in approved_docs[:3]],
        "rejected_patterns": [doc.page_content[:200] + "..." for doc in rejected_docs[:3]],
        "total_analyzed": len(approved_docs) + len(rejected_docs)
    }
    
    return analysis

def compare_success_failure_factors(vectorstore, topic="méthodologie", k=5):
    """
    Compare les facteurs de succès vs échec pour un sujet donné.
    
    Args:
        vectorstore (FAISS): Index vectoriel FAISS pour recherche sémantique
        topic (str): Sujet à comparer (mots-clés libres)
        k (int): Nombre de documents par catégorie (approved/rejected)
        
    Returns:
        dict: Comparaison structurée avec success_factors et failure_factors
    """
    print(f"⚖️ Comparaison succès/échec pour: {topic}")
    
    # ===== ANALYSE DES FACTEURS DE SUCCÈS =====
    approved_docs = retrieve_similar_chunks_with_filter(
        vectorstore, topic, k=k, rfp_status="approved"
    )
    
    # ===== ANALYSE DES FACTEURS D'ÉCHEC =====
    rejected_docs = retrieve_similar_chunks_with_filter(
        vectorstore, topic, k=k, rfp_status="rejected"
    )
    
    # ===== CONSTRUCTION DE LA COMPARAISON STRUCTURÉE =====
    comparison = {
        "topic": topic,
        "success_factors": {
            "count": len(approved_docs),
            "sources": [doc.metadata.get('original_file', 'unknown') for doc in approved_docs],
            "key_elements": [doc.page_content[:300] for doc in approved_docs]
        },
        "failure_factors": {
            "count": len(rejected_docs),
            "sources": [doc.metadata.get('original_file', 'unknown') for doc in rejected_docs],
            "key_elements": [doc.page_content[:300] for doc in rejected_docs]
        }
    }
    
    return comparison

def extract_lessons_learned(vectorstore, focus_area="points faibles", k=8):
    """
    Extrait les enseignements clés de nos réponses passées.
    
    Args:
        vectorstore (FAISS): Index vectoriel FAISS pour recherche sémantique
        focus_area (str): Zone d'analyse ("forces", "faiblesses", "améliorations", etc.)
        k (int): Nombre d'exemples à analyser (multiplié par 2 pour recherche large)
        
    Returns:
        dict: Enseignements structurés avec from_successes et from_failures
    """
    print(f"📚 Extraction des enseignements: {focus_area}")
    
    # ===== RECHERCHE LARGE POUR CAPTURE MAXIMALE =====
    all_docs = retrieve_similar_chunks(vectorstore, focus_area, k=k*2)
    
    # ===== SÉPARATION AUTOMATIQUE PAR STATUT =====
    approved_lessons = [doc for doc in all_docs if doc.metadata.get('rfp_status') == 'approved']
    rejected_lessons = [doc for doc in all_docs if doc.metadata.get('rfp_status') == 'rejected']
    
    # ===== STRUCTURATION DES ENSEIGNEMENTS =====
    lessons = {
        "focus_area": focus_area,
        "from_successes": {
            "count": len(approved_lessons),
            "insights": [doc.page_content[:250] for doc in approved_lessons[:3]]
        },
        "from_failures": {
            "count": len(rejected_lessons),
            "insights": [doc.page_content[:250] for doc in rejected_lessons[:3]]
        },
        "recommendations": f"Basé sur {len(all_docs)} documents analysés - "
                          f"Taux de succès: {len(approved_lessons)}/{len(all_docs)} "
                          f"({len(approved_lessons)/len(all_docs)*100:.1f}%)"
    }
    
    return lessons

def identify_recurring_requirements(vectorstore, requirement_type="fonctionnalités", k=15):
    """
    🔄 DÉTECTION AVANCÉE DE PATTERNS RÉCURRENTS DANS LES EXIGENCES
    =============================================================
    
    Cette fonction spécialisée applique des algorithmes de pattern recognition 
    pour identifier automatiquement les exigences qui se répètent à travers 
    l'historique des RFP.
    
    Args:
        vectorstore (FAISS): Index vectoriel FAISS pour recherche sémantique
        requirement_type (str): Type d'exigence à analyser (mots-clés libres)
        k (int): Nombre de documents à examiner (recommandé: 15+ pour statistiques)
        
    Returns:
        dict: Analyse de récurrence avec in_approved_rfp et in_rejected_rfp
    """
    print(f"🔄 Identification des exigences récurrentes: {requirement_type}")
    
    # ===== RECHERCHE LARGE POUR CAPTURE EXHAUSTIVE =====
    docs = retrieve_similar_chunks(vectorstore, requirement_type, k=k)
    
    # ===== SEGMENTATION PAR RÉSULTAT =====
    approved_req = [doc for doc in docs if doc.metadata.get('rfp_status') == 'approved']
    rejected_req = [doc for doc in docs if doc.metadata.get('rfp_status') == 'rejected']
    
    # ===== ANALYSE DES SOURCES POUR VALIDATION =====
    approved_sources = list(set([doc.metadata.get('original_file', 'unknown') for doc in approved_req]))
    rejected_sources = list(set([doc.metadata.get('original_file', 'unknown') for doc in rejected_req]))
    
    # ===== CONSTRUCTION DE L'ANALYSE DE RÉCURRENCE =====
    analysis = {
        "requirement_type": requirement_type,
        "total_occurrences": len(docs),
        "in_approved_rfp": {
            "count": len(approved_req),
            "sources": approved_sources,
            "examples": [doc.page_content[:200] for doc in approved_req[:3]]
        },
        "in_rejected_rfp": {
            "count": len(rejected_req),
            "sources": rejected_sources,
            "examples": [doc.page_content[:200] for doc in rejected_req[:3]]
        },
        "recurrence_rate": f"{len(docs)} occurrences dans {len(set(approved_sources + rejected_sources))} projets "
                          f"(Succès: {len(approved_sources)}, Échecs: {len(rejected_sources)})"
    }
    
    return analysis

def generate_strategic_insights(vectorstore, business_question):
    """
    Génère des insights stratégiques basés sur une question métier.
    
    Args:
        vectorstore (FAISS): Index vectoriel FAISS pour recherche sémantique
        business_question (str): Question stratégique métier à analyser
        
    Returns:
        str: Contexte structuré prêt pour analyse LLM
    """
    print(f"💡 Génération d'insights stratégiques...")
    
    # ===== RECHERCHE CONTEXTUELLE LARGE =====
    relevant_docs = retrieve_similar_chunks(vectorstore, business_question, k=8)
    
    # ===== SÉPARATION POUR ANALYSE COMPARATIVE =====
    approved_context = [doc for doc in relevant_docs if doc.metadata.get('rfp_status') == 'approved']
    rejected_context = [doc for doc in relevant_docs if doc.metadata.get('rfp_status') == 'rejected']
    
    # ===== CONSTRUCTION DU CONTEXTE STRATÉGIQUE =====
    strategic_context = f"""
CONTEXTE D'ANALYSE STRATÉGIQUE RFP:

=== EXEMPLES DE RÉUSSITES ({len(approved_context)} cas) ===
{chr(10).join([f"- Projet: {doc.metadata.get('original_file', 'unknown')[:30]}... | "
               f"Extrait: {doc.page_content[:300]}" for doc in approved_context[:3]])}

=== EXEMPLES D'ÉCHECS ({len(rejected_context)} cas) ===
{chr(10).join([f"- Projet: {doc.metadata.get('original_file', 'unknown')[:30]}... | "
               f"Extrait: {doc.page_content[:300]}" for doc in rejected_context[:3]])}

=== STATISTIQUES DE PERFORMANCE ===
- Total documents analysés: {len(relevant_docs)}
- Réussites: {len(approved_context)} cas ({len(approved_context)/len(relevant_docs)*100:.1f}%)
- Échecs: {len(rejected_context)} cas ({len(rejected_context)/len(relevant_docs)*100:.1f}%)
- Taux de succès sur ce sujet: {len(approved_context)}/{len(relevant_docs)}

=== MÉTADONNÉES D'ANALYSE ===
- Type de recherche: Analyse vectorielle sémantique
- Scope: Historique complet des RFP indexed
- Méthode: Comparaison approved vs rejected
- Fiabilité: Basée sur {len(relevant_docs)} échantillons réels

QUESTION MÉTIER À ANALYSER: {business_question}
"""
    
    return strategic_context

def get_context_with_sources(docs):
    """
    Créer un contexte enrichi avec les informations de source pour le LLM.
    
    Cette fonction format le contexte de manière à fournir au LLM
    toutes les informations nécessaires sur l'origine des données,
    permettant une traçabilité complète des réponses.
    
    Args:
        docs (list): Liste des documents récupérés par la recherche vectorielle
        
    Returns:
        str: Contexte formaté avec métadonnées de source pour chaque document
    """
    context_parts = []
    
    for i, doc in enumerate(docs, 1):
        # Extraire les métadonnées importantes de chaque document
        source_folder = doc.metadata.get('source_folder', 'unknown')
        rfp_status = doc.metadata.get('rfp_status', 'unknown')
        doc_type = doc.metadata.get('doc_type', 'unknown')
        doc_id = doc.metadata.get('doc_id', 'unknown')
        source_file = doc.metadata.get('source', 'unknown')
        
        # Formatter chaque source avec ses métadonnées
        context_parts.append(
            f"[Source {i} - {rfp_status.upper()} RFP | Type: {doc_type} | ID: {doc_id[:8]}...]:\n"
            f"Fichier: {source_file}\n"
            f"{doc.page_content}\n"
        )
    
    # Joindre tous les contextes avec des séparateurs clairs
    return "\n\n".join(context_parts)

def load_document_registry():
    """
    Charge le registre des documents depuis le fichier JSON.
    
    Le registre contient la correspondance entre les IDs de documents
    et leurs métadonnées (fichier, dossier, type, statut).
    
    Returns:
        dict: Registre des documents ou dictionnaire vide si le fichier n'existe pas
    """
    try:
        with open("./document_registry.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        # Retourner un dictionnaire vide si le fichier n'existe pas encore
        return {}

def display_document_registry():
    """
    Affiche le registre des documents de manière lisible.
    
    Utile pour le debugging et la vérification du contenu indexé.
    """
    registry = load_document_registry()
    if not registry:
        print("📋 Aucun registre de documents trouvé")
        return
    
    print("\n📋 Registre des documents:")
    for doc_id, info in registry.items():
        # Afficher les informations essentielles de chaque document
        print(f"  🆔 {doc_id[:8]}... | {info['file']} | {info['type']} | {info['status']}")

# ===============================================================================
# NOUVELLES FONCTIONS D'ANALYSE RFP + RÉPONSES
# ===============================================================================

def retrieve_similar_chunks_with_category_filter(vectorstore, query, k=5, rfp_status=None, doc_category=None):
    """
    Recherche avancée avec filtrage par statut ET catégorie de document.
    
    Args:
        vectorstore (FAISS): Index vectoriel FAISS
        query (str): Requête de recherche sémantique
        k (int): Nombre de chunks à retourner
        rfp_status (str, optional): 'approved', 'rejected', ou None
        doc_category (str, optional): 'rfp', 'response', ou None
        
    Returns:
        list: Chunks filtrés selon les critères demandés
    """
    # Recherche large pour avoir assez de résultats après filtrage
    docs = vectorstore.similarity_search(query, k=k*4)
    
    # Appliquer les filtres demandés
    filtered_docs = docs
    
    if rfp_status:
        filtered_docs = [doc for doc in filtered_docs 
                        if doc.metadata.get('rfp_status') == rfp_status]
    
    if doc_category:
        filtered_docs = [doc for doc in filtered_docs 
                        if doc.metadata.get('doc_category') == doc_category]
    
    # Retourner les k premiers résultats filtrés
    return filtered_docs[:k]

def analyze_rfp_vs_response_patterns(vectorstore, topic="architecture technique", k=8):
    """
    Compare les patterns dans les RFP (demandes) vs nos Réponses pour un sujet donné.
    
    Args:
        vectorstore (FAISS): Index vectoriel pour recherche sémantique
        topic (str): Sujet à comparer entre RFP et Réponses
        k (int): Nombre de documents par catégorie à analyser
        
    Returns:
        dict: Analyse comparative structurée
    """
    print(f"🔄 Analyse RFP vs Réponses pour: {topic}")
    
    # ===== ANALYSE DES DEMANDES CLIENTS (RFP) =====
    approved_rfp = retrieve_similar_chunks_with_category_filter(
        vectorstore, topic, k=k, rfp_status="approved", doc_category="rfp"
    )
    rejected_rfp = retrieve_similar_chunks_with_category_filter(
        vectorstore, topic, k=k, rfp_status="rejected", doc_category="rfp"
    )
    
    # ===== ANALYSE DE NOS RÉPONSES =====
    approved_responses = retrieve_similar_chunks_with_category_filter(
        vectorstore, topic, k=k, rfp_status="approved", doc_category="response"
    )
    rejected_responses = retrieve_similar_chunks_with_category_filter(
        vectorstore, topic, k=k, rfp_status="rejected", doc_category="response"
    )
    
    # ===== CONSTRUCTION DE L'ANALYSE COMPARATIVE =====
    analysis = {
        "topic": topic,
        "client_demands": {
            "approved_projects": {
                "count": len(approved_rfp),
                "patterns": [doc.page_content[:250] for doc in approved_rfp[:3]],
                "sources": [doc.metadata.get('project_number', 'unknown') for doc in approved_rfp]
            },
            "rejected_projects": {
                "count": len(rejected_rfp), 
                "patterns": [doc.page_content[:250] for doc in rejected_rfp[:3]],
                "sources": [doc.metadata.get('project_number', 'unknown') for doc in rejected_rfp]
            }
        },
        "our_responses": {
            "winning_responses": {
                "count": len(approved_responses),
                "patterns": [doc.page_content[:250] for doc in approved_responses[:3]],
                "sources": [doc.metadata.get('project_number', 'unknown') for doc in approved_responses]
            },
            "losing_responses": {
                "count": len(rejected_responses),
                "patterns": [doc.page_content[:250] for doc in rejected_responses[:3]],
                "sources": [doc.metadata.get('project_number', 'unknown') for doc in rejected_responses]
            }
        },
        "alignment_analysis": {
            "total_client_demands": len(approved_rfp) + len(rejected_rfp),
            "total_our_responses": len(approved_responses) + len(rejected_responses),
            "success_rate": f"{len(approved_responses)}/{len(approved_responses) + len(rejected_responses)}" 
                           if (len(approved_responses) + len(rejected_responses)) > 0 else "0/0"
        }
    }
    
    return analysis

def find_recurring_patterns_in_category(vectorstore, category="rfp", requirement_type="technologies", k=12):
    """
    🎯 RECONNAISSANCE SPÉCIALISÉE DE PATTERNS PAR CATÉGORIE
    =======================================================
    
    Cette fonction applique des techniques avancées de pattern recognition pour 
    identifier les récurrences spécifiquement dans les RFP clients OU dans nos 
    Réponses techniques.
    
    Args:
        vectorstore (FAISS): Index vectoriel pour recherche sémantique
        category (str): "rfp" pour demandes clients, "response" pour nos réponses
        requirement_type (str): Type d'exigence/sujet à analyser
        k (int): Nombre de documents à examiner (recommandé 12+ pour stats)
        
    Returns:
        dict: Analyse de récurrence avec approved_patterns et rejected_patterns
    """
    print(f"🔍 Patterns récurrents dans {category.upper()}: {requirement_type}")
    
    # ===== RECHERCHE DANS LA CATÉGORIE SPÉCIFIÉE =====
    approved_docs = retrieve_similar_chunks_with_category_filter(
        vectorstore, requirement_type, k=k, rfp_status="approved", doc_category=category
    )
    rejected_docs = retrieve_similar_chunks_with_category_filter(
        vectorstore, requirement_type, k=k, rfp_status="rejected", doc_category=category
    )
    
    # ===== EXTRACTION DES PROJETS SOURCES =====
    approved_projects = list(set([doc.metadata.get('project_number', 'unknown') for doc in approved_docs]))
    rejected_projects = list(set([doc.metadata.get('project_number', 'unknown') for doc in rejected_docs]))
    
    # ===== CONSTRUCTION DE L'ANALYSE =====
    analysis = {
        "category": category,
        "requirement_type": requirement_type,
        "approved_patterns": {
            "count": len(approved_docs),
            "projects": approved_projects,
            "examples": [doc.page_content[:300] for doc in approved_docs[:4]],
            "success_rate": f"{len(approved_projects)} projets gagnés"
        },
        "rejected_patterns": {
            "count": len(rejected_docs),
            "projects": rejected_projects,
            "examples": [doc.page_content[:300] for doc in rejected_docs[:4]],
            "failure_rate": f"{len(rejected_projects)} projets perdus"
        },
        "recurrence_insights": {
            "total_occurrences": len(approved_docs) + len(rejected_docs),
            "total_projects": len(set(approved_projects + rejected_projects)),
            "success_ratio": f"{len(approved_docs)}/{len(approved_docs) + len(rejected_docs)}" 
                           if (len(approved_docs) + len(rejected_docs)) > 0 else "0/0",
            "pattern_strength": "Fort" if len(approved_docs) + len(rejected_docs) > 8 else "Modéré"
        }
    }
    
    return analysis

def load_rfp_response_mapping():
    """
    Charge le mapping RFP-Réponse depuis le fichier JSON.
    
    Returns:
        dict: Mapping des correspondances ou dictionnaire vide si inexistant
    """
    try:
        with open("./rfp_response_mapping.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def display_rfp_response_mapping():
    """
    Affiche le mapping RFP-Réponse de manière lisible.
    
    Utile pour vérifier les correspondances entre demandes et réponses.
    """
    mapping = load_rfp_response_mapping()
    if not mapping:
        print("🔗 Aucun mapping RFP-Réponse trouvé")
        return
    
    print("\n🔗 Mapping RFP ↔ Réponse:")
    for project_num, info in mapping.items():
        rfp_status = "✅" if info['rfp'] else "❌"
        response_status = "✅" if info['response'] else "❌"
        print(f"  📁 Projet {project_num} ({info['status']}) | RFP: {rfp_status} | Réponse: {response_status}")

# ===============================================================================
# CLASSE WRAPPER POUR LE MODÈLE DE LANGAGE (LLM)
# ===============================================================================

class LLMWrapper:
    """
    Wrapper pour l'API Together et le modèle DeepSeek avec spécialisation RFP.
    
    Cette classe encapsule l'interaction avec l'API Together pour
    simplifier les appels au modèle de langage et standardiser
    le format des requêtes avec des prompts spécialisés pour l'analyse RFP.
    
    Attributes:
        client (Together): Client API Together configuré
        model (str): Nom du modèle LLM à utiliser
    """
    
    def __init__(self, api_key: str):
        """
        Initialise le wrapper LLM avec la clé API.
        
        Args:
            api_key (str): Clé API Together pour l'authentification
        """
        self.client = Together(api_key=api_key)
        # DeepSeek-V3 : modèle performant pour les tâches de compréhension et génération
        self.model = "deepseek-ai/DeepSeek-V3"

    def invoke(self, question: str, context: str) -> str:
        """
        Génère une réponse basée sur le contexte fourni.
        
        Cette méthode construit un prompt optimisé qui :
        1. Instruit le modèle sur son rôle et ses limites
        2. Fournit le contexte récupéré par la recherche vectorielle
        3. Pose la question de l'utilisateur
        4. Lance automatiquement l'évaluation de fidélité APRÈS génération
        
        Args:
            question (str): Question de l'utilisateur
            context (str): Contexte récupéré avec métadonnées de source
            
        Returns:
            str: Réponse générée par le modèle
        """
        # Construction du prompt avec instructions système et contexte
        messages = [
            {
                "role": "system", 
                "content": (
                    "You are an intelligent assistant that answers based on the context provided. "
                    "If the context doesn't contain the answer, say you don't know. "
                    "Pay attention to document IDs and types mentioned in the context. "
                    "Always cite your sources when possible.\n\n"
                    f"Context:\n{context}"
                )
            },
            {
                "role": "user", 
                "content": question
            }
        ]

        print("🤖 Appel au modèle DeepSeek...")
        # Appel synchrone à l'API Together
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            stream=False  # Mode synchrone pour garantir la réponse complète
        )
        
        # Extraire le contenu de la réponse
        answer = response.choices[0].message.content
        
        # Stocker dans les variables globales pour le judge pipeline
        global last_answer
        last_answer = answer
        
        # Retourner la réponse (l'évaluation se fera après dans le main)
        return answer

    def analyze_rfp_strategy(self, question: str, context: str) -> str:
        """
        Génère une analyse stratégique spécialisée pour les RFP.
        
        Utilise un prompt spécialisé pour l'analyse comparative et stratégique.
        
        Args:
            question (str): Question stratégique
            context (str): Contexte d'analyse avec données approved/rejected
            
        Returns:
            str: Analyse stratégique détaillée
        """
        messages = [
            {
                "role": "system", 
                "content": (
                    "Tu es un consultant expert en analyse stratégique de RFP (Request for Proposal). "
                    "Ton rôle est d'analyser les données de réponses passées pour identifier :\n"
                    "- Les patterns de succès et d'échec\n"
                    "- Les facteurs différenciants dans les propositions gagnantes\n"
                    "- Les faiblesses récurrentes dans les échecs\n"
                    "- Des recommandations concrètes pour améliorer les futures réponses\n\n"
                    "INSTRUCTIONS SPÉCIFIQUES :\n"
                    "- Compare systématiquement les cas 'approved' vs 'rejected'\n"
                    "- Identifie les patterns récurrents et les différences clés\n"
                    "- Fournis des insights actionnables basés sur les données\n"
                    "- Cite toujours tes sources avec les IDs de documents\n"
                    "- Structure ta réponse avec des sections claires\n\n"
                    f"DONNÉES D'ANALYSE :\n{context}"
                )
            },
            {
                "role": "user", 
                "content": f"Analyse stratégique demandée : {question}"
            }
        ]

        print("🧠 Génération d'analyse stratégique RFP...")
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            stream=False
        )
        
        # Extraire le contenu de la réponse
        answer = response.choices[0].message.content
        
        # Stocker dans les variables globales pour le judge pipeline
        global last_answer
        last_answer = answer
        
        # Retourner la réponse (l'évaluation se fera après dans le main)
        return answer

# ===============================================================================
# ANALYSE LLM INTELLIGENTE POUR PATTERNS STRATÉGIQUES
# ===============================================================================

def analyze_strategic_patterns_with_llm(vectorstore, llm_client, category="méthodologie", k=10):
    """
    🧠 ANALYSE LLM INTELLIGENTE POUR PATTERNS STRATÉGIQUES
    ======================================================
    
    Cette fonction utilise un LLM pour analyser le contenu et générer des insights
    stratégiques structurés, comme les patterns de succès vs échec que vous voulez.
    
    Args:
        vectorstore (FAISS): Index vectoriel pour recherche
        llm_client (Together): Client LLM pour analyse intelligente
        category (str): Catégorie à analyser
        k (int): Nombre de documents à analyser
        
    Returns:
        dict: Patterns stratégiques structurés avec insights LLM
    """
    print(f"🧠 Analyse LLM intelligente pour: {category}")
    
    # ===== COLLECTE DES DONNÉES =====
    approved_docs = retrieve_similar_chunks_with_filter(
        vectorstore, category, k=k, rfp_status="approved"
    )
    rejected_docs = retrieve_similar_chunks_with_filter(
        vectorstore, category, k=k, rfp_status="rejected"
    )
    
    # ===== PRÉPARATION DU CONTEXTE POUR LLM =====
    context = f"""
ANALYSE STRATÉGIQUE DES PATTERNS RFP - CATÉGORIE: {category.upper()}

=== DOCUMENTS DES PROJETS GAGNÉS (APPROVED) ===
{chr(10).join([f"Document {i+1}: {doc.page_content[:800]}" for i, doc in enumerate(approved_docs[:5])])}

=== DOCUMENTS DES PROJETS PERDUS (REJECTED) ===
{chr(10).join([f"Document {i+1}: {doc.page_content[:800]}" for i, doc in enumerate(rejected_docs[:5])])}

=== MISSION D'ANALYSE ===
Analysez ces documents pour identifier des patterns stratégiques concrets et actionnables.
"""
    
    # ===== PROMPT SPÉCIALISÉ POUR PATTERN RECOGNITION =====
    prompt = f"""
Tu es un expert en analyse stratégique d'appels d'offres. Analyse les documents fournis pour identifier des patterns de succès et d'échec.

CONTEXTE:
{context}

MISSION:
Identifie les patterns différenciants entre les projets gagnés et perdus pour la catégorie "{category}".

FORMAT DE SORTIE REQUIS:
✅ PATTERNS DE SUCCÈS (ce qui marche):
- Pattern concret 1 (avec explication stratégique)
- Pattern concret 2 (avec explication stratégique)  
- Pattern concret 3 (avec explication stratégique)

❌ ANTI-PATTERNS (ce qui fait échouer):
- Anti-pattern 1 (avec explication des risques)
- Anti-pattern 2 (avec explication des risques)
- Anti-pattern 3 (avec explication des risques)

🎯 INSIGHTS STRATÉGIQUES:
- Facteur différenciant clé
- Recommandation actionnable
- Point d'attention critique

INSTRUCTIONS:
1. Sois concret et actionnable (pas de généralités)
2. Base-toi sur les contenus réels des documents
3. Identifie les différences tangibles entre succès et échecs
4. Donne des recommendations pratiques pour gagner plus
5. Utilise un langage business et stratégique

RÉPONSE:
"""
    
    try:
        # ===== APPEL LLM POUR ANALYSE INTELLIGENTE =====
        response = llm_client.chat.completions.create(
            model="meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
            messages=[{"role": "user", "content": prompt}],
            stream=False,
            temperature=0.3  # Plus déterministe pour analyses stratégiques
        )
        
        llm_analysis = response.choices[0].message.content
        
        # ===== CONSTRUCTION DU RÉSULTAT STRUCTURÉ =====
        result = {
            "category": category,
            "data_analyzed": {
                "approved_count": len(approved_docs),
                "rejected_count": len(rejected_docs),
                "total_documents": len(approved_docs) + len(rejected_docs)
            },
            "llm_strategic_analysis": llm_analysis,
            "methodology": "LLM Pattern Recognition + Semantic Search",
            "confidence": "High" if len(approved_docs) + len(rejected_docs) >= 8 else "Medium"
        }
        
        return result
        
    except Exception as e:
        print(f"❌ Erreur lors de l'analyse LLM: {e}")
        # Fallback vers analyse basique
        return {
            "category": category,
            "error": str(e),
            "fallback_analysis": {
                "approved_count": len(approved_docs),
                "rejected_count": len(rejected_docs),
                "raw_approved_samples": [doc.page_content[:200] for doc in approved_docs[:3]],
                "raw_rejected_samples": [doc.page_content[:200] for doc in rejected_docs[:3]]
            }
        }

def execute_complete_rfp_analysis(vectorstore, llm_client, domain):
    """
    🎯 ANALYSE STRATÉGIQUE COMPLÈTE AUTOMATISÉE
    ===========================================
    
    Exécute automatiquement le prompt complet d'analyse RFP stratégique.
    
    Args:
        vectorstore (FAISS): Index vectoriel pour recherche
        llm_client: Client LLM pour analyses intelligentes
        domain (str): Domaine d'analyse (ex: "sécurité", "cloud", "agile")
        
    Returns:
        dict: Résultats complets des 4 analyses avec insights actionnables
    """
    print(f"\n🚀 ANALYSE STRATÉGIQUE COMPLÈTE AUTOMATISÉE - DOMAINE: {domain.upper()}")
    print("="*70)
    print("📋 Exécution systématique du framework d'analyse en 4 étapes...")
    print(f"🎯 PROMPT AUTOMATISÉ: Analyse stratégique complète sur '{domain}'")
    
    results = {
        "domain": domain,
        "analysis_timestamp": "2025-01-23",
        "framework_steps": {},
        "prompt_executed": f"Analyse stratégique complète sur {domain}"
    }
    
    try:
        # ===== ÉTAPE 1: PATTERNS RÉCURRENTS =====
        print(f"\n📈 ÉTAPE 1/4: PATTERNS RÉCURRENTS")
        print(f"🔍 Commande: 'patterns: {domain}' - Identification exigences récurrentes...")
        
        # patterns: [domaine] - Patterns de base
        basic_patterns = analyze_rfp_patterns(vectorstore, domain)
        print(f"   ✅ patterns: {domain} → {basic_patterns['total_analyzed']} documents analysés")
        
        print(f"🧠 Commande: 'smart_patterns: {domain}' - Corrélations cachées avec IA...")
        # smart_patterns: [domaine] - Corrélations cachées avec LLM
        smart_patterns = analyze_strategic_patterns_with_llm(vectorstore, llm_client, domain)
        print(f"   ✅ smart_patterns: {domain} → Insights IA générés ({smart_patterns.get('confidence', 'Medium')} confiance)")
        
        results["framework_steps"]["step1_patterns_recurrents"] = {
            "patterns_command": f"patterns: {domain}",
            "smart_patterns_command": f"smart_patterns: {domain}",
            "basic_patterns": basic_patterns,
            "smart_patterns": smart_patterns
        }
        
        # ===== ÉTAPE 2: HISTORIQUE FORCES/FAIBLESSES =====
        print(f"\n📊 ÉTAPE 2/4: HISTORIQUE FORCES/FAIBLESSES")
        print(f"💚 Commande: 'approved: {domain}' - Analyse points forts récurrents...")
        
        # approved: [domaine] - Points forts récurrents
        approved_docs = retrieve_similar_chunks_with_filter(vectorstore, domain, k=8, rfp_status="approved")
        print(f"   ✅ approved: {domain} → {len(approved_docs)} cas de succès analysés")
        
        print(f"🔴 Commande: 'rejected: {domain}' - Analyse faiblesses systématiques...")
        # rejected: [domaine] - Faiblesses systématiques  
        rejected_docs = retrieve_similar_chunks_with_filter(vectorstore, domain, k=8, rfp_status="rejected")
        print(f"   ✅ rejected: {domain} → {len(rejected_docs)} cas d'échec analysés")
        
        results["framework_steps"]["step2_historique_forces_faiblesses"] = {
            "approved_command": f"approved: {domain}",
            "rejected_command": f"rejected: {domain}",
            "forces": {
                "count": len(approved_docs),
                "examples": [doc.page_content[:200] for doc in approved_docs[:3]]
            },
            "faiblesses": {
                "count": len(rejected_docs), 
                "examples": [doc.page_content[:200] for doc in rejected_docs[:3]]
            }
        }
        
        # ===== ÉTAPE 3: FACTEURS VICTOIRE/DÉFAITE =====
        print(f"\n⚖️ ÉTAPE 3/4: FACTEURS VICTOIRE/DÉFAITE")
        print(f"🔄 Commande: 'compare: {domain}' - Pourquoi nous gagnons/perdons...")
        
        # compare: [domaine] - Facteurs différenciants
        comparison = compare_success_failure_factors(vectorstore, domain)
        print(f"   ✅ compare: {domain} → {comparison['success_factors']['count']} succès vs {comparison['failure_factors']['count']} échecs")
        
        print(f"🎯 Commande: 'strategy: pourquoi réussissons-nous/échouons-nous sur {domain} ?' - Enseignements actionnables...")
        # strategy: pourquoi réussissons-nous/échouons-nous sur [domaine] ?
        strategic_context = generate_strategic_insights(vectorstore, f"pourquoi réussissons-nous/échouons-nous sur {domain}")
        strategy_question = f"pourquoi réussissons-nous/échouons-nous sur {domain} ?"
        strategic_analysis = llm_client.analyze_rfp_strategy(strategy_question, strategic_context)
        print(f"   ✅ strategy: pourquoi réussissons-nous/échouons-nous sur {domain} ? → Analyse stratégique générée")
        
        results["framework_steps"]["step3_facteurs_victoire_defaite"] = {
            "compare_command": f"compare: {domain}",
            "strategy_command": f"strategy: pourquoi réussissons-nous/échouons-nous sur {domain} ?",
            "comparison": comparison,
            "strategic_insights": strategic_analysis
        }
        
        # ===== ÉTAPE 4: COMPARAISON RÉUSSIS VS REJETÉS =====
        print(f"\n🔍 ÉTAPE 4/4: COMPARAISON RÉUSSIS VS REJETÉS")
        print(f"🔄 Commande: 'rfp_vs_response: {domain}' - Divergences besoins clients vs propositions...")
        
        # rfp_vs_response: [domaine] - Divergences besoins/propositions
        rfp_response_analysis = analyze_rfp_vs_response_patterns(vectorstore, domain)
        print(f"   ✅ rfp_vs_response: {domain} → Taux succès: {rfp_response_analysis['alignment_analysis']['success_rate']}")
        
        print(f"🏆 Commande: 'competitive: {domain}' - Avantages/faiblesses concurrentielles...")
        # competitive: [domaine] - Intelligence concurrentielle
        competitive_analysis = analyze_competitive_intelligence(vectorstore, llm_client, domain)
        print(f"   ✅ competitive: {domain} → Intelligence concurrentielle générée")
        
        results["framework_steps"]["step4_comparaison_reussis_rejetes"] = {
            "rfp_vs_response_command": f"rfp_vs_response: {domain}",
            "competitive_command": f"competitive: {domain}",
            "rfp_vs_response": rfp_response_analysis,
            "competitive_intelligence": competitive_analysis
        }
        
        # ===== SYNTHÈSE FINALE DES INSIGHTS ACTIONNABLES =====
        print(f"\n🎯 SYNTHÈSE FINALE - INSIGHTS ACTIONNABLES POUR {domain.upper()}")
        print("="*70)
        print("💡 Génération automatique des recommandations pour améliorer futures réponses RFP...")
        
        total_docs = (len(approved_docs) + len(rejected_docs) + 
                     basic_patterns['total_analyzed'] + 
                     rfp_response_analysis['alignment_analysis']['total_client_demands'])
        
        # Génération automatique des insights actionnables finaux
        final_prompt = f"""
Basé sur l'analyse stratégique complète du domaine '{domain}', voici les éléments analysés :

PATTERNS RÉCURRENTS :
- {basic_patterns['total_analyzed']} documents analysés pour patterns de base
- Insights IA sur corrélations cachées générés

HISTORIQUE FORCES/FAIBLESSES :
- {len(approved_docs)} cas de succès (points forts récurrents)
- {len(rejected_docs)} cas d'échec (faiblesses systématiques)

FACTEURS VICTOIRE/DÉFAITE :
- Comparaison {comparison['success_factors']['count']} succès vs {comparison['failure_factors']['count']} échecs
- Analyse stratégique sur pourquoi nous réussissons/échouons

COMPARAISON RÉUSSIS VS REJETÉS :
- Taux de succès: {rfp_response_analysis['alignment_analysis']['success_rate']}
- Intelligence concurrentielle générée

Fournissez 5 insights actionnables concrets pour améliorer nos futures réponses RFP sur {domain}.
"""
        
        actionnable_insights = llm_client.analyze_rfp_strategy(
            f"Insights actionnables pour améliorer futures réponses RFP sur {domain}", 
            final_prompt
        )
        
        results["synthesis"] = {
            "total_documents_analyzed": total_docs,
            "success_rate": rfp_response_analysis['alignment_analysis']['success_rate'],
            "commands_executed": [
                f"patterns: {domain}",
                f"smart_patterns: {domain}",
                f"approved: {domain}",
                f"rejected: {domain}",
                f"compare: {domain}",
                f"strategy: pourquoi réussissons-nous/échouons-nous sur {domain} ?",
                f"rfp_vs_response: {domain}",
                f"competitive: {domain}"
            ],
            "actionnable_insights": actionnable_insights,
            "key_metrics": [
                f"Patterns analysés: {basic_patterns['total_analyzed']} documents",
                f"Forces identifiées: {len(approved_docs)} cas de succès", 
                f"Faiblesses analysées: {len(rejected_docs)} cas d'échec",
                f"Taux de succès global: {rfp_response_analysis['alignment_analysis']['success_rate']}",
                f"Intelligence concurrentielle: Générée avec insights LLM"
            ]
        }
        
        print("✅ ANALYSE STRATÉGIQUE COMPLÈTE TERMINÉE AVEC SUCCÈS!")
        print(f"🎯 8 COMMANDES EXÉCUTÉES AUTOMATIQUEMENT pour '{domain}'")
        print("💼 Insights actionnables disponibles pour amélioration futures RFP")
        return results
        
    except Exception as e:
        print(f"❌ Erreur lors de l'analyse complète: {e}")
        results["error"] = str(e)
        return results

def analyze_competitive_intelligence(vectorstore, llm_client, focus="facteurs de différenciation", k=12):
    """
    🔍 INTELLIGENCE CONCURRENTIELLE AVANCÉE
    =======================================
    
    Analyse spécialisée pour identifier nos avantages concurrentiels
    et les raisons de nos victoires/défaites face à la concurrence.
    
    Args:
        vectorstore (FAISS): Index vectoriel
        llm_client (Together): Client LLM pour analyse
        focus (str): Zone d'analyse concurrentielle
        k (int): Nombre de documents
        
    Returns:
        dict: Intelligence concurrentielle structurée
    """
    print(f"🔍 Analyse concurrentielle: {focus}")
    
    # Recherche large sur tous les documents
    all_docs = retrieve_similar_chunks(vectorstore, focus, k=k*2)
    
    # Séparation par résultat
    wins = [doc for doc in all_docs if doc.metadata.get('rfp_status') == 'approved']
    losses = [doc for doc in all_docs if doc.metadata.get('rfp_status') == 'rejected']
    
    context = f"""
INTELLIGENCE CONCURRENTIELLE - FOCUS: {focus.upper()}

=== VICTOIRES CONCURRENTIELLES ({len(wins)} cas) ===
{chr(10).join([f"Victoire {i+1}: {doc.page_content[:600]}" for i, doc in enumerate(wins[:4])])}

=== DÉFAITES CONCURRENTIELLES ({len(losses)} cas) ===
{chr(10).join([f"Défaite {i+1}: {doc.page_content[:600]}" for i, doc in enumerate(losses[:4])])}
"""
    
    prompt = f"""
Tu es un consultant en intelligence concurrentielle. Analyse ces données pour identifier pourquoi nous gagnons ou perdons face à la concurrence.

{context}

ANALYSE DEMANDÉE - FOCUS: {focus}

FORMAT DE SORTIE:
🏆 NOS AVANTAGES CONCURRENTIELS:
- Avantage différenciant 1
- Avantage différenciant 2  
- Avantage différenciant 3

⚠️ NOS FAIBLESSES FACE À LA CONCURRENCE:
- Faiblesse récurrente 1
- Faiblesse récurrente 2
- Faiblesse récurrente 3

🎯 STRATÉGIES POUR GAGNER PLUS:
- Recommandation stratégique 1
- Recommandation stratégique 2
- Recommandation stratégique 3

📊 INSIGHTS BUSINESS:
- Insight clé sur notre positionnement
- Analyse du marché et tendances
- Prédiction pour futures compétitions

Sois spécifique, actionnable et base-toi sur les vraies données des documents.
"""
    
    try:
        response = llm_client.chat.completions.create(
            model="meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
            messages=[{"role": "user", "content": prompt}],
            stream=False,
            temperature=0.2
        )
        
        return {
            "focus": focus,
            "competitive_intelligence": response.choices[0].message.content,
            "data_source": f"{len(wins)} victoires, {len(losses)} défaites analysées",
            "methodology": "Competitive Intelligence LLM Analysis"
        }
        
    except Exception as e:
        return {"error": f"Erreur analyse concurrentielle: {e}"}

# ===============================================================================
# FONCTION PRINCIPALE ET INTERFACE UTILISATEUR
# ===============================================================================

def main():
    """
    FONCTION PRINCIPALE D'ORCHESTRATION DU SYSTÈME RAG STRATÉGIQUE
    
    Point d'entrée principal du système d'analyse RFP.
    """
    # ===== DÉCLARATIONS GLOBALES =====
    global last_retrieved_docs, last_evaluation_score, last_evaluation_reason, last_analysis_prompt, console_logger
    
    # ===== DÉMARRAGE DU LOGGING AUTOMATIQUE =====
    console_logger.start_logging()
    
    # ===== PHASE 1: CONFIGURATION SÉCURISÉE ET VALIDATION =====
    faiss_path = "./faiss_index"  
    api_key = "tgp_v1_vt3VH4DbcOSci1iOn0sfpUSjyjhfpivPZzpOTUmSkC4"

    # ===== VALIDATION AUTHENTIFICATION =====
    if api_key == "YOUR_TOGETHER_API_KEY":
        print("⚠️ ERREUR CONFIGURATION: Merci de remplacer 'YOUR_TOGETHER_API_KEY' par ta clé API valide.")
        print("💡 Guide: Obtenez votre clé sur https://together.ai/")
        console_logger.stop_logging()
        return

    # ===== PHASE 2: INITIALISATION DES MOTEURS IA =====
    print("🚀 Initialisation du système RAG stratégique avec support VLM...")
    try:
        # Client VLM spécialisé pour traitement PDFs scannés
        vlm_client = Together(api_key=api_key)
        print("✅ Client VLM configuré: Llama-3.2-90B-Vision-Instruct-Turbo")
        
        # Wrapper LLM pour génération réponses strategiques
        llm = LLMWrapper(api_key=api_key)
        print("✅ Wrapper LLM configuré: DeepSeek-V3 avec prompts RFP spécialisés")
        
    except Exception as e:
        print(f"❌ Erreur initialisation IA: {e}")
        print("🔧 Vérifiez: connexion réseau, validité clé API, quotas Together.ai")
        return

    # ===== PHASE 3: GESTION INTELLIGENTE DE L'INDEX VECTORIEL =====
    if not os.path.exists(faiss_path):
        # ===== MODE CRÉATION INITIALE =====
        print("🔄 CRÉATION INDEX INITIAL: Traitement complet documents avec VLM...")
        print("📁 Scanning: approvedRfp/ + rejectedRfp/ + documents scannés")
        
        try:
            # Chargement et chunking intelligent avec métadonnées enrichies
            chunks, document_registry, rfp_response_mapping = load_and_chunk_documents(vlm_client=vlm_client)
            print(f"📊 Documents traités: {len(document_registry)} fichiers")
            print(f"🧩 Chunks générés: {len(chunks)} segments indexables")
            print(f"🔗 Projets mappés: {len(rfp_response_mapping)} correspondances RFP-Réponse")
            
            if chunks:
                # Création index FAISS optimisé avec embeddings sémantiques
                vectorstore = create_faiss_index(chunks, faiss_path)
                print("✅ Index FAISS créé et sauvegardé avec succès")
            else:
                print("❌ ERREUR: Aucun chunk créé - vérifiez contenu dossiers RFP")
                console_logger.stop_logging()
                return
                
        except Exception as e:
            print(f"❌ Erreur création index: {e}")
            console_logger.stop_logging()
            return
    else:
        # ===== MODE CHARGEMENT OPTIMISÉ =====
        print("📦 CHARGEMENT INDEX EXISTANT: Optimisation performance...")
        try:
            vectorstore = FAISS.load_local(
                faiss_path, 
                embedding_model,
                allow_dangerous_deserialization=True
            )
            # Restauration registres pour traçabilité
            document_registry = load_document_registry()
            rfp_response_mapping = load_rfp_response_mapping()
            print("✅ Index et registres chargés avec succès")
            print(f"📊 Documents indexés: {len(document_registry)}")
            print(f"🔗 Mappings RFP-Réponse: {len(rfp_response_mapping)}")
            
        except Exception as e:
            print(f"❌ Erreur chargement index: {e}")
            print("💡 Solution: Supprimez ./faiss_index pour recréation")
            console_logger.stop_logging()
            return

    # ===== PHASE 4: INTERFACE UTILISATEUR SIMPLIFIÉE =====
    print("\n" + "="*80)
    print("🧠 SYSTÈME D'ANALYSE RFP SIMPLIFIÉ")
    print("🎯 Tapez simplement votre domaine d'analyse")
    print("="*80)
    
    print("\n✨ INTERFACE SIMPLIFIÉE:")
    print("  ⚡ Tapez simplement un domaine → Analyse automatique complète")
    print("     📊 Exemples: 'sécurité', 'cloud', 'agile', 'architecture', 'ia'")
    print("     🤖 Le système fait automatiquement toute l'analyse pour vous!")
    
    print("\n⚙️ COMMANDES SPÉCIALES:")
    print("  � 'registry' → Voir documents indexés")
    print("  ❓ 'help' → Aide")
    print("  � 'quit' → Quitter")
    print("  ⚖️ 'compare: [sujet]' → Comparaison facteurs succès vs échec")
    print("  📚 'lessons: [domaine]' → Extraction enseignements historiques")
    print("  🎯 'requirements: [type]' → Cartographie exigences récurrentes")
    print("  🚀 'strategy: [question métier]' → Analyse complète executive")
    
    
    print(f"\n📊 ÉTAT SYSTÈME: {len(document_registry)} docs indexés")
    print("🎮 Prêt pour analyse...")
    
    # ===== PHASE 5: BOUCLE INTERACTION SIMPLIFIÉE =====
    while True:
        try:
            # ===== COLLECTE INPUT UTILISATEUR =====
            query = input("\n" + "="*50 + "\n🔎 Entrez votre domaine d'analyse: ").strip()
            
            # ===== GESTION COMMANDES DE CONTRÔLE =====
            if query.lower() in ["quit", "exit", "q"]:
                print("\n👋 Session terminée!")
                break
                
            if not query:
                print("💬 Veuillez saisir un domaine...")
                continue
        
            # ===== COMMANDES UTILITAIRES SYSTÈME =====
            
            # Affichage registre documentaire
            if query.lower() == "registry":
                print("\n📑 REGISTRE DOCUMENTAIRE:")
                print("-" * 50)
                display_document_registry()
                print(f"\n📊 Résumé: {len(document_registry)} documents indexés")
                continue
                
            # Réaffichage aide simplifiée
            if query.lower() == "help":
                print("\n" + "="*50)
                print("🧠 AIDE - SYSTÈME RAG SIMPLIFIÉ")
                print("="*50)
                print("\n✨ UTILISATION:")
                print("  🔍 Tapez simplement un domaine (ex: 'sécurité', 'cloud', 'agile')")
                print("  📊 Le système fait automatiquement l'analyse complète")
                print("\n⚙️ COMMANDES:")
                print("  📑 'registry' → Voir documents indexés")
                print("  ❓ 'help' → Cette aide")
                print("  🚪 'quit' → Quitter")
                continue
                
            # ===== INTERFACE SIMPLIFIÉE : JUSTE LE DOMAINE =====
            # L'utilisateur tape juste le domaine et on fait l'analyse automatique
            domain = query.strip()
            
            # Stocker le prompt d'analyse pour promptEnhancer.py
            last_analysis_prompt = f"Analyse stratégique complète des RFP sur le domaine {domain}"
            
            print(f"\n🚀 ANALYSE AUTOMATIQUE DU DOMAINE: '{domain.upper()}'")
            print("📋 Exécution de l'analyse stratégique complète...")
            
            try:
                # Exécution du workflow complet automatisé
                complete_analysis = execute_complete_rfp_analysis(vectorstore, llm, domain)
                
                print("\n" + "="*70)
                print("📊 RAPPORT D'ANALYSE STRATÉGIQUE COMPLÈTE")
                print("="*70)
                
                # Affichage des résultats de l'analyse automatique
                if "synthesis" in complete_analysis:
                    synthesis = complete_analysis["synthesis"]
                    
                    print(f"\n📈 MÉTRIQUES GLOBALES:")
                    for metric in synthesis["key_metrics"]:
                        print(f"   • {metric}")
                    
                    print(f"\n💡 INSIGHTS ACTIONNABLES POUR AMÉLIORER FUTURES RFP SUR {domain.upper()}:")
                    print("="*60)
                    print(synthesis["actionnable_insights"])
                    print("="*60)
                
                # ===== ÉVALUATION AVEC VARIABLES SIMPLES =====
                if judge_llm and "synthesis" in complete_analysis and "actionnable_insights" in complete_analysis["synthesis"]:
                    print("\n🔍 Évaluation automatique de fidélité...")
                    
                    docs_for_evaluation = []
                    if "step1_patterns_recurrents" in complete_analysis["framework_steps"]:
                        basic_patterns = complete_analysis["framework_steps"]["step1_patterns_recurrents"]["basic_patterns"]
                        for pattern in basic_patterns.get("approved_patterns", [])[:2]:
                            docs_for_evaluation.append(pattern)
                    
                    evaluation_result = evaluate_faithfulness_after_generation(
                        question=f"Insights actionnables pour améliorer futures réponses RFP sur {domain}",
                        answer=complete_analysis["synthesis"]["actionnable_insights"],
                        retrieved_docs=docs_for_evaluation if docs_for_evaluation else ["Analyse stratégique complète effectuée"]
                    )
                    
                    print_judge_result(evaluation_result)
                
            except Exception as e:
                print(f"❌ Erreur analyse: {e}")
            continue
                
        except KeyboardInterrupt:
            # ===== GESTION INTERRUPTION PROPRE =====
            print("\n\n⏹️ Session interrompue par l'utilisateur.")
            print("💾 État du système préservé pour prochaine utilisation.")
            break
            
        except Exception as e:
            # ===== GESTION ERREURS ROBUSTE =====
            print(f"\n❌ Erreur système: {e}")
            print("🔄 Le système reste opérationnel, continuez vos analyses...")
    
    # ===== FERMETURE PROPRE DU LOGGING À LA FIN DE LA BOUCLE =====
    console_logger.stop_logging()

# ===============================================================================
# POINT D'ENTRÉE PRINCIPAL DU SYSTÈME RAG STRATÉGIQUE
# ===============================================================================

if __name__ == "__main__":
    """
    POINT D'ENTRÉE PRINCIPAL DU SYSTÈME D'INTELLIGENCE RFP
    
    Cette condition assure que le script ne s'exécute automatiquement 
    que s'il est lancé directement depuis la ligne de commande.
    """
    print("🚀 DÉMARRAGE SYSTÈME RAG STRATÉGIQUE POUR ANALYSE RFP")
    print("=" * 70)
    print("📊 Module: Intelligence concurrentielle et analyse d'affaires")
    print("🎯 Objectif: Optimiser les taux de victoire sur appels d'offres")
    print("🔧 Architecture: RAG + VLM + LLM + Analytics stratégiques")
    print("=" * 70)
    
    try:
        main()
    except Exception as e:
        print(f"❌ Erreur fatale: {e}")
        print("🛠️ Consultez la documentation ou contactez le support technique")
    
    try:
        main()
    except Exception as e:
        print(f"❌ Erreur fatale: {e}")
        print("�️ Consultez la documentation ou contactez le support technique")
    
    print("\n👋 Session d'analyse RFP terminée")
    print("💾 Merci d'avoir utilisé le système d'intelligence stratégique")