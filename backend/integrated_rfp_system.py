# -*- coding: utf-8 -*-
"""
Système Intégré d'Analyse RFP
Main global orchestrant CustomerNeedsAgent + GapAnalysisAgent + ModuleMatchAgent
"""

import os
import json
from pathlib import Path
from typing import Dict, Any
import pandas as pd
import google.generativeai as genai
from together import Together
import io
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.lib.units import inch
import matplotlib.pyplot as plt
import pdfplumber
import docx
import re

# Import de votre CustomerNeedsAgent existant
from customer_needs_agent import CustomerNeedsAgent
from report_agent import RFPResponseGenerator
from md_to_pdf import main

class IntegratedRFPAnalysisSystem:
    """Système intégré d'analyse RFP avec orchestration multi-agents"""

    def __init__(self, together_api_key: str, gemini_api_key: str):
        """
        Initialise le système avec les clés API

        Args:
            together_api_key: Clé API Together pour CustomerNeedsAgent
            gemini_api_key: Clé API Gemini pour les autres agents
        """
        self.together_api_key = together_api_key
        self.gemini_api_key = gemini_api_key

        # Configuration des APIs
        genai.configure(api_key=gemini_api_key)

        # Initialisation des agents
        self.customer_needs_agent = CustomerNeedsAgent(together_api_key)
        self.gap_analysis_agent = GapAnalysisAgent(gemini_api_key)
        self.module_match_agent = ModuleMatchAgent(gemini_api_key)

        # Configuration du modèle pour l'orchestrateur
        self.orchestrator_model = genai.GenerativeModel("models/gemini-2.0-flash-exp")

    def upload_rfp_interface(self) -> str:
        """Interface pour uploader le RFP"""
        print("🔥 SYSTÈME D'ANALYSE RFP INTÉGRÉ")
        print("=" * 50)
        print("\n📄 ÉTAPE 1: Upload du document RFP")
        print("Formats supportés: PDF, DOCX, TXT")

        while True:
            rfp_path = input("\n➤ Chemin vers votre RFP: ").strip('"\' ')
            if Path(rfp_path).exists():
                print(f"✅ RFP détecté: {Path(rfp_path).name}")
                return rfp_path
            print(f"❌ Fichier non trouvé: {rfp_path}")

    def get_analysis_report_path(self) -> str:
        """Interface pour obtenir le path du rapport d'analyse"""
        print("\n📊 ÉTAPE 2: Rapport d'analyse des patterns")
        print("Fichier: analysis_report_success_failure_patterns")

        while True:
            report_path = input("\n➤ Chemin vers le rapport d'analyse: ").strip('"\' ')
            if Path(report_path).exists():
                print(f"✅ Rapport détecté: {Path(report_path).name}")
                return report_path
            print(f"❌ Fichier non trouvé: {report_path}")

    def load_company_resources(self) -> str:
        """Interface pour charger les ressources de l'entreprise"""
        print("\n🏢 ÉTAPE 3: Ressources internes de l'entreprise")

        while True:
            resources_path = input("\n➤ Chemin vers les ressources internes: ").strip('"\' ')
            if Path(resources_path).exists():
                print(f"✅ Ressources détectées: {Path(resources_path).name}")
                return resources_path
            print(f"❌ Fichier non trouvé: {resources_path}")

    def load_employee_data(self) -> str:
        """Interface pour charger les données des employés"""
        print("\n👥 ÉTAPE 4: Données des employés/compétences")

        while True:
            employee_path = input("\n➤ Chemin vers les données employés (CSV): ").strip('"\' ')
            if Path(employee_path).exists():
                print(f"✅ Données employés détectées: {Path(employee_path).name}")
                return employee_path
            print(f"❌ Fichier non trouvé: {employee_path}")

    def orchestrate_agents(self, customer_needs: str, analysis_report_path: str,
                          company_resources_path: str, employee_data_path: str) -> Dict[str, Any]:
        """
        Orchestre la collaboration entre GapAnalysisAgent et ModuleMatchAgent

        Args:
            customer_needs: Résultats de l'analyse des besoins clients
            analysis_report_path: Chemin vers le rapport d'analyse
            company_resources_path: Chemin vers les ressources internes
            employee_data_path: Chemin vers les données employés

        Returns:
            Dictionnaire avec tous les résultats d'analyse
        """
        print("\n🤖 ÉTAPE 5: Orchestration des agents d'analyse")
        print("=" * 50)

        # Préparation des fichiers pour les agents
        files_data = {
            'client_needs': customer_needs,
            'analysis_report': self._load_file_content(analysis_report_path),
            'company_resources': self._load_file_content(company_resources_path),
            'employee_data': employee_data_path
        }

        print("🔄 Lancement de GapAnalysisAgent...")
        gap_analysis_result = self.gap_analysis_agent.analyze(files_data)

        print("🔄 Lancement de ModuleMatchAgent...")
        module_match_result = self.module_match_agent.analyze(files_data)

        print("🔄 Synthèse orchestrateur...")
        orchestrator_synthesis = self._create_orchestrator_synthesis(
            gap_analysis_result, module_match_result, customer_needs
        )

        return {
            'gap_analysis': gap_analysis_result,
            'module_match': module_match_result,
            'orchestrator_synthesis': orchestrator_synthesis,
            'customer_needs': customer_needs
        }

    def _load_file_content(self, file_path: str) -> str:
        """Charge le contenu d'un fichier selon son extension"""
        path = Path(file_path)
        ext = path.suffix.lower()

        if ext == ".pdf":
            with pdfplumber.open(path) as pdf:
                return "\n".join(p.extract_text() or "" for p in pdf.pages)
        elif ext in {".docx", ".doc"}:
            doc = docx.Document(path)
            return "\n".join(p.text for p in doc.paragraphs)
        elif ext == ".csv":
            df = pd.read_csv(path)
            return df.head(10).to_string()
        else:
            return path.read_text(encoding='utf-8')

    def _create_orchestrator_synthesis(self, gap_analysis: str, module_match: str, customer_needs: str) -> str:
        """Crée une synthèse orchestrée des analyses"""

        prompt = f"""
# SYNTHÈSE ORCHESTRÉE - ANALYSE STRATÉGIQUE COMPLÈTE

Vous êtes un directeur technique senior qui doit synthétiser les analyses suivantes pour créer une roadmap stratégique globale.

## DONNÉES D'ENTRÉE

### BESOINS CLIENTS IDENTIFIÉS
{customer_needs[:1500]}...

### ANALYSE DES ÉCARTS (GAP ANALYSIS)
{gap_analysis[:1500]}...

### CORRESPONDANCE MODULAIRE (MODULE MATCH)
{module_match[:1500]}...

## MISSION STRATÉGIQUE

Créez une synthèse exécutive qui intègre TOUTES les analyses pour produire:

### 1. BILAN STRATÉGIQUE GLOBAL
- Niveau de préparation de l'entreprise (score/10)
- Risques majeurs identifiés
- Opportunités de différenciation

### 2. ROADMAP TECHNIQUE INTÉGRÉE
Priorisez les actions par criticité:
- Phase 1 (0-3 mois): Actions critiques immédiates
- Phase 2 (3-6 mois): Développements structurels  
- Phase 3 (6+ mois): Optimisations avancées

### 3. PLAN DE RESSOURCES CONSOLIDÉ
- Recrutements prioritaires (profils exacts)
- Formations internes nécessaires
- Partenariats stratégiques recommandés

### 4. BUDGET PRÉVISIONNEL
- Investissements techniques (développement, outils)
- Investissements humains (recrutement, formation)
- ROI attendu et métriques de succès

Soyez CONCRET, CHIFFRÉ et ACTIONNABLE.
"""

        response = self.orchestrator_model.generate_content(prompt)
        return response.text

    def generate_detailed_reports(self, orchestrated_results: Dict[str, Any]) -> Dict[str, str]:
        """
        Génère les 2 rapports détaillés finaux

        Args:
            orchestrated_results: Résultats de l'orchestration

        Returns:
            Dictionnaire avec les 2 rapports
        """
        print("\n📑 ÉTAPE 6: Génération des rapports détaillés")
        print("=" * 50)

        # Rapport 1: Modèles/Technologies
        print("🔄 Génération du rapport sur les modèles...")
        models_report = self._generate_models_report(orchestrated_results)

        # Rapport 2: Compétences/RH
        print("🔄 Génération du rapport sur les compétences...")
        skills_report = self._generate_skills_report(orchestrated_results)

        return {
            'models_report': models_report,
            'skills_report': skills_report
        }

    def _generate_models_report(self, results: Dict[str, Any]) -> str:
        """Génère le rapport détaillé sur les modèles"""

        prompt = f"""
# RAPPORT TECHNIQUE DÉTAILLÉ - ANALYSE DES MODÈLES ET TECHNOLOGIES

## CONTEXTE
Basé sur l'analyse complète des besoins clients et des capacités internes, produisez un rapport technique exhaustif.

## DONNÉES SOURCES
### Besoins Clients
{results['customer_needs'][:1000]}...

### Analyse des Écarts
{results['gap_analysis'][:1000]}...

### Correspondance Modulaire
{results['module_match'][:1000]}...

### Synthèse Orchestrée
{results['orchestrator_synthesis'][:1000]}...

## STRUCTURE DU RAPPORT DEMANDÉE

### 1. INVENTAIRE TECHNOLOGIQUE ACTUEL
**Modèles/Technologies existants** (avec évaluation 1-10):
- Technologies Frontend (React, Vue.js, etc.)
- Technologies Backend (APIs, microservices, etc.)
- Modèles ML/AI existants
- Infrastructure et DevOps
- Bases de données et stockage

### 2. MODÈLES À OPTIMISER/AJUSTER
Pour chaque modèle identifié:
- **Nom du modèle**: [Description]
- **Problème actuel**: [Gap identifié]
- **Ajustements requis**: [Actions concrètes]
- **Effort estimé**: [Temps/Complexité]
- **Impact business**: [Bénéfices attendus]
- **Priorité**: [Critique/Haute/Moyenne]

### 3. MODÈLES À DÉVELOPPER DE ZÉRO
Pour chaque nouveau développement:
- **Nom du modèle**: [Description]
- **Justification**: [Pourquoi nécessaire]
- **Spécifications techniques**: [Détails techniques]
- **Technologies recommandées**: [Stack technique]
- **Équipe requise**: [Profils et durée]
- **Jalons de développement**: [Timeline détaillée]
- **Coût estimé**: [Budget prévisionnel]

### 4. ARCHITECTURE CIBLE
- Diagramme conceptuel de l'architecture finale
- Intégrations entre anciens et nouveaux modèles
- Plan de migration et déploiement
- Stratégie de tests et validation

### 5. ROADMAP TECHNIQUE DÉTAILLÉE
**Trimestre 1**:
- Actions prioritaires (liste détaillée)
- Ressources allouées
- Livrables attendus

**Trimestre 2-4**:
- Développements majeurs
- Intégrations complexes
- Optimisations

### 6. RISQUES ET MITIGATIONS
- Risques techniques identifiés
- Plans de contingence
- Stratégies de mitigation

Soyez TRÈS DÉTAILLÉ, TECHNIQUE et ACTIONNABLE. Utilisez des exemples concrets et des métriques précises.
"""

        response = self.orchestrator_model.generate_content(prompt)
        return response.text

    def _generate_skills_report(self, results: Dict[str, Any]) -> str:
        """Génère le rapport détaillé sur les compétences"""

        prompt = f"""
# RAPPORT RH STRATÉGIQUE - ANALYSE DES COMPÉTENCES ET GAPS ORGANISATIONNELS

## CONTEXTE
Analyse approfondie des compétences nécessaires vs disponibles pour réussir le projet client.

## DONNÉES SOURCES
### Besoins Clients
{results['customer_needs'][:1000]}...

### Analyse des Écarts
{results['gap_analysis'][:1000]}...

### Correspondance Modulaire  
{results['module_match'][:1000]}...

### Synthèse Orchestrée
{results['orchestrator_synthesis'][:1000]}...

## STRUCTURE DU RAPPORT DEMANDÉE

### 1. AUDIT DES COMPÉTENCES ACTUELLES
**Cartographie par domaine** (score 1-10 par compétence):

**Techniques**:
- Développement (Frontend, Backend, Full-stack)
- Data Science & ML (Python, TensorFlow, etc.)
- DevOps & Infrastructure (AWS, Docker, K8s)
- Sécurité informatique
- Architecture système

**Métiers**:
- Gestion de projet (Agile, Scrum)
- Product Management
- UX/UI Design
- Business Analysis
- Support client

### 2. COMPÉTENCES À DÉVELOPPER (FORMATION INTERNE)
Pour chaque compétence identifiée:
- **Compétence**: [Nom précis]
- **Gap identifié**: [Écart niveau actuel vs requis]
- **Employés concernés**: [Noms/profils]
- **Plan de formation**: [Programme détaillé]
- **Durée**: [Temps nécessaire]
- **Coût**: [Budget formation]
- **Métrique de succès**: [Comment mesurer la progression]
- **Priorité**: [Critique/Haute/Moyenne]

### 3. RECRUTEMENTS NÉCESSAIRES
Pour chaque poste à pourvoir:
- **Intitulé du poste**: [Titre exact]
- **Compétences requises**: [Liste détaillée]
- **Niveau d'expérience**: [Junior/Senior/Expert]
- **Justification**: [Pourquoi ce recrutement]
- **Salaire estimé**: [Fourchette]
- **Urgence**: [Timeline de recrutement]
- **Profil idéal**: [Description complète]
- **Missions principales**: [Responsabilités]

### 4. GAPS ORGANISATIONNELS GÉNÉRAUX
**Structure organisationnelle**:
- Manques dans l'organigramme
- Besoins en leadership technique
- Processus à optimiser

**Communication & Collaboration**:
- Outils collaboratifs manquants
- Processus de communication
- Gestion des connaissances

**Culture d'entreprise**:
- Adaptation à l'innovation
- Gestion du changement
- Formation continue

### 5. PLAN D'ACTION RH CONSOLIDÉ
**Phase 1 (0-3 mois)**:
- Recrutements urgents
- Formations critiques
- Réorganisations immédiates

**Phase 2 (3-6 mois)**:
- Développement des compétences
- Intégration des nouvelles recrues
- Optimisation des processus

**Phase 3 (6+ mois)**:
- Montée en compétences avancée
- Évaluation et ajustements
- Plan de carrière et rétention

### 6. BUDGET RH GLOBAL
- Coût total des recrutements
- Budget formation et développement
- ROI attendu en termes de productivité
- Plan de financement

### 7. INDICATEURS DE PERFORMANCE
- KPIs de suivi des compétences
- Métriques de satisfaction équipe
- Indicateurs de productivité
- Taux de rétention cible

Soyez TRÈS PRÉCIS sur les profils, les compétences et les actions concrètes à mener.
"""

        response = self.orchestrator_model.generate_content(prompt)
        return response.text

    def export_all_reports_to_pdf(self, all_results: Dict[str, Any], reports: Dict[str, str]) -> Dict[str, str]:
        """Exporte tous les rapports en PDF"""
        print("\n📄 ÉTAPE 7: Export des rapports PDF")
        print("=" * 50)

        pdf_paths = {}

        # Export rapport modèles
        models_pdf = "rapport_modeles_technologies.pdf"
        self._create_styled_pdf(reports['models_report'], models_pdf, "Rapport Modèles & Technologies")
        pdf_paths['models_pdf'] = models_pdf

        # Export rapport compétences
        skills_pdf = "rapport_competences_rh.pdf"
        self._create_styled_pdf(reports['skills_report'], skills_pdf, "Rapport Compétences & RH")
        pdf_paths['skills_pdf'] = skills_pdf

        # Export synthèse orchestrée
        synthesis_pdf = "synthese_orchestree_globale.pdf"
        self._create_styled_pdf(all_results['orchestrator_synthesis'], synthesis_pdf, "Synthèse Orchestrée Globale")
        pdf_paths['synthesis_pdf'] = synthesis_pdf

        return pdf_paths

    def _create_styled_pdf(self, content: str, filename: str, title: str):
        """Crée un PDF stylé à partir du contenu"""
        doc = SimpleDocTemplate(
            filename,
            pagesize=A4,
            rightMargin=0.75*inch,
            leftMargin=0.75*inch,
            topMargin=1*inch,
            bottomMargin=0.75*inch
        )

        # Styles personnalisés
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=HexColor('#2E86AB'),
            fontName='Helvetica-Bold'
        )

        story = [Paragraph(title, title_style), Spacer(1, 20)]

        # Traitement du contenu
        paragraphs = content.split('\n\n')
        for para in paragraphs:
            if para.strip():
                # Nettoyage et formatage
                clean_para = para.replace('\n', '<br/>')
                clean_para = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', clean_para)
                clean_para = re.sub(r'\*(.*?)\*', r'<i>\1</i>', clean_para)

                if para.startswith('#'):
                    story.append(Paragraph(clean_para.lstrip('#').strip(), styles['Heading2']))
                else:
                    story.append(Paragraph(clean_para, styles['Normal']))
                story.append(Spacer(1, 12))

        doc.build(story)
        print(f"✅ PDF généré: {filename}")

    def run_complete_analysis(self) -> Dict[str, Any]:
        """Lance l'analyse complète du système"""
        print("🚀 DÉMARRAGE DU SYSTÈME D'ANALYSE RFP INTÉGRÉ")
        print("=" * 60)

        try:
            # Étape 1: Upload RFP
            rfp_path = self.upload_rfp_interface()

            # Étape 1bis: Analyse des besoins clients
            print("\n🔄 Analyse des besoins clients en cours...")
            customer_needs_result = self.customer_needs_agent.process_rfp(rfp_path)

            if not customer_needs_result['success']:
                raise Exception(f"Erreur analyse besoins: {customer_needs_result['error']}")

            customer_needs = customer_needs_result['report_text']
            print("✅ Analyse des besoins terminée")

            # Étape 2: Récupération des autres fichiers
            analysis_report_path = self.get_analysis_report_path()
            company_resources_path = self.load_company_resources()
            employee_data_path = self.load_employee_data()

            # Étape 3: Orchestration des agents
            orchestrated_results = self.orchestrate_agents(
                customer_needs, analysis_report_path,
                company_resources_path, employee_data_path
            )

            # Étape 4: Génération des rapports détaillés
            detailed_reports = self.generate_detailed_reports(orchestrated_results)

            # Étape 5: Export PDF
            pdf_paths = self.export_all_reports_to_pdf(orchestrated_results, detailed_reports)

            # Résultats finaux
            final_results = {
                'success': True,
                'customer_needs_analysis': customer_needs_result,
                'orchestrated_analysis': orchestrated_results,
                'detailed_reports': detailed_reports,
                'pdf_exports': pdf_paths,
                'summary': {
                    'rfp_processed': rfp_path,
                    'reports_generated': len(detailed_reports),
                    'pdfs_created': len(pdf_paths)
                }
            }

            self._display_final_summary(final_results)
            return final_results

        except Exception as e:
            print(f"\n❌ ERREUR SYSTÈME: {e}")
            return {'success': False, 'error': str(e)}

    def _display_final_summary(self, results: Dict[str, Any]):
        """Affiche le résumé final"""
        print("\n" + "=" * 60)
        print("🎉 ANALYSE COMPLÈTE TERMINÉE AVEC SUCCÈS!")
        print("=" * 60)

        print(f"\n📊 RÉSUMÉ GLOBAL:")
        print(f"   • RFP traité: {results['summary']['rfp_processed']}")
        print(f"   • Rapports générés: {results['summary']['reports_generated']}")
        print(f"   • PDFs créés: {results['summary']['pdfs_created']}")

        print(f"\n📄 FICHIERS GÉNÉRÉS:")
        for key, path in results['pdf_exports'].items():
            print(f"   • {key}: {path}")

        print(f"\n✨ Le système d'analyse RFP intégré a terminé avec succès!")
        print(f"   Tous les rapports sont disponibles dans le répertoire courant.")


# Classes agents spécialisés

class GapAnalysisAgent:
    """Agent d'analyse des écarts"""

    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("models/gemini-2.0-flash-exp")

    def analyze(self, files_data: Dict[str, Any]) -> str:
        """Analyse les écarts entre besoins et ressources"""

        prompt = f"""
# ANALYSE STRATÉGIQUE D'ÉCARTS (GAP ANALYSIS) - MCP FRAMEWORK

## CONTEXTE OPÉRATIONNEL
Vous êtes un consultant stratégique chargé d'identifier et quantifier les écarts entre :
- Les exigences clients (besoins métiers et techniques)
- Les capacités actuelles de l'entreprise  
- Les compétences disponibles des équipes

## DONNÉES SOURCES
=== BESOINS CLIENTS ===
{files_data['client_needs'][:1500]}...

=== RESSOURCES INTERNES ===
{files_data['company_resources'][:1500]}...

=== RAPPORT D'ANALYSE ===
{files_data['analysis_report'][:1500]}...

## MÉTHODOLOGIE D'ANALYSE
### 1. MATCH (CORRESPONDANCES)
- Identifier les capacités **parfaitement alignées** (score 90-100%)
- Lister les ressources **partiellement utilisables** (score 50-89%)
- Calculer le **taux de couverture global**

### 2. COMPARE (ECARTS CRITIQUES)
Classer les gaps en 3 catégories :
1. **Techniques** (Outils/Technologies manquantes)
   - Niveau : Critique/Haute/Moyenne/Faible
   - Impact : Chiffré (€, temps, risque)
   
2. **Compétences** (Gaps de savoir-faire)  
   - Cartographie des compétences manquantes
   - Niveau requis vs. actuel (Expert/Intermédiaire/Débutant)
   
3. **Organisationnels** (Processus/Structure)
   - Adéquation équipes/projets
   - Gouvernance et flux décisionnels

### 3. PREDICT (SOLUTIONS STRATÉGIQUES)
Pour chaque gap critique :
- Solutions **internes** (Réaffectation/Formation)
- Solutions **externes** (Recrutement/Partnership)
- Plan de mitigation des risques

## FORMAT DE SORTIE REQUIS
Produisez une analyse détaillée et structurée avec des recommandations concrètes et chiffrées.
"""

        response = self.model.generate_content(prompt)
        return response.text


class ModuleMatchAgent:
    """Agent de correspondance modulaire"""

    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("models/gemini-2.0-flash-exp")

    def analyze(self, files_data: Dict[str, Any]) -> str:
        """Analyse la correspondance entre modules"""

        prompt = f"""
# ANALYSE TECHNIQUE DE CORRESPONDANCE MODULAIRE - MCP (MATCH, COMPARE, PREDICT)

## CONTEXTE STRATÉGIQUE
Vous êtes un expert en analyse technique chargé d'évaluer l'adéquation entre :
- Les besoins clients (exigences fonctionnelles et techniques)
- Les ressources/modules existants de l'entreprise

## DONNÉES D'ENTRÉE
=== EXIGENCES CLIENT ===
{files_data['client_needs'][:1500]}...

=== RESSOURCES ENTREPRISE ===
{files_data['company_resources'][:1500]}...

=== RAPPORT D'ANALYSE ===
{files_data['analysis_report'][:1500]}...

## DIRECTIVES D'ANALYSE
### PHASE 1: MATCH (CORRESPONDANCES EXACTES)
1. Identifier les paires [besoin → ressource] parfaitement alignées
2. Pour chaque match :
   - Technologies communes
   - Couverture fonctionnelle (%)
   - Niveau de maturité (1-5)
3. Calculer le taux global de correspondance

### PHASE 2: COMPARE (ANALYSE DES ÉCARTS)
1. Lister les composants manquants classés par :
   - Criticité (Bloquant/Critique/Mineur)
   - Type (Frontend/Backend/ML/Data/Infra)
2. Évaluer pour chaque gap :
   - Complexité de développement (1-10)
   - Dépendances techniques
   - Impact business (1-5)

### PHASE 3: PREDICT (RECOMMANDATIONS)
1. Roadmap technique priorisée :
   - Modules à développer (urgence + complexité)
   - Modules à adapter (optimisation)
2. Besoins en ressources :
   - Compétences techniques requises
   - Estimation temps (semaines)
   - Coût approximatif

Produisez une analyse technique détaillée avec des recommandations précises et réalisables.
"""

        response = self.model.generate_content(prompt)
        return response.text


# Point d'entrée principal
def main():
    """Point d'entrée principal du système"""

    # Configuration des clés API
    TOGETHER_API_KEY = "8201d29393384428ba1c32e5e16a55d2d67188d618f94476b26ef0414e59e8dc"
    GEMINI_API_KEY = "AIzaSyCCKsZYOSP53ZGjF9p0ro1eNUYcdODCbtk"

    # Initialisation et lancement du système
    system = IntegratedRFPAnalysisSystem(TOGETHER_API_KEY, GEMINI_API_KEY)
    results = system.run_complete_analysis()

    # Définir les chemins des deux fichiers PDF
    pdf_path_1 = "rapport_competences_rh.pdf"
    pdf_path_2 = "rapport_modeles_technologies.pdf"

    # Créer une instance de ton générateur
    generateur = RFPResponseGenerator(pdf_path_1, pdf_path_2)

    company_info = {
    'company_name': 'Talan Tunisie Consulting',
    'trading_name': 'Talan',
    'address': '10 Rue de l\'énergie solaire, Impasse N°1, Charguia 1, Tunis 2035',
    'website': 'www.talan.com',
    'entity_type': 'Filiale d’un groupe international de conseil et d’expertises technologiques',
    'country': 'Tunisie',
    'contact_name': 'Imen Ayari',
    'contact_position': 'Consultante',
    'phone': '+216 71 809 300',
    'email': 'contact.tunisie@talan.com',
    'signatory_name': 'Imen Ayari',
    'signatory_title': 'Représentante de la filiale Talan Tunisie'
    }


    try:
        # Génération de la réponse à partir des deux PDF
        rfp_response = generateur.generate_rfp_response(company_info)
        print("✅ Réponse générée avec succès !\n")
        rfp_resp_file = f'RFP_Response.md'
        with open(rfp_resp_file, 'w', encoding='utf-8') as f:
            f.write(rfp_response)

        print("✅ Réponse RFP générée avec succès!")
        print(f"📁 Fichier sauvegardé: {rfp_resp_file}")


        return rfp_response, rfp_resp_file

    except Exception as e:
        print(f"❌ Erreur lors de la génération : {e}")


if __name__ == "__main__":
    main()