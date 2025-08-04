import streamlit as st
import pandas as pd
import google.generativeai as genai
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import io

# ========== GEMINI CONFIG ==========
genai.configure(api_key="AIzaSyAKd_I0UcZX7uGMNnMmVj_dGBcqfQhDXfY")  # Replace with your key

# ========== APP UI ==========
st.set_page_config(page_title="Gap Analysis Agent", layout="centered")
st.title("📊 Gap Analysis Agent (Gemini 1.5 Flash)")
st.markdown("Upload the three required files to generate a full gap analysis report.")

# ========== FILE UPLOAD ==========
client_tex = st.file_uploader("📄 Upload Client Requirements (.tex)", type="tex")
company_tex = st.file_uploader("📄 Upload Company Resources (.tex)", type="tex")
employee_csv = st.file_uploader("📋 Upload Employee Dataset (.csv)", type="csv")

# ========== FUNCTION TO READ FILE CONTENT ==========
def read_file_text(uploaded_file):
    return uploaded_file.read().decode("utf-8")

def read_csv_preview(uploaded_file, max_rows=10):
    df = pd.read_csv(uploaded_file)
    return df.head(max_rows).to_string(index=False)

# ========== FUNCTION TO CREATE PDF ==========
def create_pdf_report(report_text):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Add title
    story.append(Paragraph("Gap Analysis Report", styles['Title']))
    story.append(Spacer(1, 12))
    
    # Add report content, splitting by lines and formatting as paragraphs
    for line in report_text.split('\n'):
        story.append(Paragraph(line, styles['Normal']))
        story.append(Spacer(1, 6))
    
    doc.build(story)
    buffer.seek(0)
    return buffer

# ========== RUN BUTTON ==========
if st.button("🔍 Run Gap Analysis"):
    if not (client_tex and company_tex and employee_csv):
        st.error("Please upload all three files before running the analysis.")
    else:
        # Read inputs
        client_content = read_file_text(client_tex)
        company_content = read_file_text(company_tex)
        employee_preview = read_csv_preview(employee_csv)

        # Build prompt
        prompt = f"""
You are a professional gap analysis agent.

Your job is to compare the following three sources and generate a detailed report.

1. ✅ List client requirements that are fully covered (match).
2. ❌ Identify client requirements that are NOT covered by company capabilities (gaps).
3. 💡 Suggest specific employees (from the resume dataset) who can help close the gap, if applicable.
4. 📌 Offer concrete recommendations to fill remaining gaps.

--- CLIENT REQUIREMENTS (.tex) ---
{client_content}

--- COMPANY RESOURCES (.tex) ---
{company_content}

--- EMPLOYEE DATASET PREVIEW (.csv, first 10 rows) ---
{employee_preview}

📝 Format your output as a structured report with bullet points.
"""

        # Call Gemini
        model = genai.GenerativeModel("models/gemini-1.5-flash-latest")
        with st.spinner("Analyzing... please wait"):
            response = model.generate_content(prompt)
            report = response.text

        # Show report
        st.success("✅ Gap Analysis Completed!")
        st.subheader("📄 Generated Report")
        st.text_area("Result:", value=report, height=400)

        # Generate PDF and provide download option
        pdf_buffer = create_pdf_report(report)
        st.download_button(
            label="📥 Download Report as PDF",
            data=pdf_buffer,
            file_name="gap_analysis_report.pdf",
            mime="application/pdf"
        )