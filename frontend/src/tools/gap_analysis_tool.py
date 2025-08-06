from .base_tool import BaseTool
import google.generativeai as genai
import pandas as pd

class GapAnalysisTool(BaseTool):
    def __init__(self):
        super().__init__()
        genai.configure(api_key="AIzaSyCCKsZYOSP53ZGjF9p0ro1eNUYcdODCbtk")
        self.model = genai.GenerativeModel("models/gemini-2.5-flash")

    @property
    def name(self) -> str:
        return "Gap Analysis MCP Tool"

    @property
    def description(self) -> str:
        return "Outil MCP pour l'analyse d'écarts (Match, Compare, Predict)"

    def use(self, files: dict) -> tuple[str, dict]:
        client_content = files['client'].read().decode('utf-8')
        company_content = files['company'].read().decode('utf-8')
        employee_data = pd.read_csv(files['employee']).head(5).to_string() if 'employee' in files else "Non fourni"
        
        prompt = f"""
# ANALYSE STRATÉGIQUE D'ÉCARTS (GAP ANALYSIS) - MCP FRAMEWORK

## CONTEXTE OPÉRATIONNEL
Vous êtes un consultant stratégique chargé d'identifier et quantifier les écarts entre :
- Les exigences clients (besoins métiers et techniques)
- Les capacités actuelles de l'entreprise
- Les compétences disponibles des équipes

## DONNÉES SOURCES
=== BESOINS CLIENTS === (Extrait analysé)
{client_content[:1000]}...

=== RESSOURCES INTERNES === (Capacités existantes)
{company_content[:1000]}...

=== COMPÉTENCES ÉQUIPE === (Top 5 lignes)
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

```markdown
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
        response = self.model.generate_content(prompt)
        return response.text, {'mcp_analysis': response.text}