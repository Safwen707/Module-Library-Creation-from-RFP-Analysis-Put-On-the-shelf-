# -*- coding: utf-8 -*-
"""
Customer Needs Analysis Agent
Analyse les besoins clients à partir des documents RFP
"""

import os
import re
import json
from pathlib import Path
from typing import List, Dict, Tuple
import pdfplumber
import docx
from together import Together
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY


class CustomerNeedsAgent:
    """Agent pour analyser les besoins clients à partir d'un RFP"""
    
    def __init__(self, api_key: str = None):
        """
        Initialise l'agent avec la clé API Together
        
        Args:
            api_key: Clé API Together (optionnel, peut être définie via variable d'environnement)
        """
        if api_key:
            os.environ["TOGETHER_API_KEY"] = api_key
        elif not os.environ.get("TOGETHER_API_KEY"):
            raise ValueError("TOGETHER_API_KEY doit être définie")
        
        self.client = Together()
        self.max_chars = 80_000
        
        self.system_instruction = """
Act as an expert Pre-Sales Consultant with 10+ years of experience in RFP analysis. Your task is to meticulously analyze the provided RFP document to extract, interpret, and synthesize the following key elements:

CLIENT'S CORE NEEDS - Explicit requirements stated in the RFP
PAIN POINTS - Underlying challenges or inefficiencies hinted at in the document
SUCCESS CRITERIA - Both stated and unstated metrics for project success

Deliver a Customer Needs Report structured as follows:

1. Executive Summary (≤ 100 words)
   Concise overview of the client's strategic objectives
   Key pain points affecting their business
   High-level impact expected from a solution

2. Detailed Needs Analysis (Bullet-point format)
   Requirement: [Exact need from RFP]
   Business Value: [Quantifiable impact - e.g. "30% process efficiency gain"]
   Priority: [High/Medium/Low based on RFP emphasis]
   RFP Reference: [Section/Page # for traceability]

3. Implicit Wish-List
   Features/benefits not explicitly requested but logically implied by:
   Industry best practices
   Technical dependencies
   Competitive differentiators

Style Guidelines:
- Use clear, action-oriented language (avoid jargon unless defined in RFP)
- Highlight differentiation opportunities where our solution could outperform competitors
- Flag potential red flags (e.g. unrealistic timelines, scope ambiguities)
- Maintain RFP-aligned terminology for consistency
""".strip()

    def load_rfp_text(self, file_path: str) -> str:
        """
        Charge et nettoie le texte du RFP depuis différents formats
        
        Args:
            file_path: Chemin vers le fichier RFP (PDF, DOCX, TXT)
            
        Returns:
            Texte nettoyé du RFP
        """
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"Fichier non trouvé: {file_path}")
        
        ext = path.suffix.lower()
        
        if ext == ".pdf":
            with pdfplumber.open(path) as pdf:
                pages = [p.extract_text() or "" for p in pdf.pages]
            raw = "\n".join(pages)
        elif ext in {".docx", ".doc"}:
            doc = docx.Document(path)
            raw = "\n".join(p.text for p in doc.paragraphs)
        else:  # assume plain text
            raw = path.read_text(encoding='utf-8')

        # Nettoyage du texte
        raw = re.sub(r"\s+\n", "\n", raw)
        raw = re.sub(r"\n{2,}", "\n\n", raw)
        raw = raw.strip()
        
        # Troncature si nécessaire
        if len(raw) > self.max_chars:
            print(f"⚠️  RFP tronqué à {self.max_chars:,} caractères")
            raw = raw[:self.max_chars]
            
        return raw

    def analyze_needs(self, rfp_text: str) -> str:
        """
        Analyse les besoins clients via l'API DeepSeek-V3
        
        Args:
            rfp_text: Texte du RFP à analyser
            
        Returns:
            Rapport d'analyse des besoins
        """
        messages = [
            {"role": "system", "content": self.system_instruction},
            {"role": "user", "content": f"Here is the full RFP:\n\n{rfp_text}"}
        ]
        
        response = self.client.chat.completions.create(
            model="deepseek-ai/DeepSeek-V3",
            messages=messages,
            stream=True,
            temperature=0.2,
        )
        
        report_chunks = []
        print("\n📝 **Génération du rapport d'analyse des besoins...**\n")
        
        for token in response:
            if hasattr(token, "choices") and token.choices:
                chunk = token.choices[0].delta.content or ""
                print(chunk, end="", flush=True)
                report_chunks.append(chunk)
                
        return "".join(report_chunks).strip()

    def create_pdf_styles(self):
        """Crée les styles personnalisés pour le PDF"""
        styles = getSampleStyleSheet()
        
        custom_styles = {
            'title': ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=24,
                spaceAfter=30,
                alignment=TA_CENTER,
                textColor=HexColor('#2E86AB'),
                fontName='Helvetica-Bold'
            ),
            'heading1': ParagraphStyle(
                'CustomHeading1',
                parent=styles['Heading1'],
                fontSize=18,
                spaceAfter=18,
                spaceBefore=24,
                textColor=HexColor('#A23B72'),
                fontName='Helvetica-Bold'
            ),
            'heading2': ParagraphStyle(
                'CustomHeading2',
                parent=styles['Heading2'],
                fontSize=14,
                spaceAfter=12,
                spaceBefore=18,
                textColor=HexColor('#F18F01'),
                fontName='Helvetica-Bold'
            ),
            'heading3': ParagraphStyle(
                'CustomHeading3',
                parent=styles['Heading3'],
                fontSize=12,
                spaceAfter=8,
                spaceBefore=12,
                textColor=HexColor('#C73E1D'),
                fontName='Helvetica-Bold'
            ),
            'body': ParagraphStyle(
                'CustomBody',
                parent=styles['Normal'],
                fontSize=11,
                spaceAfter=12,
                alignment=TA_JUSTIFY,
                fontName='Helvetica'
            ),
            'bullet': ParagraphStyle(
                'CustomBullet',
                parent=styles['Normal'],
                fontSize=10,
                spaceAfter=6,
                leftIndent=20,
                bulletIndent=10,
                fontName='Helvetica'
            )
        }
        
        return custom_styles

    def process_text_block(self, text_block: str, styles: Dict) -> Tuple[str, object]:
        """
        Traite un bloc de texte et détermine son formatage
        
        Args:
            text_block: Bloc de texte à traiter
            styles: Dictionnaire des styles
            
        Returns:
            Tuple (texte traité, style)
        """
        text_block = text_block.strip()
        if not text_block:
            return None, None

        # Vérification des différents niveaux de titre
        if text_block.startswith('####'):
            return text_block[4:].strip(), styles['heading3']
        elif text_block.startswith('###'):
            return text_block[3:].strip(), styles['heading2']
        elif text_block.startswith('##'):
            return text_block[2:].strip(), styles['heading1']
        elif text_block.startswith('#'):
            return text_block[1:].strip(), styles['title']
        # Points de liste
        elif text_block.startswith('- ') or text_block.startswith('• '):
            return text_block[2:].strip(), styles['bullet']
        elif re.match(r'^\d+\.\s', text_block):
            return text_block, styles['bullet']
        # Paragraphe normal
        else:
            return text_block, styles['body']

    def export_to_pdf(self, report_text: str, output_path: str = "customer_needs_report.pdf") -> bool:
        """
        Exporte le rapport en PDF formaté
        
        Args:
            report_text: Texte du rapport à exporter
            output_path: Chemin de sortie du PDF
            
        Returns:
            True si succès, False sinon
        """
        try:
            doc = SimpleDocTemplate(
                output_path,
                pagesize=A4,
                rightMargin=0.75*inch,
                leftMargin=0.75*inch,
                topMargin=1*inch,
                bottomMargin=0.75*inch
            )
            
            styles = self.create_pdf_styles()
            flow = []
            
            paragraphs = report_text.split('\n\n')
            
            for para in paragraphs:
                if not para.strip():
                    continue
                
                lines = para.split('\n')
                for line in lines:
                    processed_text, style = self.process_text_block(line, styles)
                    
                    if processed_text and style:
                        # Nettoyage du texte
                        clean_text = processed_text.replace('\n', '<br/>')
                        clean_text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', clean_text)
                        clean_text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', clean_text)
                        
                        flow.append(Paragraph(clean_text, style))
                        
                        # Espacement après les titres
                        if style in [styles['title'], styles['heading1']]:
                            flow.append(Spacer(1, 12))
                        elif style in [styles['heading2'], styles['heading3']]:
                            flow.append(Spacer(1, 8))
            
            doc.build(flow)
            print(f"\n✅ PDF généré avec succès: {output_path}")
            print(f"Fichier sauvegardé: {os.path.abspath(output_path)}")
            return True
            
        except Exception as e:
            print(f"\n❌ Erreur lors de la génération du PDF: {e}")
            # Fallback: sauvegarde en texte
            txt_path = output_path.replace('.pdf', '.txt')
            with open(txt_path, 'w', encoding='utf-8') as f:
                f.write(report_text)
            print(f"✅ Rapport sauvegardé en format texte: {txt_path}")
            return False

    def process_rfp(self, file_path: str, output_path: str = None) -> Dict:
        """
        Traite un RFP complet depuis le fichier jusqu'au rapport final
        
        Args:
            file_path: Chemin vers le fichier RFP
            output_path: Chemin de sortie (optionnel)
            
        Returns:
            Dictionnaire avec les résultats
        """
        try:
            print(f"📄 Traitement du RFP: {file_path}")
            
            # 1. Chargement du RFP
            rfp_text = self.load_rfp_text(file_path)
            print(f"✅ Chargé {len(rfp_text):,} caractères")
            
            # 2. Analyse des besoins
            report = self.analyze_needs(rfp_text)
            print(f"\n✅ Analyse terminée ({len(report):,} caractères)")
            
            # 3. Export PDF
            if not output_path:
                output_path = "customer_needs_report.pdf"
            
            pdf_success = self.export_to_pdf(report, output_path)
            
            return {
                'success': True,
                'report_text': report,
                'pdf_generated': pdf_success,
                'output_path': output_path,
                'rfp_length': len(rfp_text),
                'report_length': len(report)
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'report_text': None,
                'pdf_generated': False
            }


def get_rfp_path() -> str:
    """Interface utilisateur pour sélectionner le fichier RFP"""
    print("📄 Entrez le chemin vers votre document RFP (PDF, DOCX, ou TXT):")
    while True:
        fname = input("Chemin du fichier: ").strip('"\' ')
        if Path(fname).exists():
            return fname
        print(f"Fichier non trouvé: {fname}. Veuillez réessayer.")


if __name__ == "__main__":
    # Test indépendant
    api_key = "8201d29393384428ba1c32e5e16a55d2d67188d618f94476b26ef0414e59e8dc"
    agent = CustomerNeedsAgent(api_key)
    
    file_path = get_rfp_path()
    result = agent.process_rfp(file_path)
    
    if result['success']:
        print(f"\n🎉 Traitement réussi!")
        print(f"📊 Statistiques:")
        print(f"  - RFP: {result['rfp_length']:,} caractères")
        print(f"  - Rapport: {result['report_length']:,} caractères")
        print(f"  - PDF: {'✅' if result['pdf_generated'] else '❌'}")
    else:
        print(f"\n❌ Erreur: {result['error']}")