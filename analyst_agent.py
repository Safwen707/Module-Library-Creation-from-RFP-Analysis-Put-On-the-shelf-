import os
import io
import re
import pandas as pd
import streamlit as st
import matplotlib.pyplot as plt
from typing import List, Any
import google.generativeai as genai

# === Configuration Gemini ===
genai.configure(api_key="AIzaSyAKd_I0UcZX7uGMNnMmVj_dGBcqfQhDXfY")
model = genai.GenerativeModel("models/gemini-2.5-flash")

# === Helper Functions ===

def extract_first_code_block(text: str) -> str:
    start = text.find("```python")
    if start == -1:
        return ""
    start += len("```python")
    end = text.find("```", start)
    if end == -1:
        return ""
    return text[start:end].strip()

# === Query Understanding Tool ===

def QueryUnderstandingTool(query: str) -> bool:
    prompt = (
        "You are an assistant that determines if a query requests a data visualization. "
        "Respond only with 'true' or 'false'.\n"
        f"{query}"
    )
    response = model.generate_content(prompt)
    answer = response.text.strip().lower()
    return answer == "true"

# === Code Generation Tools ===

def PlotCodeGeneratorTool(cols: List[str], query: str) -> str:
    return f"""
Given DataFrame `df` with columns: {', '.join(cols)}
Write Python code using pandas **and matplotlib** (as plt) to answer:
\"{query}\"

Rules:
1. Use pandas for data manipulation and matplotlib.pyplot (as plt) for plotting.
2. Assign the final result to a variable named `result`.
3. Set `figsize=(6,4)`, add title/labels.
4. Return your answer inside a ```python code block.
"""

def CodeWritingTool(cols: List[str], query: str) -> str:
    return f"""
Given DataFrame `df` with columns: {', '.join(cols)}
Write Python code (pandas only, no plotting) to answer:
\"{query}\"

Rules:
1. Use pandas operations on `df` only.
2. Assign the final result to `result`.
3. Return inside a single ```python code block.
"""

# === Code Generation Agent ===

def CodeGenerationAgent(query: str, df: pd.DataFrame):
    should_plot = QueryUnderstandingTool(query)
    prompt = PlotCodeGeneratorTool(df.columns.tolist(), query) if should_plot else CodeWritingTool(df.columns.tolist(), query)

    full_prompt = (
        "You are a Python data-analysis expert who writes clean, efficient code. "
        "Solve the problem with optimal pandas operations. "
        "Respond ONLY with a properly closed ```python code block.\n" + prompt
    )
    response = model.generate_content(full_prompt)
    code = extract_first_code_block(response.text)
    return code, should_plot, ""

# === Execution Agent ===

def ExecutionAgent(code: str, df: pd.DataFrame, should_plot: bool):
    env = {"pd": pd, "df": df}
    if should_plot:
        plt.rcParams["figure.dpi"] = 100
        env["plt"] = plt
        env["io"] = io
    try:
        exec(code, {}, env)
        return env.get("result", None)
    except Exception as exc:
        return f"Error executing code: {exc}"

# === Reasoning Curator ===

def ReasoningCurator(query: str, result: Any) -> str:
    is_error = isinstance(result, str) and result.startswith("Error")
    is_plot = isinstance(result, (plt.Figure, plt.Axes))

    if is_error:
        desc = result
    elif is_plot:
        title = result.get_title() if isinstance(result, plt.Axes) else (result._suptitle.get_text() if result._suptitle else "")
        desc = f"[Plot Object: {title or 'Chart'}]"
    else:
        desc = str(result)[:300]

    if is_plot:
        prompt = f"The user asked: \"{query}\".\nPlot description:\n{desc}\nExplain in 2–3 concise sentences what the chart shows."
    else:
        prompt = f"The user asked: \"{query}\".\nResult: {desc}\nExplain in 2–3 concise sentences what this tells about the data."
    return prompt

# === Reasoning Agent ===

def ReasoningAgent(query: str, result: Any):
    prompt = ReasoningCurator(query, result)
    response = model.generate_content(prompt)
    explanation = response.text.strip()
    return "", explanation  # thinking content is unused

# === Data Insight Agent ===

def DataFrameSummaryTool(df: pd.DataFrame) -> str:
    prompt = f"""
Given a dataset with {len(df)} rows and {len(df.columns)} columns:
Columns: {', '.join(df.columns)}
Data types: {df.dtypes.to_dict()}
Missing values: {df.isnull().sum().to_dict()}

Provide:
1. A brief description of the dataset
2. 3–4 possible analysis questions
"""
    return prompt

def DataInsightAgent(df: pd.DataFrame) -> str:
    prompt = DataFrameSummaryTool(df)
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as exc:
        return f"Error generating dataset insights: {exc}"

# === Main Streamlit App ===

def main():
    st.set_page_config(layout="wide")
    st.title("Data Analysis Agent - Powered by Gemini")

    if "plots" not in st.session_state:
        st.session_state.plots = []

    left_col, right_col = st.columns([3, 7])

    with left_col:
        st.header("Upload Dataset")
        file = st.file_uploader("Upload a CSV file", type=["csv"])

        if file:
            if ("df" not in st.session_state) or (st.session_state.get("current_file") != file.name):
                st.session_state.df = pd.read_csv(file)
                st.session_state.current_file = file.name
                st.session_state.messages = []
                with st.spinner("Generating dataset insights..."):
                    st.session_state.insights = DataInsightAgent(st.session_state.df)

            st.dataframe(st.session_state.df.head())
            st.markdown("### Dataset Insights")
            st.markdown(st.session_state.insights)
        else:
            st.info("Please upload a CSV file to start.")

    with right_col:
        st.header("Chat with your data")

        if "messages" not in st.session_state:
            st.session_state.messages = []

        chat_container = st.container()
        with chat_container:
            for msg in st.session_state.messages:
                with st.chat_message(msg["role"]):
                    st.markdown(msg["content"], unsafe_allow_html=True)
                    if msg.get("plot_index") is not None:
                        idx = msg["plot_index"]
                        if 0 <= idx < len(st.session_state.plots):
                            st.pyplot(st.session_state.plots[idx], use_container_width=False)

        if file:
            user_input = st.chat_input("Ask about your data…")
            if user_input:
                st.session_state.messages.append({"role": "user", "content": user_input})
                with st.spinner("Processing..."):
                    code, should_plot, _ = CodeGenerationAgent(user_input, st.session_state.df)
                    result = ExecutionAgent(code, st.session_state.df, should_plot)
                    _, explanation = ReasoningAgent(user_input, result)
                    explanation = explanation.replace("`", "")

                is_plot = isinstance(result, (plt.Figure, plt.Axes))
                plot_index = None
                if is_plot:
                    fig = result.figure if isinstance(result, plt.Axes) else result
                    st.session_state.plots.append(fig)
                    plot_index = len(st.session_state.plots) - 1
                    header_text = "Here is the visualization you requested:"
                elif isinstance(result, (pd.DataFrame, pd.Series)):
                    header_text = f"Result: {len(result)} rows" if isinstance(result, pd.DataFrame) else "Result series"
                else:
                    header_text = f"Result: {result}"

                code_html = (
                    '<details><summary>View generated code</summary>'
                    f'<pre><code class="language-python">{code}</code></pre>'
                    '</details>'
                )

                assistant_content = f"**{header_text}**\n\n{explanation}\n\n{code_html}"

                st.session_state.messages.append({
                    "role": "assistant",
                    "content": assistant_content,
                    "plot_index": plot_index
                })
                st.rerun()

if __name__ == "__main__":
    main()
