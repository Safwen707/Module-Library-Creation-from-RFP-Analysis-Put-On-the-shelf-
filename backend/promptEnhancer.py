"""
===============================================================================
PROMPT ENHANCER - AMÉLIORATION AUTOMATIQUE DES PROMPTS RFP
===============================================================================

🔗 CONNEXION AVEC muRag_vlm.py:
-------------------------------
Ce module travaille en synergie avec muRag_vlm.py pour améliorer automatiquement
les prompts d'analyse RFP en utilisant les évaluations de fidélité générées.

📊 FLUX DE DONNÉES:
------------------
1. muRag_vlm.py effectue une analyse RFP et génère:
   - last_evaluation_score: Score de fidélité (0.0 à 1.0)
   - last_evaluation_reason: Raison détaillée de l'évaluation
   - last_analysis_prompt: Prompt utilisé pour l'analyse

2. promptEnhancer.py récupère ces données et les utilise pour:
   - Identifier les faiblesses du prompt original
   - Générer un prompt amélioré avec Gemini 2.5 Flash
   - Cibler un score de fidélité plus élevé

🎯 OBJECTIF:
-----------
Créer un cycle d'amélioration continue où chaque analyse RFP permet
d'optimiser les futurs prompts pour de meilleurs résultats.

🚀 USAGE SIMPLIFIÉ:
------------------
1. Lancez muRag_vlm.py avec un domaine (ex: "sécurité")
2. Lancez promptEnhancer.py → amélioration automatique !
3. Utilisez le prompt amélioré pour de futures analyses

"""

from muRag_vlm import last_evaluation_score, last_evaluation_reason, last_analysis_prompt

"""
===============================================================================
CONFIGURATION API GEMINI
===============================================================================
"""

import os, getpass
GOOGLE_API_KEY = "AIzaSyCEtBwwTcJitPxX6Vum92Bz6q5-Ga86hU4"
if not GOOGLE_API_KEY or GOOGLE_API_KEY == "PASTE_YOUR_KEY_HERE":
    raise ValueError("❌ Please set your Gemini API key")
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY
print("✅ Key set")

"""
===============================================================================
MOTEUR D'AMÉLIORATION DE PROMPTS
===============================================================================
"""

import google.generativeai as genai, textwrap, os

genai.configure(api_key=os.environ['GOOGLE_API_KEY'])
_enhancer_llm = genai.GenerativeModel('gemini-2.5-flash')

def enhance_prompt(predefined_prompt: str, judge_reports: list[dict], target_score: float = 0.7) -> str:
    """
    🔧 FONCTION CORE: Amélioration de prompt via Gemini
    
    Utilise les retours d'évaluation de muRag_vlm.py pour récrire un prompt
    et maximiser la pertinence des preuves récupérées.
    
    Args:
        predefined_prompt: Prompt original à améliorer
        judge_reports: Rapports d'évaluation de muRag_vlm.py (score + raison)
        target_score: Score de fidélité cible à atteindre
    
    Returns:
        str: Prompt réécrit et optimisé
    """
    feedback_lines = []
    for r in judge_reports:
        feedback_lines.append(f"• {r['judge_type'].capitalize()} {r['score']:.2f}: {r['reason']}")
    feedback_block = "\n".join(feedback_lines)

    system_p = textwrap.dedent("""As an expert prompt engineer in a Retrieval-Augmented Generation pipeline, your job is to rewrite user queries to achieve two main objectives:

        *Maximize the relevance of the retrieved evidence.
        *Ensure the generated answer satisfies all downstream judges by being accurate, complete, and directly addressing the query.
To do this effectively, consider the following strategies when rewriting:

    -Clarify the intent of the query if it is ambiguous.
    -Provide additional context that might help in retrieving pertinent information.
    -Specify key terms or aspects that should be focused on.
    -Eliminate any unnecessary or misleading parts of the query.
Output only the rewritten query, nothing else.""")
    user_p = f"""predefined_prompt:
{predefined_prompt}

Judge feedback:
{feedback_block}

Goal: rewrite the prompt so that every judge would likely score ≥ {target_score}."""
    rsp = _enhancer_llm.generate_content(system_p + "\n" + user_p)
    return rsp.text.strip()

print('✅ Prompt‑Enhancement function ready.')

def enhance_from_murag_evaluation(user_prompt: str = None, target_score: float = 0.7) -> str:
    """
    🚀 FONCTION PRINCIPALE: Interface simplifiée avec muRag_vlm.py
    
    Cette fonction établit le pont automatique entre muRag_vlm.py et promptEnhancer.py.
    Elle récupère automatiquement les dernières évaluations générées par muRag_vlm.py
    et les utilise pour améliorer un prompt.
    
    🔗 CONNEXION AUTOMATIQUE:
    ------------------------
    - Récupère last_evaluation_score de muRag_vlm.py
    - Récupère last_evaluation_reason de muRag_vlm.py  
    - Récupère last_analysis_prompt de muRag_vlm.py (si aucun prompt fourni)
    
    Args:
        user_prompt (str, optional): Le prompt à améliorer. 
                                   Si None, utilise automatiquement last_analysis_prompt
        target_score (float): Score de fidélité cible souhaité (défaut: 0.7)
        
    Returns:
        str: Prompt amélioré basé sur l'évaluation de muRag_vlm.py
        
    Exemple d'usage:
        # Après avoir lancé muRag_vlm.py avec "sécurité"
        enhanced = enhance_from_murag_evaluation()  # Utilise tout automatiquement !
    """
    # Si aucun prompt fourni, utiliser le dernier prompt d'analyse de muRag_vlm.py
    if user_prompt is None:
        if last_analysis_prompt is not None:
            user_prompt = last_analysis_prompt
            print(f"📝 Utilisation du prompt d'analyse automatique: {last_analysis_prompt}")
        else:
            print("⚠️ Aucun prompt fourni et aucun prompt d'analyse disponible")
            return "Aucun prompt disponible"
    
    # Vérifier si on a des évaluations disponibles depuis muRag_vlm.py
    if last_evaluation_score is None or last_evaluation_reason is None:
        print("⚠️ Aucune évaluation disponible dans muRag_vlm.py")
        print("💡 Conseil: Lancez d'abord muRag_vlm.py pour générer des évaluations")
        return user_prompt
    
    # Créer le rapport d'évaluation avec les données de muRag_vlm.py
    judge_reports = [
        {"judge_type": "faithfulness", "score": last_evaluation_score, "reason": last_evaluation_reason}
    ]
    
    # Améliorer le prompt avec Gemini
    enhanced = enhance_prompt(user_prompt, judge_reports, target_score)
    
    print(f"📊 Score actuel: {last_evaluation_score:.2f}")
    print(f"🎯 Score cible: {target_score}")
    print(f"💡 Raison: {last_evaluation_reason}")
    
    return enhanced

"""
===============================================================================
DÉMONSTRATION DU LIEN AVEC muRag_vlm.py
===============================================================================

Ce bloc démontre les 3 façons d'utiliser les données générées par muRag_vlm.py:

🔄 WORKFLOW COMPLET:
1. Utilisateur lance muRag_vlm.py et tape "sécurité"
2. muRag_vlm.py génère une analyse et stocke:
   - last_analysis_prompt = "Analyse stratégique complète des RFP sur le domaine sécurité"
   - last_evaluation_score = 0.65 (exemple)
   - last_evaluation_reason = "L'analyse manque de spécificités techniques"
3. promptEnhancer.py récupère ces données automatiquement
4. Gemini génère un prompt amélioré pour atteindre un score > 0.7

"""

print("\n🚀 DÉMONSTRATION AVEC LES ÉVALUATIONS DE muRag_vlm.py:")
print("="*60)

# ============================================================================
# MÉTHODE 1: AUTOMATIQUE (RECOMMANDÉE)
# ============================================================================
# Utilise automatiquement TOUT ce qui a été généré par muRag_vlm.py:
# - Le prompt d'analyse (last_analysis_prompt)
# - Le score d'évaluation (last_evaluation_score)  
# - La raison d'évaluation (last_evaluation_reason)
enhanced_prompt = enhance_from_murag_evaluation()  # Pas besoin de fournir le prompt !
print(f"\n✨ PROMPT AMÉLIORÉ AUTOMATIQUE:\n{enhanced_prompt}")

print("\n" + "="*60)

# ============================================================================
# MÉTHODE 2: SEMI-AUTOMATIQUE 
# ============================================================================
# Fournit un prompt personnalisé mais utilise les évaluations de muRag_vlm.py
custom_prompt = "Analysez les facteurs de succès dans nos réponses RFP"
enhanced_custom = enhance_from_murag_evaluation(custom_prompt)
print(f"\n🎯 PROMPT PERSONNALISÉ AMÉLIORÉ:\n{enhanced_custom}")

print("\n" + "="*60)

# ============================================================================
# MÉTHODE 3: MANUELLE (CONTRÔLE TOTAL)
# ============================================================================
# Accès direct aux variables de muRag_vlm.py pour un contrôle complet
if last_evaluation_score is not None and last_evaluation_reason is not None and last_analysis_prompt is not None:
    judge_reports = [
        {"judge_type": "faithfulness", "score": last_evaluation_score, "reason": last_evaluation_reason}
    ]
    manual_enhanced = enhance_prompt(last_analysis_prompt, judge_reports)
    print(f"\n🔧 MÉTHODE MANUELLE:\n{manual_enhanced}")
else:
    print("\n⚠️ Données incomplètes - lancez d'abord muRag_vlm.py pour une analyse complète")
    print("💡 ÉTAPES À SUIVRE:")
    print("   1. Ouvrez muRag_vlm.py")  
    print("   2. Tapez un domaine (ex: 'sécurité', 'cloud', 'agile')")
    print("   3. Attendez la fin de l'analyse avec évaluation")
    print("   4. Relancez promptEnhancer.py → amélioration automatique !")

