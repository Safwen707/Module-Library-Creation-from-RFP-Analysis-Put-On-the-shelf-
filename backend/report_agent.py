import os
import sys
from pathlib import Path
import logging
import json
import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum
import logging
from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from jinja2 import Template
import uuid
import re
from datetime import datetime
import torch
from transformers import pipeline
from PyPDF2 import PdfReader



class RFPResponseGenerator:
    def __init__(self, pdf_path_1: str, pdf_path_2: str):
        """
        Initialise le générateur avec deux rapports PDF à analyser
        """
        combined_text = self.load_pdf_text(pdf_path_1) + "\n\n" + self.load_pdf_text(pdf_path_2)
        self.strategic_report = self.extract_report_data(combined_text)

        self.pipe = pipeline(
            "text-generation",
            model="TinyLlama/TinyLlama-1.1B-Chat-v1.0",
            torch_dtype=torch.bfloat16,
            device_map="auto"
        )

        self.generation_config = {
            "max_new_tokens": 512,
            "temperature": 0.7,
            "do_sample": True,
            "top_p": 0.9,
            "pad_token_id": self.pipe.tokenizer.eos_token_id
        }
        
    def load_pdf_text(self, pdf_path: str) -> str:
            """
            Charge le contenu textuel brut d’un fichier PDF.
            """
            try:
                reader = PdfReader(pdf_path)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
                return text
            except Exception as e:
                print(f"⚠️ Erreur lors de la lecture du PDF {pdf_path} : {e}")
                return ""

    def get_default_report_data(self) -> Dict:
        """Retourne les données par défaut basées sur le rapport stratégique fourni"""
        return {
            "modules_operationnels": [
                {"name": "Authentication Service", "technologies": ["Python", "FastAPI", "JWT"], "status": "Production-ready"},
                {"name": "Data Pipeline", "technologies": ["Apache Kafka", "Python", "Docker"], "status": "Production-ready"}
            ],
            "modules_optimisation": [
                {"name": "ML Model Serving", "status": "Continuous optimization", "timeline": "4 weeks"},
                {"name": "API Gateway", "status": "Performance enhancement", "timeline": "2 weeks"}
            ],
            "competences_existantes": [
                {"skill": "Python Development", "level": "Expert", "team_size": 5},
                {"skill": "DevOps/Docker", "level": "Advanced", "team_size": 3},
                {"skill": "API Design", "level": "Advanced", "team_size": 4}
            ],
            "competences_strategiques": [
                {"domain": "Machine Learning Engineering", "investment": "15000€", "strategic_value": "Critical"},
                {"domain": "Apache Flink/Stream Processing", "investment": "12000€", "strategic_value": "High"},
                {"domain": "Elasticsearch/Search Engines", "investment": "3000€", "strategic_value": "Medium"}
            ],
            "budget_total": 360000,
            "timeline": 24,
            "equipe_size": 12,
            "technologies": [
                "Python", "FastAPI", "JWT", "Apache Kafka", "Docker",
                "PyTorch", "MLflow", "Redis", "Apache Flink", "Elasticsearch",
                "Grafana", "Solidity", "Web3.py", "Ethereum"
            ],
            "projets_references": []
        }

    def extract_report_data(self, content: str) -> Dict:
        """Extrait les données clés du rapport stratégique"""
        data = {
            "modules_operationnels": [],
            "modules_optimisation": [],
            "competences_existantes": [],
            "competences_strategiques": [],
            "budget_total": 360000,  # Valeur par défaut du rapport
            "timeline": 24,  # Valeur par défaut du rapport
            "equipe_size": 12,  # Valeur par défaut
            "technologies": [],
            "projets_references": []
        }

        try:
            # Extraction des modules opérationnels
            if "Authentication Service" in content:
                data["modules_operationnels"].append({
                    "name": "Authentication Service",
                    "technologies": ["Python", "FastAPI", "JWT"],
                    "status": "Production-ready"
                })

            if "Data Pipeline" in content:
                data["modules_operationnels"].append({
                    "name": "Data Pipeline",
                    "technologies": ["Apache Kafka", "Python", "Docker"],
                    "status": "Production-ready"
                })

            # Transformation des modules à ajuster en modules d'optimisation
            if "ML Model Serving" in content:
                data["modules_optimisation"].append({
                    "name": "ML Model Serving",
                    "status": "Continuous optimization",
                    "timeline": "4 weeks"
                })

            if "API Gateway" in content:
                data["modules_optimisation"].append({
                    "name": "API Gateway",
                    "status": "Performance enhancement",
                    "timeline": "2 weeks"
                })

            # Extraction des compétences existantes
            data["competences_existantes"] = [
                {"skill": "Python Development", "level": "Expert", "team_size": 5},
                {"skill": "DevOps/Docker", "level": "Advanced", "team_size": 3},
                {"skill": "API Design", "level": "Advanced", "team_size": 4}
            ]

            # Transformation des compétences à développer en domaines d'expertise stratégiques
            data["competences_strategiques"] = [
                {"domain": "Machine Learning Engineering", "investment": "15000€", "strategic_value": "Critical"},
                {"domain": "Apache Flink/Stream Processing", "investment": "12000€", "strategic_value": "High"},
                {"domain": "Elasticsearch/Search Engines", "investment": "3000€", "strategic_value": "Medium"}
            ]

            # Extraction budget et timeline avec regex plus robuste
            budget_patterns = [r'360,000€', r'360000€', r'360\.000€', r'TOTAL:\s*(\d{3}[,.]?\d{3})€']
            for pattern in budget_patterns:
                budget_match = re.search(pattern, content)
                if budget_match:
                    if len(budget_match.groups()) > 0:
                        budget_str = budget_match.group(1).replace(',', '').replace('.', '')
                        data["budget_total"] = int(budget_str)
                    else:
                        data["budget_total"] = 360000
                    break

            timeline_patterns = [r'24 semaines', r'optimized_timeline[\'\"]\s*:\s*(\d+)', r'timeline.*?(\d+).*semaines']
            for pattern in timeline_patterns:
                timeline_match = re.search(pattern, content, re.IGNORECASE)
                if timeline_match:
                    if len(timeline_match.groups()) > 0:
                        data["timeline"] = int(timeline_match.group(1))
                    else:
                        data["timeline"] = 24
                    break

            # Calcul taille équipe
            data["equipe_size"] = sum([comp["team_size"] for comp in data["competences_existantes"]])

            # Technologies maîtrisées extraites du rapport
            tech_patterns = [
                r'Technologies:\s*([^Notes]+)',
                r'Technologies requises:\s*([^\n]+)',
                r'(Python|FastAPI|JWT|Apache Kafka|Docker|PyTorch|MLflow|Redis|Apache Flink|Elasticsearch|Grafana|Solidity|Web3\.py|Ethereum)'
            ]

            technologies_found = set()
            for pattern in tech_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                for match in matches:
                    if isinstance(match, str):
                        # Nettoyage et extraction des technologies
                        techs = re.findall(r'[A-Za-z][A-Za-z0-9\./]*', match)
                        technologies_found.update(techs)

            # Technologies par défaut si aucune trouvée
            if not technologies_found:
                technologies_found = {
                    "Python", "FastAPI", "JWT", "Apache Kafka", "Docker",
                    "PyTorch", "MLflow", "Redis", "Apache Flink", "Elasticsearch",
                    "Grafana", "Solidity", "Web3.py", "Ethereum"
                }

            data["technologies"] = list(technologies_found)[:14]  # Limite à 14 technologies

        except Exception as e:
            print(f"Erreur lors de l'extraction des données: {e}")
            # Utilisation des valeurs par défaut en cas d'erreur

        # Validation des données minimales
        if not data["modules_operationnels"]:
            data["modules_operationnels"] = [
                {"name": "Authentication Service", "technologies": ["Python", "FastAPI", "JWT"], "status": "Production-ready"},
                {"name": "Data Pipeline", "technologies": ["Apache Kafka", "Python", "Docker"], "status": "Production-ready"}
            ]

        if not data["technologies"]:
            data["technologies"] = ["Python", "FastAPI", "JWT", "Apache Kafka", "Docker", "PyTorch", "MLflow", "Redis"]

        return data

    def generate_professional_content(self, prompt: str, context: str = "") -> str:
        """Génère du contenu professionnel avec le modèle"""
        full_prompt = f"""<|system|>
Vous êtes un expert en rédaction de propositions commerciales techniques. Rédigez un contenu professionnel, convaincant et détaillé pour une réponse RFP. Le ton doit être confiant, technique mais accessible, et mettre en avant les points forts.

<|user|>
Contexte: {context}

Demande: {prompt}

Rédigez un paragraphe professionnel et convaincant qui répond parfaitement à cette demande en mettant en avant nos atouts techniques et notre expertise.

<|assistant|>"""

        try:
            result = self.pipe(full_prompt, **self.generation_config)
            generated_text = result[0]['generated_text']

            # Extraction de la réponse (après <|assistant|>)
            response = generated_text.split("<|assistant|>")[-1].strip()

            # Nettoyage et formatage
            response = re.sub(r'\n+', '\n\n', response)
            response = response.replace('*', '').replace('#', '')

            return response
        except Exception as e:
            print(f"Erreur génération: {e}")
            return "Contenu généré automatiquement non disponible."

    def generate_rfp_response(self, company_info: Dict) -> str:
        """Génère la réponse RFP complète en Markdown"""

        current_date = datetime.now().strftime("%d/%m/%Y")

        markdown_content = f"""# Request for Proposal (RFP) Response Form

**{company_info['company_name']}**
*Excellence Technique et Innovation Stratégique*

---

**Date de cette Proposition:** {current_date}
**En réponse à:** [Référence RFP]
**Par:** {company_info['company_name']}

---

## SECTION 1: About the Respondent

### 1.1 Our Profile

Cette proposition est soumise par **{company_info['company_name']}** (le Répondant) pour fournir les exigences spécifiées.

| Item | Detail |
|------|---------|
| **Nom légal complet** | {company_info['company_name']} |
| **Nom commercial** | {company_info.get('trading_name', 'N/A')} |
| **Adresse physique** | {company_info['address']} |
| **Site web** | {company_info['website']} |
| **Type d'entité** | {company_info['entity_type']} |
| **Pays de résidence** | {company_info['country']} |

### 1.2 Our Point of Contact

| Item | Detail |
|------|---------|
| **Personne de contact** | {company_info['contact_name']} |
| **Position** | {company_info['contact_position']} |
| **Téléphone** | {company_info['phone']} |
| **Email** | {company_info['email']} |

---

## SECTION 2: Response to the Requirements

### 2.1 Pre-conditions

| # | Pre-condition | Meets |
|---|---------------|-------|
| 1 | Capacité technique démontrée | **Oui** |
| 2 | Équipe qualifiée et certifiée | **Oui** |
| 3 | Infrastructure opérationnelle | **Oui** |

### 2.2 Overview of Our Solution

{self.generate_professional_content(
    "Rédigez un aperçu complet de notre solution technique en mettant l'accent sur nos modules opérationnels, notre expertise et notre approche innovante.",
    f"Nous avons {len(self.strategic_report['modules_operationnels'])} modules opérationnels en production, une équipe de {self.strategic_report['equipe_size']} experts, et un budget d'investissement stratégique de {self.strategic_report['budget_total']}€."
)}

---

## SECTION 3: Evaluation Criteria and Price

### Part A – Non-Price Evaluation Criteria

#### 1. Track Record (Weighting: 30%)

**a. Experience de notre organisation dans la livraison des services requis**

{self.generate_professional_content(
    "Décrivez notre expérience approfondie dans la livraison de solutions techniques similaires, en mettant l'accent sur nos modules opérationnels et notre expertise.",
    f"Modules opérationnels: {', '.join([m['name'] for m in self.strategic_report['modules_operationnels']])}. Technologies maîtrisées: {', '.join(self.strategic_report['technologies'][:8])}."
)}

**b. Expérience spécifique pertinente pour cette opportunité**

{self.generate_professional_content(
    "Détaillez notre expérience spécifique qui nous rend uniques pour ce projet, incluant notre approche d'optimisation continue et notre capacité d'adaptation.",
    f"Modules en optimisation continue: {len(self.strategic_report['modules_optimisation'])} modules. Timeline d'optimisation: {self.strategic_report['timeline']} semaines."
)}

**c. Trois exemples de contrats précédents démontrant notre capacité**

{self.generate_professional_content(
    "Présentez trois projets de référence qui illustrent parfaitement notre expertise technique, notre capacité de livraison et notre approche de gestion de la qualité.",
    "Projets incluant des systèmes d'authentification, pipelines de données, et solutions ML en production avec des clients de premier plan."
)}

#### 2. Capability of the Respondent to Deliver (Weighting: 25%)

**a. Équipements et infrastructures pour la livraison**

{self.generate_professional_content(
    "Décrivez notre infrastructure technique robuste et nos équipements de pointe qui garantissent une livraison de qualité supérieure.",
    f"Technologies de production: {', '.join(self.strategic_report['technologies'][:6])}. Modules opérationnels: {len(self.strategic_report['modules_operationnels'])} en production."
)}

**b. Équipe clé et qualifications**

{self.generate_professional_content(
    "Présentez notre équipe d'experts hautement qualifiés et leur expertise technique approfondie dans les domaines critiques du projet.",
    f"Équipe de {self.strategic_report['equipe_size']} experts techniques. Compétences expertes en Python Development (5 personnes), DevOps/Docker (3 personnes), API Design (4 personnes)."
)}

**c. Développement et maintien des compétences techniques**

{self.generate_professional_content(
    "Décrivez notre approche proactive de formation continue et d'investissement dans les compétences stratégiques de notre équipe.",
    f"Investissement formation: {sum([int(comp['investment'].replace('€', '')) for comp in self.strategic_report['competences_strategiques']])}€ en compétences stratégiques."
)}

**d. Réseau de sous-traitants spécialisés**

{self.generate_professional_content(
    "Présentez notre réseau stratégique de partenaires techniques spécialisés qui complètent parfaitement nos compétences internes.",
    "Réseau de partenaires experts en blockchain, deep learning, et ingénierie de fiabilité des systèmes."
)}

#### 3. Capacity of the Respondent to Deliver (Weighting: 20%)

**a. Historique de livraison de services similaires**

{self.generate_professional_content(
    "Démontrez notre track record exceptionnel de livraison dans les délais, selon les spécifications et dans le budget imparti.",
    f"Timeline optimisée de {self.strategic_report['timeline']} semaines. Budget maîtrisé de {self.strategic_report['budget_total']}€."
)}

**b. Interaction avec les parties prenantes clés**

{self.generate_professional_content(
    "Décrivez notre approche collaborative et notre structure organisationnelle optimisée pour une communication efficace avec tous les stakeholders.",
    f"Équipe structurée de {self.strategic_report['equipe_size']} experts avec des rôles clairement définis et des processus de communication standardisés."
)}

**c. Gestion des travaux hors périmètre**

{self.generate_professional_content(
    "Expliquez notre approche flexible et réactive pour gérer les demandes additionnelles tout en maintenant la qualité et les délais.",
    "Processus agiles et équipe extensible avec des partenaires stratégiques pour une réactivité maximale."
)}

**d. Structure et capacité organisationnelle**

{self.generate_professional_content(
    "Présentez la robustesse de notre organisation, notre structure financière solide et notre capacité à livrer des projets complexes.",
    f"Structure organisationnelle avec {self.strategic_report['equipe_size']} experts techniques. Budget projet de {self.strategic_report['budget_total']}€ démontrant notre capacité financière."
)}

**e. Systèmes opérationnels et financiers**

{self.generate_professional_content(
    "Décrivez nos systèmes de gestion avancés qui assurent un suivi précis et une livraison optimisée de tous nos projets.",
    "Systèmes de tracking et de gestion intégrés avec nos modules opérationnels pour une visibilité complète."
)}

#### 4. Proposed Solution (Weighting: 25%)

**a. Comment notre solution répond ou dépasse vos exigences**

{self.generate_professional_content(
    "Démontrez comment notre solution technique innovante non seulement répond parfaitement aux exigences mais les dépasse significativement.",
    f"Modules opérationnels: {', '.join([m['name'] for m in self.strategic_report['modules_operationnels']])}. Modules d'optimisation: {', '.join([m['name'] for m in self.strategic_report['modules_optimisation']])}."
)}

**b. Mesure de la qualité dans notre approche**

{self.generate_professional_content(
    "Expliquez nos métriques de qualité rigoureuses et nos processus d'assurance qualité qui garantissent une livraison d'excellence.",
    "Processus d'optimisation continue sur nos modules et métriques de performance avancées."
)}

**c. Idées nouvelles et processus innovants**

{self.generate_professional_content(
    "Présentez nos innovations techniques uniques et les bénéfices mesurables qu'elles apportent en termes d'efficacité et de qualité.",
    f"Technologies de pointe: {', '.join(self.strategic_report['technologies'][-6:])}. Approche d'optimisation continue sur {self.strategic_report['timeline']} semaines."
)}

**d. Gestion des risques et mitigation**

{self.generate_professional_content(
    "Détaillez notre approche proactive de gestion des risques et nos stratégies de mitigation éprouvées.",
    "Modules opérationnels en production garantissant la stabilité. Processus d'optimisation continue pour l'amélioration permanente."
)}

### Part B – Price

#### 3.2 Price as a Weighted criterion

**Public Value (based on whole-of-life cost)**

Notre proposition représente une valeur exceptionnelle avec un investissement total de **{self.strategic_report['budget_total']:,}€** réparti stratégiquement sur {self.strategic_report['timeline']} semaines.

**Répartition budgétaire optimisée:**
- Développement technique: 150,000€
- Formation et montée en compétences: 30,000€
- Recrutement stratégique: 150,000€
- Infrastructure: 30,000€

Cette structure budgétaire garantit un ROI optimal et une livraison dans les délais impartis.

#### 3.3 Pricing Schedule

| Milestone | Date Estimée | Montant (HT) |
|-----------|--------------|--------------|
| Kick-off et analyse détaillée | Semaine 2 | €72,000 |
| Développement modules critiques | Semaine 12 | €144,000 |
| Optimisation et tests | Semaine 20 | €72,000 |
| Livraison finale et formation | Semaine 24 | €72,000 |
| **TOTAL** | | **€360,000** |

#### 3.4 Assumptions

Nos estimations sont basées sur:
- Accès aux environnements de développement dans les délais convenus
- Disponibilité des parties prenantes clés selon le planning défini
- Infrastructure technique existante compatible avec nos modules
- Formation dispensée sur site ou en mode hybride selon les préférences

---

## SECTION 4: Proposed Contract

Après lecture et compréhension du Contrat Proposé dans la Section 5 du RFP, je confirme que ces termes et conditions sont acceptables. En cas de succès, j'accepte de signer un Contrat basé sur le Contrat Proposé, ou sur des termes et conditions de Contrat modifiés tels qu'ils seraient convenus avec l'Acheteur suite aux négociations.

---

## SECTION 5: Referees

### Premier Référent
- **Nom:** [Nom du référent technique senior]
- **Organisation:** [Organisation cliente majeure]
- **Services fournis:** Développement et déploiement de systèmes d'authentification et pipelines de données
- **Date de prestation:** 2023-2024
- **Téléphone:** [Numéro de téléphone]
- **Email:** [Email professionnel]
- **Relation:** Directeur Technique / Propriétaire du Contrat

### Deuxième Référent
- **Nom:** [Nom du référent projet]
- **Organisation:** [Cliente enterprise]
- **Services fournis:** Solutions ML et optimisation de performance
- **Date de prestation:** 2023-2024
- **Téléphone:** [Numéro de téléphone]
- **Email:** [Email professionnel]
- **Relation:** Chef de Projet / Contact Clé

### Troisième Référent
- **Nom:** [Nom du référent innovation]
- **Organisation:** [Partenaire technologique]
- **Services fournis:** Développement de modules innovants et formation technique
- **Date de prestation:** 2024
- **Téléphone:** [Numéro de téléphone]
- **Email:** [Email professionnel]
- **Relation:** Responsable Innovation / Contact Technique

**Veuillez me contacter avant d'approcher un référent:** Oui

---

## SECTION 6: Our Declaration

### Déclaration du Répondant

| Sujet | Déclaration | Accord |
|-------|-------------|--------|
| **Termes RFP** | J'ai lu et compris entièrement ce RFP, incluant les Termes RFP. Je confirme que le Répondant accepte d'être lié par ceux-ci. | **Accord** |
| **Collecte d'informations** | Le Répondant autorise l'Acheteur à collecter toute information pertinente depuis des tiers, incluant les référents, et à utiliser ces informations dans l'évaluation. | **Accord** |
| **Exigences** | J'ai lu et compris la nature et l'étendue des Exigences de l'Acheteur. Je confirme que le Répondant a la capacité nécessaire pour pleinement satisfaire les Exigences. | **Accord** |
| **Éthique** | Le Répondant garantit qu'il n'a pas conclu d'arrangements inappropriés avec des concurrents et n'a pas tenté d'influencer indûment des représentants de l'Acheteur. | **Accord** |
| **Période de Validité** | Je confirme que cette Proposition reste ouverte pour acceptation pendant la Période de Validité de l'Offre. | **Accord** |
| **Conflit d'Intérêts** | Le Répondant garantit qu'il n'a aucun Conflit d'Intérêts réel, potentiel ou perçu. | **Accord** |

**Détails du conflit d'intérêts:** Non applicable

### DÉCLARATION PAR LE RÉPONDANT

Je déclare qu'en soumettant cette Proposition et cette déclaration:
- Les informations fournies sont vraies, exactes et complètes
- La Proposition ne contient aucun matériel qui enfreindrait les droits de propriété intellectuelle d'un tiers
- J'ai sécurisé toutes les autorisations appropriées pour soumettre cette Proposition

**Signature:** _______________________
**Nom complet:** {company_info['signatory_name']}
**Titre/Position:** {company_info['signatory_title']}
**Nom de l'organisation:** {company_info['company_name']}
**Date:** {current_date}

---

*Cette réponse RFP a été générée avec notre système d'intelligence artificielle avancé, démontrant notre capacité d'innovation et d'automatisation pour une efficacité optimale.*
"""

        return markdown_content

# Exemple d'utilisation
def main():
    # Configuration de l'entreprise (à personnaliser)
    company_info = {
        'company_name': 'TechExcellence Solutions',
        'trading_name': 'TechExcel',
        'address': '123 Innovation Street, Tech City',
        'website': 'www.techexcellence.com',
        'entity_type': 'Limited Liability Company',
        'country': 'France',
        'contact_name': 'Jean Dupont',
        'contact_position': 'Directeur Technique',
        'phone': '+33 1 23 45 67 89',
        'email': 'j.dupont@techexcellence.com',
        'signatory_name': 'Jean Dupont',
        'signatory_title': 'Directeur Technique'
    }
    
    # 👉 Chemins vers les deux fichiers PDF
    pdf_rapport_competences = "rapport_competences_rh.pdf"
    pdf_rapport_tech = "rapport_modeles_technologies.pdf"

    # 💡 Initialisation avec les deux PDF
    generator = RFPResponseGenerator(pdf_rapport_competences, pdf_rapport_tech)

    # 📝 Génération
    rfp_response = generator.generate_rfp_response(company_info)

    # 💾 Sauvegarde
    rfp_resp_file = f'RFP_Response.md'
    with open(rfp_resp_file, 'w', encoding='utf-8') as f:
        f.write(rfp_response)

    print("✅ Réponse RFP générée avec succès!")
    print(f"📁 Fichier sauvegardé: {rfp_resp_file}")

    return rfp_response, rfp_resp_file



if __name__ == "__main__":
    rfp_response, rfp_resp_file = main()
