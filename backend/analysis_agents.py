# -*- coding: utf-8 -*-
"""
Analysis Agents - Gap Analysis et Module Match
Agents pour l'analyse d'écarts et le matching de modules
"""

import io
import os
from abc import ABC, abstractmethod
from typing import Dict, Tuple, Any
import pandas as pd
import matplotlib.pyplot as plt
import google.generativeai as genai
import pdfplumber
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet


class BaseAgent(ABC):
    """Classe de base pour tous les agents d'analyse"""
    
    @property
    @abstractmethod
    def name(self) -> str:
        pass
    
    @property
    @abstractmethod
    def description(self) -> str:
        pass
    
    @abstractmethod
    def use(self, files: Dict) -> Tuple[str, Dict]:
        pass


class BaseTool(ABC):
    """Classe de base pour tous les outils MCP"""
    
    @property
    @abstractmethod
    def name(self) -> str:
        pass
    
    @property
    @abstractmethod
    def description(self) -> str:
        pass
    
    @abstractmethod
    def use(self, files: Dict) -> Tuple[str, Dict]:
        pass


class GapAnalysisTool(BaseTool):
    """Outil MCP pour l'analyse d'écarts (Match, Compare, Predict)"""
    
    def __init__(self, api_key: str = None):
        if api_key:
            genai.configure(api_key=api_key)
        elif not os.environ.get("GOOGLE_API_KEY"):
            raise ValueError("GOOGLE_API_KEY doit être définie")
        else:
            genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
        
        self.model = genai.GenerativeModel("models/gemini-2.0-flash-exp")
    
    @property
    def name(self) -> str:
        return "Gap Analysis MCP Tool"
    
    @property
    def description(self) -> str:
        return "Outil MCP pour l'analyse d'écarts (Match, Compare, Predict)"
    
    def use(self, files: Dict) -> Tuple[str, Dict]:
        """
        Analyse les écarts entre besoins clients et ressources
        
        Args:
            files: Dictionnaire des fichiers {key: file_content}
            
        Returns:
            Tuple (analyse_text, artifacts_dict)
        """
        # Extraction du contenu des fichiers
        client_content = self._extract_content(files.get('client', ''))
        company_content = self._extract_content(files.get('company', ''))
        employee_data = self._extract_employee_data(files.get('employee')) if 'employee' in files else "Non fourni"
        
        prompt = f"""
# ANALYSE STRATÉGIQUE D'ÉCARTS (GAP ANALYSIS) - MCP FRAMEWORK

## CONTEXTE OPÉRATIONNEL
Vous êtes un consultant stratégique chargé d'identifier et quantifier les écarts entre :
- Les exigences clients (besoins métiers et techniques)
- Les capacités actuelles de l'entreprise
- Les compétences disponibles des équipes

## DONNÉES SOURCES
=== BESOINS CLIENTS === (Extrait analysé)
{client_content[:1500]}...

=== RESSOURCES INTERNES === (Capacités existantes)
{company_content[:1500]}...

=== COMPÉTENCES ÉQUIPE === (Échantillon)
{employee_data}

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

### BILAN GLOBAL
- Couverture besoins : XX% (YY/ZZ exigences couvertes)
- Gaps critiques : [Techniques: A, Compétences: B, Orga: C]
- Investissement estimé : [Formation: X€, Recrutement: Y€]

### MATRICE DES CORRESPONDANCES (TOP 5)
| Exigence              | Ressource          | Score | Type          |
|-----------------------|--------------------|-------|---------------|
| [Description]        | [Solution]         | 85%   | Partiel       |

### GAPS PRIORITAIRES
**1. [Nom du Gap]**  
- Type : [Technique/Compétence/Orga]  
- Criticité : 🔴 Critique (Score: X/10)  
- Impact : [Description quantitative]  
- Solutions :  
  ▸ [Solution 1] (Coût: X€, Délai: Y semaines)  
  ▸ [Solution 2] (Coût: X€, Délai: Y semaines)  

### ROADMAP RECOMMANDÉE
1. [Mois 1] Action prioritaire (Ressources: [A,B,C])
2. [Mois 2-3] Correctifs structurels
3. [Mois 4+] Optimisation continue
"""
        
        try:
            response = self.model.generate_content(prompt)
            return response.text, {'mcp_analysis': response.text}
        except Exception as e:
            return f"Erreur lors de l'analyse: {str(e)}", {}
    
    def _extract_content(self, file_content: Any) -> str:
        """Extrait le contenu textuel d'un fichier"""
        if isinstance(file_content, str):
            return file_content
        elif hasattr(file_content, 'read'):
            try:
                content = file_content.read()
                if isinstance(content, bytes):
                    return content.decode('utf-8')
                return str(content)
            except:
                return "Erreur de lecture du fichier"
        return str(file_content)
    
    def _extract_employee_data(self, employee_file) -> str:
        """Extrait les données employés depuis un CSV"""
        try:
            if hasattr(employee_file, 'read'):
                df = pd.read_csv(employee_file)
            else:
                df = pd.read_csv(io.StringIO(str(employee_file)))
            return df.head(5).to_string()
        except Exception as e:
            return f"Erreur lecture CSV: {str(e)}"


class ModuleMatchTool(BaseTool):
    """Outil de matching de modules avec analyse MCP"""
    
    def __init__(self, api_key: str = None):
        if api_key:
            genai.configure(api_key=api_key)
        elif not os.environ.get("GOOGLE_API_KEY"):
            raise ValueError("GOOGLE_API_KEY doit être définie")
        else:
            genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
        
        self.model = genai.GenerativeModel("models/gemini-2.0-flash-exp")
    
    @property
    def name(self) -> str:
        return "Module Match MCP Tool"
    
    @property
    def description(self) -> str:
        return "Outil de matching de modules avec analyse MCP"
    
    def _extract_text(self, file) -> str:
        """Extrait le texte d'un fichier PDF"""
        try:
            if hasattr(file, 'read'):
                with pdfplumber.open(file) as pdf:
                    return "\n".join(page.extract_text() for page in pdf.pages)
            else:
                # Si c'est déjà du texte
                return str(file)
        except Exception as e:
            return f"Erreur extraction PDF: {str(e)}"
    
    def use(self, files: Dict) -> Tuple[str, Dict]:
        """
        Analyse le matching entre modules clients et ressources
        
        Args:
            files: Dictionnaire des fichiers
            
        Returns:
            Tuple (analyse_text, artifacts_dict)
        """
        req_text = self._extract_text(files.get('client', ''))
        res_text = self._extract_text(files.get('company', ''))
        
        prompt = f"""
# ANALYSE TECHNIQUE DE CORRESPONDANCE MODULAIRE - MCP (MATCH, COMPARE, PREDICT)

## CONTEXTE STRATÉGIQUE
Vous êtes un expert en analyse technique chargé d'évaluer l'adéquation entre :
- Les besoins clients (exigences fonctionnelles et techniques)
- Les ressources/modules existants de l'entreprise

## DONNÉES D'ENTRÉE
=== EXIGENCES CLIENT === (Extrait)
{req_text[:1500]}...

=== RESSOURCES ENTREPRISE === (Extrait)
{res_text[:1500]}...

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

## FORMAT DE SORTIE ATTENDU

### SYNTHÈSE GLOBALE
- Taux de correspondance: XX%  
- Gaps critiques: X/Y  
- Effort total estimé: X semaines

### CORRESPONDANCES (TOP 5)
| Besoin                | Ressource           | Couverture | Technologies       |
|-----------------------|---------------------|------------|--------------------|
| [Besoin]             | [Ressource]         | XX%        | Tech1, Tech2       |

### GAPS PRIORITAIRES (TOP 5)
| Composant           | Type       | Criticité | Complexité | Solutions possibles |
|---------------------|------------|-----------|------------|---------------------|
| [Nom]              | [Type]     | Critique  | 7/10       | [Solution1], [Solution2] |

### RECOMMANDATIONS STRATÉGIQUES
1. [Priorité 1] Action concrète (Ressources: X, Délai: Y)
2. [Priorité 2] Action concrète (Ressources: X, Délai: Y)
"""
        
        try:
            response = self.model.generate_content(prompt)
            return response.text, {'module_matches': response.text}
        except Exception as e:
            return f"Erreur lors de l'analyse: {str(e)}", {}


class GapAnalysisAgent(BaseAgent):
    """Agent pour l'analyse des écarts entre besoins clients et ressources internes"""
    
    def __init__(self, api_key: str = None):
        self.tool = GapAnalysisTool(api_key)
    
    @property
    def name(self) -> str:
        return "Gap Analysis Agent"
    
    @property
    def description(self) -> str:
        return "Analyse les écarts entre besoins clients et ressources internes"
    
    def use(self, files: Dict) -> Tuple[str, Dict]:
        """
        Exécute l'analyse d'écarts et génère les artefacts
        
        Args:
            files: Dictionnaire des fichiers d'entrée
            
        Returns:
            Tuple (résultat_analyse, artefacts)
        """
        # Utilisation de l'outil MCP
        analysis_result, artifacts = self.tool.use(files)
        
        # Génération du PDF
        pdf_buffer = self._generate_pdf_report(analysis_result)
        
        return analysis_result, {
            'pdf_report': pdf_buffer,
            **artifacts
        }
    
    def _generate_pdf_report(self, analysis_text: str) -> io.BytesIO:
        """Génère un rapport PDF à partir du texte d'analyse"""
        pdf_buffer = io.BytesIO()
        doc = SimpleDocTemplate(pdf_buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        
        story = [Paragraph("Rapport d'Analyse des Écarts", styles['Title'])]
        
        for line in analysis_text.split('\n'):
            if line.strip():
                story.append(Paragraph(line, styles['Normal']))
                story.append(Spacer(1, 6))
        
        try:
            doc.build(story)
            pdf_buffer.seek(0)
            return pdf_buffer
        except Exception as e:
            print(f"Erreur génération PDF: {e}")
            return io.BytesIO()


class ModuleMatchAgent(BaseAgent):
    """Agent pour comparer et matcher les modules entre besoins clients et ressources"""
    
    def __init__(self, api_key: str = None):
        self.tool = ModuleMatchTool(api_key)
    
    @property
    def name(self) -> str:
        return "Module Match Agent"
    
    @property
    def description(self) -> str:
        return "Compare et match les modules entre besoins clients et ressources"
    
    def use(self, files: Dict) -> Tuple[str, Dict]:
        """
        Exécute l'analyse de matching et génère les artefacts
        
        Args:
            files: Dictionnaire des fichiers d'entrée
            
        Returns:
            Tuple (résultat_analyse, artefacts)
        """
        # Utilisation de l'outil MCP
        match_result, artifacts = self.tool.use(files)
        
        # Génération du graphique
        chart_fig = self._generate_match_chart()
        
        return match_result, {
            'chart': chart_fig,
            **artifacts
        }
    
    def _generate_match_chart(self) -> plt.Figure:
        """Génère un graphique de correspondance"""
        fig, ax = plt.subplots(figsize=(8, 6))
        
        # Données d'exemple (à remplacer par des données réelles)
        labels = ['Correspondances', 'Écarts']
        sizes = [75, 25]
        colors = ['#2E86AB', '#F18F01']
        
        wedges, texts, autotexts = ax.pie(
            sizes, 
            labels=labels, 
            autopct='%1.1f%%',
            colors=colors,
            startangle=90
        )
        
        ax.set_title('Analyse de Correspondance Modules', fontsize=14, fontweight='bold')
        
        # Amélioration de l'apparence
        for autotext in autotexts:
            autotext.set_color('white')
            autotext.set_fontweight('bold')
            
        plt.tight_layout()
        return fig


# Fonctions utilitaires pour l'orchestrateur
def create_analysis_agents(google_api_key: str = None) -> Dict[str, BaseAgent]:
    """
    Crée et retourne un dictionnaire des agents d'analyse
    
    Args:
        google_api_key: Clé API Google Gemini
        
    Returns:
        Dictionnaire des agents {nom: agent}
    """
    agents = {
        'gap_analysis': GapAnalysisAgent(google_api_key),
        'module_match': ModuleMatchAgent(google_api_key)
    }
    
    return agents


def validate_files(files: Dict, required_files: list = None) -> Dict[str, bool]:
    """
    Valide la présence et le format des fichiers requis
    
    Args:
        files: Dictionnaire des fichiers
        required_files: Liste des fichiers requis (optionnel)
        
    Returns:
        Dictionnaire de validation {fichier: valide}
    """
    if required_files is None:
        required_files = ['client', 'company']
    
    validation = {}
    
    for file_key in required_files:
        validation[file_key] = file_key in files and files[file_key] is not None
    
    return validation


def save_artifacts(artifacts: Dict, output_dir: str = "output") -> Dict[str, str]:
    """
    Sauvegarde les artefacts générés
    
    Args:
        artifacts: Dictionnaire des artefacts
        output_dir: Répertoire de sortie
        
    Returns:
        Dictionnaire des chemins de sauvegarde
    """
    from pathlib import Path
    import pickle
    
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    saved_files = {}
    
    for name, artifact in artifacts.items():
        try:
            if isinstance(artifact, io.BytesIO):
                # PDF ou fichier binaire
                file_path = output_path / f"{name}.pdf"
                with open(file_path, 'wb') as f:
                    f.write(artifact.getvalue())
                saved_files[name] = str(file_path)
                
            elif isinstance(artifact, plt.Figure):
                # Graphique matplotlib
                file_path = output_path / f"{name}.png"
                artifact.savefig(file_path, dpi=300, bbox_inches='tight')
                saved_files[name] = str(file_path)
                
            elif isinstance(artifact, str):
                # Fichier texte
                file_path = output_path / f"{name}.txt"
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(artifact)
                saved_files[name] = str(file_path)
                
            else:
                # Autres objets - pickle
                file_path = output_path / f"{name}.pkl"
                with open(file_path, 'wb') as f:
                    pickle.dump(artifact, f)
                saved_files[name] = str(file_path)
                
        except Exception as e:
            print(f"Erreur sauvegarde {name}: {e}")
            saved_files[name] = f"Erreur: {str(e)}"
    
    return saved_files


if __name__ == "__main__":
    # Test des agents
    print("🧪 Test des agents d'analyse")
    
    # Données de test
    test_files = {
        'client': "Besoins client: Système de gestion des données, API REST, Interface web moderne",
        'company': "Ressources: Équipe Python, Base de données PostgreSQL, Infrastructure AWS",
        'employee': "nom,competence,niveau\nJean,Python,Expert\nMarie,React,Intermédiaire"
    }
    
    try:
        # Test Gap Analysis
        print("\n📊 Test Gap Analysis Agent...")
        gap_agent = GapAnalysisAgent()
        gap_result, gap_artifacts = gap_agent.use(test_files)
        print(f"✅ Gap Analysis: {len(gap_result)} caractères générés")
        
        # Test Module Match
        print("\n🔗 Test Module Match Agent...")
        match_agent = ModuleMatchAgent()
        match_result, match_artifacts = match_agent.use(test_files)
        print(f"✅ Module Match: {len(match_result)} caractères générés")
        
        print("\n🎉 Tests réussis!")
        
    except Exception as e:
        print(f"\n❌ Erreur lors des tests: {e}")
        print("Vérifiez que GOOGLE_API_KEY est définie dans les variables d'environnement")