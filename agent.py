import google.generativeai as genai
import pandas as pd

# ========== CONFIGURATION ==========
genai.configure(api_key="AIzaSyAKd_I0UcZX7uGMNnMmVj_dGBcqfQhDXfY")  # Replace with your actual key

client_tex_path = "C:\\Users\\Iyed Zarrougui\\OneDrive\\Desktop\\Gap Analysis Agent\\hi.tex"
company_tex_path = "C:\\Users\\Iyed Zarrougui\\OneDrive\\Desktop\\Gap Analysis Agent\\main.tex"
employee_csv_path = "C:\\Users\\Iyed Zarrougui\\OneDrive\\Desktop\\Gap Analysis Agent\\UpdatedResumeDataSet.csv"

# ========== FUNCTION TO READ .TEX FILE ==========
def read_tex_file(path):
    with open(path, "r", encoding="utf-8") as file:
        return file.read()

# ========== FUNCTION TO READ CSV ==========
def read_csv_preview(path, max_rows=10):
    df = pd.read_csv(path)
    return df.head(max_rows).to_string(index=False)

# ========== READ THE INPUTS ==========
client_content = read_tex_file(client_tex_path)
company_content = read_tex_file(company_tex_path)
employee_preview = read_csv_preview(employee_csv_path)

# ========== BUILD THE PROMPT ==========
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

# ========== CALL GEMINI FLASH 2.5 ==========
model = genai.GenerativeModel("models/gemini-1.5-flash-latest")
response = model.generate_content(prompt)

# ========== DISPLAY & SAVE RESULT ==========
report = response.text
print("===== GAP ANALYSIS REPORT =====\n")
print(report)

with open("gap_analysis_report.txt", "w", encoding="utf-8") as f:
    f.write(report)
