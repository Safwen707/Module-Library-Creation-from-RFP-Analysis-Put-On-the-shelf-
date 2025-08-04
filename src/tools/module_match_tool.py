from .base_tool import BaseTool
import google.generativeai as genai
import pdfplumber

class ModuleMatchTool(BaseTool):
    def __init__(self):
        super().__init__()
        genai.configure(api_key="AIzaSyCCKsZYOSP53ZGjF9p0ro1eNUYcdODCbtk")
        self.model = genai.GenerativeModel("models/gemini-2.5-flash")

    @property
    def name(self) -> str:
        return "Module Match MCP Tool"

    @property
    def description(self) -> str:
        return "Outil de matching de modules avec analyse MCP"

    def _extract_text(self, file):
        with pdfplumber.open(file) as pdf:
            return "\n".join(page.extract_text() for page in pdf.pages)

    def use(self, files: dict) -> tuple[str, dict]:
        req_text = self._extract_text(files['client'])
        res_text = self._extract_text(files['company'])
        
        prompt = f"""
# ANALYSE TECHNIQUE DE CORRESPONDANCE MODULAIRE - MCP (MATCH, COMPARE, PREDICT)

## CONTEXTE STRATÉGIQUE
Vous êtes un expert en analyse technique chargé d'évaluer l'adéquation entre :
- Les besoins clients (exigences fonctionnelles et techniques)
- Les ressources/modules existants de l'entreprise

## DONNÉES D'ENTRÉE
=== EXIGENCES CLIENT === (Premiers 1000 caractères)
{req_text[:1000]}...

=== RESSOURCES ENTREPRISE === (Premiers 1000 caractères)
{res_text[:1000]}...

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

```markdown
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
        response = self.model.generate_content(prompt)
        return response.text, {'module_matches': response.text}