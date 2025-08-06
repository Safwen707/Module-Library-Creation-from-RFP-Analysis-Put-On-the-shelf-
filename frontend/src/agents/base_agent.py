from abc import ABC, abstractmethod
from typing import Any, Dict, Tuple

class Agent(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        """Nom de l'agent"""
        pass
    
    @property
    @abstractmethod
    def description(self) -> str:
        """Description de l'agent"""
        pass
    
    @abstractmethod
    def use(self, files: Dict[str, Any]) -> Tuple[str, Dict]:
        """Méthode principale pour utiliser l'agent"""
        pass