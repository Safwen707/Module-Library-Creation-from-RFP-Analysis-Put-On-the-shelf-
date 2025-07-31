'''from typing import Dict, Any, Tuple
from agents.base_agent import Agent

class AgentOrchestrator:
    def __init__(self, agents: Dict[str, Agent]):
        """
        Initialise l'orchestrateur avec un dictionnaire d'agents
        
        Args:
            agents: Dictionnaire {"nom_agent": instance_agent}
        """
        self.agents = agents
    
    def get_agent(self, agent_name: str) -> Agent:
        """
        Récupère un agent par son nom
        
        Args:
            agent_name: Nom de l'agent à récupérer
            
        Returns:
            Instance de l'agent correspondant
            
        Raises:
            ValueError: Si l'agent n'existe pas
        """
        agent = self.agents.get(agent_name)
        if not agent:
            raise ValueError(f"Agent {agent_name} non trouvé. Agents disponibles: {list(self.agents.keys())}")
        return agent
    
    def orchestrate_analysis(self, task_input: Dict[str, Any]) -> Tuple[str, Dict]:
        """
        Orchestre l'exécution d'une tâche avec l'agent approprié
        
        Args:
            task_input: {
                "agent_name": str, 
                "files": {
                    "client": file_object,
                    "company": file_object,
                    "employee": file_object (optionnel)
                }
            }
            
        Returns:
            Tuple (résultat_textuel, artefacts)
        """
        agent = self.get_agent(task_input["agent_name"])
        return agent.use(task_input["files"])
    
    def get_available_agents(self) -> Dict[str, str]:
        """Retourne la liste des agents disponibles avec leur description"""
        return {agent.name: agent.description for agent in self.agents.values()}'''
        
import concurrent.futures
from typing import Dict, Any, Tuple
from agents.base_agent import Agent

class AgentOrchestrator:
    def __init__(self, agents: Dict[str, Agent]):
        """
        Initialise avec un pool de threads pour l'exécution parallèle
        """
        self.agents = agents
        self.executor = concurrent.futures.ThreadPoolExecutor(max_workers=2)

    async def orchestrate_parallel_analysis(self, task_inputs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Exécute les analyses en parallèle et consolide les résultats
        
        Args:
            task_inputs: {
                "gap_analysis": {"files": {...}},  # Données pour GapAnalysisAgent
                "module_match": {"files": {...}}   # Données pour ModuleMatchAgent
            }
        
        Returns:
            {
                "gap_report": {...},
                "module_report": {...},
                "correlations": {...},
                "status": "completed/partial/error"
            }
        """
        results = {}
        
        def run_agent(agent_name: str, input_data: Dict):
            try:
                agent = self.agents[agent_name]
                return agent.use(input_data["files"])
            except Exception as e:
                return None, {"error": str(e)}

        # Lancement parallèle des agents
        with self.executor as executor:
            future_gap = executor.submit(
                run_agent, 
                "Gap Analysis Agent", 
                task_inputs["gap_analysis"]
            )
            future_module = executor.submit(
                run_agent, 
                "Module Match Agent", 
                task_inputs["module_match"]
            )

            gap_result, module_result = concurrent.futures.wait(
                [future_gap, future_module],
                return_when=concurrent.futures.ALL_COMPLETED
            )

            # Récupération des résultats
            results["gap_report"], gap_artifacts = future_gap.result()
            results["module_report"], module_artifacts = future_module.result()

            # Gestion des erreurs
            errors = {}
            if "error" in gap_artifacts:
                errors["gap_analysis"] = gap_artifacts["error"]
            if "error" in module_artifacts:
                errors["module_match"] = module_artifacts["error"]
            
            if errors:
                results["status"] = "error"
                results["errors"] = errors
            else:
                results["status"] = "completed"
                results["artifacts"] = {
                    "gap_analysis": gap_artifacts,
                    "module_match": module_artifacts
                }
                results["correlations"] = self._cross_analyze(
                    results["gap_report"],
                    results["module_report"]
                )

        return results

    def _cross_analyze(self, gap_report: Dict, module_report: Dict) -> Dict:
        """Corrèle les résultats des deux analyses"""
        # Implémentez votre logique de corrélation ici
        return {
            "technical_competency_alignment": self._map_skills_to_modules(gap_report, module_report),
            "resource_allocation": self._calculate_resource_needs(gap_report, module_report),
            "timeline_analysis": self._analyze_timelines(gap_report, module_report)
        }

    # Méthodes d'analyse croisée (exemples)
    def _map_skills_to_modules(self, gap_report, module_report):
        """Cartographie compétences → modules"""
        # ... implémentation spécifique
        return {}

    def _calculate_resource_needs(self, gap_report, module_report):
        """Calcule les besoins totaux en ressources"""
        # ... implémentation spécifique
        return {}

    def _analyze_timelines(self, gap_report, module_report):
        """Analyse les timelines combinées"""
        # ... implémentation spécifique
        return {}