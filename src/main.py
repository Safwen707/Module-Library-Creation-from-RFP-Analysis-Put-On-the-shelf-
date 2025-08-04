'''from agents import GapAnalysisAgent, ModuleMatchAgent
import streamlit as st
from orchestrator import AgentOrchestrator


def main():
    st.title("🤖 Système d'Agents Intelligents")
    
    
    # Initialisation des agents
    gap_agent = GapAnalysisAgent()
    match_agent = ModuleMatchAgent()
    
    # Sélection de l'agent
    agent_choice = st.selectbox(
        "Choisir un agent",
        [gap_agent.name, match_agent.name],
        key="agent_selector"
    )
    
    # Zone de dépôt de fichiers dynamique
    st.sidebar.header("📤 Déposer les fichiers")
    
    if agent_choice == gap_agent.name:
        st.write(f"**Description**: {gap_agent.description}")
        
        # Champs spécifiques pour Gap Analysis
        client_file = st.sidebar.file_uploader(
            "Exigences Client (.tex)",
            type=["tex"],
            key="gap_client"
        )
        company_file = st.sidebar.file_uploader(
            "Ressources Entreprise (.tex)",
            type=["tex"],
            key="gap_company"
        )
        employee_file = st.sidebar.file_uploader(
            "Compétences Employés (.csv)",
            type=["csv"],
            key="gap_employee"
        )
        
        if st.sidebar.button("Lancer l'analyse", key="gap_analyze"):
            if client_file and company_file:
                results, artifacts = gap_agent.use({
                    "client": client_file,
                    "company": company_file,
                    "employee": employee_file
                })
                st.subheader("📊 Résultats d'analyse")
                st.text_area("Rapport complet", results, height=300)
                
                if "pdf_report" in artifacts:
                    st.download_button(
                        "📥 Télécharger le rapport PDF",
                        data=artifacts["pdf_report"],
                        file_name="gap_analysis_report.pdf",
                        mime="application/pdf"
                    )
            else:
                st.warning("Veuillez déposer les fichiers requis (.tex)")

    else:  # Module Match Agent
        st.write(f"**Description**: {match_agent.description}")
        
        # Champs spécifiques pour Module Matching
        client_pdf = st.sidebar.file_uploader(
            "Besoins Client (.pdf)",
            type=["pdf"],
            key="match_client"
        )
        company_pdf = st.sidebar.file_uploader(
            "Ressources Internes (.pdf)",
            type=["pdf"],
            key="match_company"
        )
        
        if st.sidebar.button("Lancer l'analyse", key="match_analyze"):
            if client_pdf and company_pdf:
                results, artifacts = match_agent.use({
                    "client": client_pdf,
                    "company": company_pdf
                })
                st.subheader("📊 Résultats de matching")
                st.text_area("Rapport complet", results, height=300)
                
                if "chart" in artifacts:
                    st.pyplot(artifacts["chart"])
            else:
                st.warning("Veuillez déposer les fichiers PDF requis")

if __name__ == "__main__":
    main()


import streamlit as st
import concurrent.futures
from agents.gap_analysis_agent import GapAnalysisAgent
from agents.module_match_agent import ModuleMatchAgent
from orchestrator import AgentOrchestrator
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

def main():
    st.set_page_config(page_title="🤖 Orchestrateur d'Agents d'Analyse", layout="wide")
    st.title("🤖 Orchestrateur d'Agents d'Analyse de Documents")

    # --- Initialisation des agents ---
    gap_agent = GapAnalysisAgent()
    match_agent = ModuleMatchAgent()

    # --- Interface utilisateur Streamlit ---
    st.sidebar.header("Configuration de l'Analyse")
    
    # Sélection du mode d'exécution
    analysis_mode = st.sidebar.radio(
        "Mode d'exécution :",
        ["Analyse unique", "Analyse combinée"]
    )

    st.sidebar.markdown("---")
    st.sidebar.header("📂 Téléversement des Fichiers")

    # Zone de dépôt pour les deux agents
    col1, col2 = st.sidebar.columns(2)
    
    with col1:
        st.subheader("Gap Analysis")
        gap_client = st.file_uploader("Exigences Client (.tex)", type=["tex"], key="gap_client")
        gap_company = st.file_uploader("Ressources Entreprise (.tex)", type=["tex"], key="gap_company")
        gap_employee = st.file_uploader("Données Employés (.csv)", type=["csv"], key="gap_employee")

    with col2:
        st.subheader("Module Match")
        match_client = st.file_uploader("Besoins Client (.pdf)", type=["pdf"], key="match_client")
        match_company = st.file_uploader("Ressources Internes (.pdf)", type=["pdf"], key="match_company")

    # --- Exécution de l'analyse ---
    if st.sidebar.button("🚀 Lancer l'analyse"):
        if analysis_mode == "Analyse unique":
            run_single_analysis(gap_agent, match_agent, gap_client, gap_company, gap_employee, 
                              match_client, match_company)
        else:
            run_combined_analysis(gap_agent, match_agent, gap_client, gap_company, gap_employee,
                                match_client, match_company)

def run_single_analysis(gap_agent, match_agent, gap_client, gap_company, gap_employee,
                       match_client, match_company):
    """Exécute un seul agent sélectionné"""
    # Détection de l'agent à exécuter basée sur les fichiers uploadés
    if gap_client and gap_company:
        agent = gap_agent
        files = {
            "client": gap_client,
            "company": gap_company,
            "employee": gap_employee
        }
    elif match_client and match_company:
        agent = match_agent
        files = {
            "client": match_client,
            "company": match_company
        }
    else:
        st.warning("Veuillez charger les fichiers pour au moins un agent")
        return

    with st.spinner(f"🧠 Analyse en cours avec {agent.name}..."):
        report, artifacts = agent.use(files)
        display_results(agent.name, report, artifacts)

def run_combined_analysis(gap_agent, match_agent, gap_client, gap_company, gap_employee,
                         match_client, match_company):
    """Exécute les deux agents en parallèle"""
    if not (gap_client and gap_company and match_client and match_company):
        st.warning("Veuillez charger tous les fichiers requis pour les deux agents")
        return

    with st.spinner("🧠 Exécution parallèle des deux agents..."):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            # Soumission des tâches
            gap_future = executor.submit(
                gap_agent.use,
                {
                    "client": gap_client,
                    "company": gap_company,
                    "employee": gap_employee
                }
            )
            
            match_future = executor.submit(
                match_agent.use,
                {
                    "client": match_client,
                    "company": match_company
                }
            )

            # Récupération des résultats
            gap_report, gap_artifacts = gap_future.result()
            match_report, match_artifacts = match_future.result()

        # Affichage des résultats
        st.success("Analyse combinée terminée!")
        
        with st.expander("🔍 Résultats Gap Analysis"):
            display_results(gap_agent.name, gap_report, gap_artifacts)
        
        with st.expander("🔍 Résultats Module Match"):
            display_results(match_agent.name, match_report, match_artifacts)
        
        # Section d'analyse croisée
        st.subheader("📊 Analyse Combinée")
        st.write("Synthèse des insights transverses...")
        # Ici vous pourriez ajouter une analyse qui combine les deux rapports

def display_results(agent_name, report, artifacts):
    """Affiche les résultats d'un agent"""
    st.subheader(f"📋 Rapport {agent_name}")
    st.markdown(report)

    if "chart" in artifacts:
        st.subheader("📊 Visualisation")
        st.pyplot(artifacts["chart"])
    
    if "pdf_download" in artifacts:
        st.subheader("📥 Téléchargement")
        pdf_data, file_name = artifacts["pdf_download"]
        st.download_button(
            label="📄 Télécharger le rapport PDF",
            data=pdf_data,
            file_name=file_name,
            mime="application/pdf"
        )

if __name__ == "__main__":
    main()'''

import streamlit as st
import concurrent.futures
from agents.gap_analysis_agent import GapAnalysisAgent
from agents.module_match_agent import ModuleMatchAgent
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from io import BytesIO
import os
from datetime import datetime
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Créer le dossier de sortie
os.makedirs("reports", exist_ok=True)

def generate_pdf(content, agent_name):
    """Génère un PDF avec pagination automatique et mise en forme avancée"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter,
                        rightMargin=72, leftMargin=72,
                        topMargin=72, bottomMargin=72)
    
    styles = getSampleStyleSheet()
    story = []
    
    # Style personnalisé
    styles['Title'].fontName = 'Helvetica-Bold'
    styles['Title'].fontSize = 16
    styles['Title'].leading = 22
    styles['Heading2'].fontName = 'Helvetica-Bold'
    styles['Heading2'].fontSize = 12
    styles['BodyText'].fontName = 'Helvetica'
    styles['BodyText'].fontSize = 10
    styles['BodyText'].leading = 12
    
    # En-tête
    story.append(Paragraph(f"Rapport d'analyse - {agent_name}", styles['Title']))
    story.append(Paragraph(f"Généré le : {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}", styles['BodyText']))
    story.append(Spacer(1, 12))
    
    # Traitement du contenu ligne par ligne
    lines = content.split('\n')
    section = None
    
    for line in lines:
        if not line.strip():
            continue
            
        if line.startswith('### '):
            # Titre de section
            story.append(Spacer(1, 12))
            story.append(Paragraph(line[4:].strip(), styles['Heading2']))
            story.append(Spacer(1, 6))
        elif line.startswith('## '):
            # Nouvelle page pour les grandes sections
            if section:
                story.append(PageBreak())
            section = line[3:].strip()
            story.append(Paragraph(section, styles['Title']))
            story.append(Spacer(1, 12))
        elif line.startswith('- '):
            # Liste à puces
            story.append(Paragraph("• " + line[2:].strip(), styles['BodyText']))
            story.append(Spacer(1, 4))
        else:
            # Texte normal
            story.append(Paragraph(line.strip(), styles['BodyText']))
            story.append(Spacer(1, 8))
    
    doc.build(story)
    buffer.seek(0)
    return buffer

def save_report(pdf_buffer, agent_name):
    """Enregistre le PDF avec un nom de fichier unique"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"reports/{agent_name.replace(' ', '_')}_{timestamp}.pdf"
    
    with open(filename, "wb") as f:
        f.write(pdf_buffer.getbuffer())
    
    return filename

def main():
    st.set_page_config(page_title="🤖 Orchestrateur d'Agents", layout="wide")
    st.title("🤖 Orchestrateur d'Agents d'Analyse")
    
    # Initialisation des agents
    gap_agent = GapAnalysisAgent()
    match_agent = ModuleMatchAgent()
    
    # Interface utilisateur
    st.sidebar.header("Configuration")
    analysis_mode = st.sidebar.radio(
        "Mode d'analyse :",
        ["Unique", "Combinée"],
        horizontal=True
    )
    
    st.sidebar.markdown("---")
    st.sidebar.header("📂 Téléversement des fichiers")
    
    # Zone de dépôt des fichiers
    with st.sidebar.expander("🔍 Gap Analysis", expanded=True):
        gap_client = st.file_uploader("Exigences Client (.tex)", type=["tex"], key="gap_client")
        gap_company = st.file_uploader("Ressources Entreprise (.tex)", type=["tex"], key="gap_company")
        gap_employee = st.file_uploader("Données Employés (.csv)", type=["csv"], key="gap_employee")
    
    with st.sidebar.expander("🔍 Module Match", expanded=True):
        match_client = st.file_uploader("Besoins Client (.pdf)", type=["pdf"], key="match_client")
        match_company = st.file_uploader("Ressources Internes (.pdf)", type=["pdf"], key="match_company")
    
    # Bouton d'exécution
    if st.sidebar.button("🚀 Exécuter l'analyse", type="primary"):
        if analysis_mode == "Unique":
            run_single_analysis(gap_agent, match_agent, gap_client, gap_company, gap_employee, 
                              match_client, match_company)
        else:
            run_combined_analysis(gap_agent, match_agent, gap_client, gap_company, gap_employee,
                                match_client, match_company)

def run_single_analysis(gap_agent, match_agent, gap_client, gap_company, gap_employee,
                       match_client, match_company):
    """Exécute un seul agent et affiche les résultats"""
    if gap_client and gap_company:
        agent = gap_agent
        files = {"client": gap_client, "company": gap_company, "employee": gap_employee}
    elif match_client and match_company:
        agent = match_agent
        files = {"client": match_client, "company": match_company}
    else:
        st.warning("Veuillez charger les fichiers requis pour au moins un agent")
        return
    
    with st.spinner(f"🔍 Analyse en cours avec {agent.name}..."):
        try:
            report, artifacts = agent.use(files)
            pdf_buffer = generate_pdf(report, agent.name)
            filename = save_report(pdf_buffer, agent.name)
            
            display_results(agent.name, report, artifacts, pdf_buffer)
            st.success(f"✅ Rapport sauvegardé sous : `{filename}`")
        except Exception as e:
            st.error(f"❌ Erreur lors de l'analyse : {str(e)}")

def run_combined_analysis(gap_agent, match_agent, gap_client, gap_company, gap_employee,
                         match_client, match_company):
    """Exécute les deux agents en parallèle"""
    if not (gap_client and gap_company and match_client and match_company):
        st.warning("Veuillez charger tous les fichiers requis pour les deux agents")
        return
    
    with st.spinner("🔍 Exécution parallèle des analyses..."):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            # Lancement des analyses
            gap_future = executor.submit(
                gap_agent.use,
                {"client": gap_client, "company": gap_company, "employee": gap_employee}
            )
            match_future = executor.submit(
                match_agent.use,
                {"client": match_client, "company": match_company}
            )
            
            # Récupération des résultats
            gap_report, gap_artifacts = gap_future.result()
            match_report, match_artifacts = match_future.result()
            
            # Génération des PDF
            gap_pdf = generate_pdf(gap_report, gap_agent.name)
            match_pdf = generate_pdf(match_report, match_agent.name)
            
            # Sauvegarde
            gap_filename = save_report(gap_pdf, gap_agent.name)
            match_filename = save_report(match_pdf, match_agent.name)
    
    # Affichage des résultats
    st.success("✅ Analyses combinées terminées !")
    col1, col2 = st.columns(2)
    
    with col1:
        with st.expander(f"📋 {gap_agent.name}", expanded=True):
            display_results(gap_agent.name, gap_report, gap_artifacts, gap_pdf)
            st.info(f"📄 Fichier : `{gap_filename}`")
    
    with col2:
        with st.expander(f"📋 {match_agent.name}", expanded=True):
            display_results(match_agent.name, match_report, match_artifacts, match_pdf)
            st.info(f"📄 Fichier : `{match_filename}`")

def display_results(agent_name, report, artifacts, pdf_buffer=None):
    """Affiche les résultats et permet le téléchargement"""
    st.markdown(report)
    
    if "chart" in artifacts:
        st.pyplot(artifacts["chart"])
    
    if pdf_buffer:
        st.download_button(
            label=f"⬇️ Télécharger le rapport {agent_name}",
            data=pdf_buffer,
            file_name=f"rapport_{agent_name.replace(' ', '_')}.pdf",
            mime="application/pdf",
            use_container_width=True
        )

if __name__ == "__main__":
    main()