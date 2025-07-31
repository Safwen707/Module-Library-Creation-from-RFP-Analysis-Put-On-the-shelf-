import google.generativeai as genai
from .base_agent import Agent
from tools.module_match_tool import ModuleMatchTool
import matplotlib.pyplot as plt

class ModuleMatchAgent(Agent):
    def __init__(self):
        super().__init__()
        self.tool = ModuleMatchTool()
        genai.configure(api_key="AIzaSyCCKsZYOSP53ZGjF9p0ro1eNUYcdODCbtk")
        self.model = genai.GenerativeModel("models/gemini-2.5-flash")

    @property
    def name(self) -> str:
        return "Module Match Agent"

    @property
    def description(self) -> str:
        return "Compare et match les modules entre besoins clients et ressources"

    def use(self, files: dict) -> tuple[str, dict]:
        # Utilisation de l'outil MCP
        match_result, artifacts = self.tool.use(files)
        
        # Génération du graphique
        fig, ax = plt.subplots()
        ax.pie([75, 25], labels=['Match', 'Gap'], autopct='%1.1f%%')
        plt.close(fig)
        
        return match_result, {
            'chart': fig,
            **artifacts
        }