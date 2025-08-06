import os
import markdown
from xhtml2pdf import pisa
import logging
import re

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class ConverterMarkdownToPDF:
    """
    A comprehensive Markdown to PDF converter with advanced formatting and content manipulation capabilities.
    """

    def __init__(self, remove_pricing_schedule: bool = True):
        """
        Initialize the converter.

        Args:
            remove_pricing_schedule (bool): Whether to automatically remove pricing schedule sections
        """
        self.remove_pricing_schedule = remove_pricing_schedule
        self.logger = logging.getLogger(self.__class__.__name__)

    def _remove_pricing_schedule_section(self, md_content: str) -> str:
        """
        Remove the pricing schedule subsection and adjust numbering.

        Args:
            md_content (str): The original Markdown content

        Returns:
            str: Modified Markdown content with pricing schedule removed
        """

        # Pattern to match the pricing schedule section
        # This will match from "#### 3.3 Pricing Schedule" to the next "#### 3.4" section
        pricing_schedule_pattern = r'#### 3\.3 Pricing Schedule.*?(?=#### 3\.4|\n---|\Z)'

        # Remove the pricing schedule section
        md_content = re.sub(pricing_schedule_pattern, '', md_content, flags=re.DOTALL)

        # Renumber 3.4 to 3.3 (Assumptions section)
        md_content = re.sub(r'#### 3\.4 Assumptions', '#### 3.3 Assumptions', md_content)

        # Clean up any extra whitespace that might be left
        md_content = re.sub(r'\n\n\n+', '\n\n', md_content)

        self.logger.info("Removed pricing schedule subsection and adjusted numbering")
        return md_content

    def _get_html_template(self, html_content: str) -> str:
        """
        Generate the complete HTML template with styling.

        Args:
            html_content (str): The converted HTML content from Markdown

        Returns:
            str: Complete HTML document with styling
        """
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Document</title>
            <style>
                @page {{
                    size: A4;
                    margin: 2.5cm 2cm;
                    @frame header {{
                        -pdf-frame-content: header_content;
                        left: 2cm; width: 17cm; top: 1cm; height: 1cm;
                    }}
                    @frame footer {{
                        -pdf-frame-content: footer_content;
                        left: 2cm; width: 17cm; top: 28cm; height: 1cm;
                    }}
                }}

                body {{
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
                    line-height: 1.6;
                    color: #2c3e50;
                    font-size: 11pt;
                    margin: 0;
                    padding: 0;
                }}

                /* Respect Markdown heading hierarchy */
                h1 {{
                    font-size: 24pt;
                    font-weight: 700;
                    color: #1a202c;
                    margin: 30pt 0 20pt 0;
                    padding-bottom: 10pt;
                    border-bottom: 3pt solid #4a90e2;
                    page-break-after: avoid;
                }}

                h2 {{
                    font-size: 20pt;
                    font-weight: 600;
                    color: #2d3748;
                    margin: 25pt 0 15pt 0;
                    padding-bottom: 5pt;
                    border-bottom: 1pt solid #cbd5e0;
                    page-break-after: avoid;
                }}

                h3 {{
                    font-size: 16pt;
                    font-weight: 600;
                    color: #4a5568;
                    margin: 20pt 0 12pt 0;
                    page-break-after: avoid;
                }}

                h4 {{
                    font-size: 14pt;
                    font-weight: 500;
                    color: #718096;
                    margin: 16pt 0 10pt 0;
                    page-break-after: avoid;
                }}

                h5 {{
                    font-size: 13pt;
                    font-weight: 500;
                    color: #a0aec0;
                    margin: 14pt 0 8pt 0;
                }}

                h6 {{
                    font-size: 12pt;
                    font-weight: 500;
                    color: #cbd5e0;
                    margin: 12pt 0 6pt 0;
                }}

                /* Preserve paragraph spacing from Markdown */
                p {{
                    margin: 0 0 12pt 0;
                    text-align: left;
                    orphans: 2;
                    widows: 2;
                }}

                /* Respect list structure */
                ul, ol {{
                    margin: 12pt 0;
                    padding-left: 25pt;
                }}

                li {{
                    margin: 4pt 0;
                    line-height: 1.5;
                }}

                /* Nested lists */
                ul ul, ol ol, ul ol, ol ul {{
                    margin: 6pt 0;
                }}

                /* Tables maintain Markdown simplicity */
                table {{
                    width: 100%;
                    border-collapse: collapse;
                    margin: 16pt 0;
                    font-size: 10pt;
                }}

                th {{
                    background-color: #f7fafc;
                    font-weight: 600;
                    padding: 10pt 8pt;
                    border: 1pt solid #e2e8f0;
                    text-align: left;
                }}

                td {{
                    padding: 8pt;
                    border: 1pt solid #e2e8f0;
                    vertical-align: top;
                }}

                /* Alternate row colors for readability */
                tbody tr:nth-child(even) {{
                    background-color: #f8fafc;
                }}

                /* Code blocks preserve formatting */
                code {{
                    background-color: #f1f5f9;
                    color: #be185d;
                    padding: 2pt 4pt;
                    border-radius: 2pt;
                    font-family: "SF Mono", "Monaco", "Consolas", monospace;
                    font-size: 10pt;
                }}

                pre {{
                    background-color: #f8fafc;
                    border: 1pt solid #e2e8f0;
                    border-left: 3pt solid #4a90e2;
                    padding: 12pt;
                    margin: 16pt 0;
                    overflow-x: auto;
                    page-break-inside: avoid;
                }}

                pre code {{
                    background: transparent;
                    color: #1e293b;
                    padding: 0;
                    font-size: 9pt;
                }}

                /* Blockquotes preserve Markdown emphasis */
                blockquote {{
                    border-left: 4pt solid #4a90e2;
                    margin: 16pt 0 16pt 20pt;
                    padding: 8pt 16pt;
                    background-color: #f8fafc;
                    font-style: italic;
                    color: #64748b;
                }}

                /* Horizontal rules */
                hr {{
                    border: none;
                    border-top: 2pt solid #e2e8f0;
                    margin: 24pt 0;
                }}

                /* Links */
                a {{
                    color: #4a90e2;
                    text-decoration: underline;
                }}

                /* Strong and emphasis */
                strong, b {{
                    font-weight: 600;
                    color: #1e293b;
                }}

                em, i {{
                    font-style: italic;
                    color: #475569;
                }}

                /* Preserve line breaks from Markdown */
                br {{
                    line-height: 1.8;
                }}

                /* Definition lists */
                dl {{
                    margin: 12pt 0;
                }}

                dt {{
                    font-weight: 600;
                    margin-top: 8pt;
                }}

                dd {{
                    margin: 4pt 0 4pt 20pt;
                }}

                /* Footnotes */
                .footnote {{
                    font-size: 9pt;
                    color: #64748b;
                }}

                /* Table of contents */
                .toc {{
                    background-color: #f8fafc;
                    border: 1pt solid #e2e8f0;
                    padding: 16pt;
                    margin: 20pt 0;
                }}

                .toc ul {{
                    list-style-type: none;
                    padding-left: 0;
                }}

                .toc li {{
                    margin: 4pt 0;
                }}

                .toc a {{
                    text-decoration: none;
                }}
            </style>
        </head>
        <body>
            <div id="header_content" style="text-align: center; font-size: 9pt; color: #64748b; border-bottom: 1pt solid #e2e8f0; padding-bottom: 5pt;">
                TechExcellence Solutions - RFP Response
            </div>

            <div id="footer_content" style="text-align: center; font-size: 9pt; color: #64748b;">
                Page <pdf:pagenumber> of <pdf:pagecount>
            </div>

            <div class="document-content">
                {html_content}
            </div>
        </body>
        </html>
        """

    def convert(self, input_file: str, output_file: str = None) -> str:
        """
        Convert Markdown file to PDF preserving original structure and layout.

        Args:
            input_file (str): Path to the input Markdown file
            output_file (str, optional): Path for the output PDF file.
                                       If None, uses input filename with .pdf extension

        Returns:
            str: Path to the generated PDF file

        Raises:
            FileNotFoundError: If the input file doesn't exist
            Exception: If PDF generation fails
        """
        if not os.path.exists(input_file):
            raise FileNotFoundError(f"Markdown file not found: {input_file}")

        if output_file is None:
            output_file = os.path.splitext(input_file)[0] + '.pdf'

        self.logger.info(f"Converting {input_file} to {output_file}")

        try:
            # Read Markdown content
            with open(input_file, 'r', encoding='utf-8') as f:
                md_content = f.read()

            # Apply content modifications if enabled
            if self.remove_pricing_schedule:
                md_content = self._remove_pricing_schedule_section(md_content)

            # Convert Markdown to HTML with extensions that preserve structure
            html_content = markdown.markdown(
                md_content,
                extensions=[
                    'tables',
                    'fenced_code',
                    'codehilite',
                    'nl2br',  # Preserves line breaks
                    'attr_list',  # Allows custom attributes
                    'def_list',  # Definition lists
                    'footnotes',  # Footnotes support
                    'toc'  # Table of contents
                ]
            )

            # Generate complete HTML document
            full_html = self._get_html_template(html_content)

            # Convert HTML to PDF
            with open(output_file, "w+b") as result_file:
                pisa_status = pisa.CreatePDF(
                    full_html,
                    dest=result_file,
                    encoding='utf-8'
                )

            if pisa_status.err:
                raise Exception(f"PDF generation failed with {pisa_status.err} errors")

            self.logger.info(f"PDF successfully created: {output_file}")
            return output_file

        except Exception as e:
            self.logger.error(f"Error converting markdown to PDF: {e}")
            raise

    def get_file_info(self, file_path: str) -> dict:
        """
        Get information about a file.

        Args:
            file_path (str): Path to the file

        Returns:
            dict: File information including size and existence
        """
        if not os.path.exists(file_path):
            return {"exists": False, "size_kb": 0}

        size_kb = os.path.getsize(file_path) / 1024
        return {
            "exists": True,
            "size_kb": round(size_kb, 1),
            "path": os.path.abspath(file_path)
        }


def main():
    """Main function to run the conversion"""
    print("🚀 Markdown to PDF Converter - Structure Preserving")
    print("=" * 55)
    print("📋 Install with: pip install xhtml2pdf markdown")
    print("=" * 55)

    # modify this file input path accordingly
    md_file = "RFP_Response_20250805_1614.md"

    try:
        # Create converter instance
        converter = ConverterMarkdownToPDF(remove_pricing_schedule=True)

        # Convert the file
        output_file = converter.convert(md_file)

        # Get file information
        file_info = converter.get_file_info(output_file)

        print(f"✅ PDF created: {output_file}")
        print(f"📊 File size: {file_info['size_kb']} KB")
        print(f"📁 Full path: {file_info['path']}")

    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    main()