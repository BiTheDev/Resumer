import os
from dotenv import load_dotenv
from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.exceptions import ResourceNotFoundError, ClientAuthenticationError
import re

# Load environment variables
load_dotenv()

endpoint = os.getenv("AZURE_FORM_RECOGNIZER_ENDPOINT")
key = os.getenv("AZURE_FORM_RECOGNIZER_KEY")

# Debug: Print endpoint (without key for security)
print(f"Using endpoint: {endpoint}")
print(f"Key is configured: {'Yes' if key else 'No'}")

if not endpoint or not key:
    print("Error: Missing AZURE_FORM_RECOGNIZER_ENDPOINT or AZURE_FORM_RECOGNIZER_KEY in .env file")
    exit(1)

client = DocumentAnalysisClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(key)
)

# Sample file to parse
try:
    with open("your_resume.pdf", "rb") as f:
        # Try the correct model name for resume parsing
        # The model name should be "prebuilt-document" for general document analysis
        # or you can use specific prebuilt models available in your region
        print("Starting document analysis...")
        
        # First, let's try with the general document model
        poller = client.begin_analyze_document("prebuilt-document", f)
        result = poller.result()
        
        print("Document analysis completed successfully!")
        
        # Print all available fields
        for doc in result.documents:
            print("\n" + "="*60)
            print("📄 DOCUMENT FIELDS")
            print("="*60)
            for field_name, field in doc.fields.items():
                if field:
                    print(f"  • {field_name}: {field.value} (Confidence: {field.confidence:.2f})")
        
        # Also print key-value pairs and tables if available
        if result.key_value_pairs:
            print("\n" + "="*60)
            print("🔗 KEY-VALUE PAIRS")
            print("="*60)
            for kv_pair in result.key_value_pairs:
                if kv_pair.key and kv_pair.value:
                    print(f"  • {kv_pair.key.content}: {kv_pair.value.content}")
        
        if result.tables:
            print("\n" + "="*60)
            print("📊 TABLES DETECTED")
            print("="*60)
            for i, table in enumerate(result.tables, 1):
                print(f"\n  Table {i} ({table.row_count} rows × {table.column_count} columns):")
                print("  " + "-" * 50)
                # Access cells through the table's cell collection
                for cell in table.cells:
                    print(f"    Row {cell.row_index}, Col {cell.column_index}: {cell.content}")
        
        # Extract and display resume-specific information
        print("\n" + "="*60)
        print("📋 RESUME INFORMATION EXTRACTION")
        print("="*60)
        
        # Collect all text content for analysis
        all_text = ""
        for page in result.pages:
            for line in page.lines:
                all_text += line.content + " "
        
        # Extract contact information using regex patterns
        print("\n📞 CONTACT INFORMATION")
        print("-" * 40)
        
        contact_found = False
        
        # Email pattern
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, all_text)
        for email in emails:
            print(f"  📧 Email: {email}")
            contact_found = True
        
        # Phone pattern (various formats)
        phone_pattern = r'(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
        phones = re.findall(phone_pattern, all_text)
        for phone in phones:
            if phone[0] or phone[1]:  # Check if we have a valid phone number
                phone_str = ''.join(phone)
                print(f"  📱 Phone: {phone_str}")
                contact_found = True
        
        # LinkedIn pattern
        linkedin_pattern = r'(?:linkedin\.com|linkedin\.com/in/)[^\s]+'
        linkedin_urls = re.findall(linkedin_pattern, all_text, re.IGNORECASE)
        for linkedin in linkedin_urls:
            print(f"  💼 LinkedIn: {linkedin}")
            contact_found = True
        
        # GitHub pattern
        github_pattern = r'(?:github\.com/)[^\s]+'
        github_urls = re.findall(github_pattern, all_text, re.IGNORECASE)
        for github in github_urls:
            print(f"  🐙 GitHub: {github}")
            contact_found = True
        
        # Website/Portfolio pattern
        website_pattern = r'(?:https?://)?(?:www\.)?[a-zA-Z0-9-]+\.(?:com|org|net|io|co|me)[^\s]*'
        websites = re.findall(website_pattern, all_text)
        for website in websites:
            if 'linkedin.com' not in website.lower() and 'github.com' not in website.lower():
                print(f"  🌐 Website: {website}")
                contact_found = True
        
        if not contact_found:
            print("  ⚠️  No contact information detected")
        
        # Extract skills and experience
        print("\n💻 SKILLS AND TECHNOLOGIES")
        print("-" * 40)
        
        # Common programming languages and technologies
        skills_keywords = [
            'python', 'java', 'javascript', 'typescript', 'react', 'angular', 'vue', 'node.js', 'express',
            'django', 'flask', 'spring', 'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'docker',
            'kubernetes', 'aws', 'azure', 'gcp', 'git', 'github', 'html', 'css', 'bootstrap', 'tailwind',
            'machine learning', 'ai', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
            'c++', 'c#', '.net', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala'
        ]
        
        found_skills = []
        for skill in skills_keywords:
            if skill.lower() in all_text.lower():
                found_skills.append(skill)
        
        if found_skills:
            # Group skills by category for better organization
            languages = [s for s in found_skills if s.lower() in ['python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala']]
            frameworks = [s for s in found_skills if s.lower() in ['react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', '.net']]
            databases = [s for s in found_skills if s.lower() in ['sql', 'mysql', 'postgresql', 'mongodb', 'redis']]
            tools = [s for s in found_skills if s.lower() in ['git', 'github', 'docker', 'kubernetes']]
            cloud = [s for s in found_skills if s.lower() in ['aws', 'azure', 'gcp']]
            ml_ai = [s for s in found_skills if s.lower() in ['machine learning', 'ai', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy']]
            web = [s for s in found_skills if s.lower() in ['html', 'css', 'bootstrap', 'tailwind']]
            
            if languages:
                print(f"  🔤 Languages: {', '.join(languages)}")
            if frameworks:
                print(f"  🏗️  Frameworks: {', '.join(frameworks)}")
            if databases:
                print(f"  🗄️  Databases: {', '.join(databases)}")
            if tools:
                print(f"  🛠️  Tools: {', '.join(tools)}")
            if cloud:
                print(f"  ☁️  Cloud: {', '.join(cloud)}")
            if ml_ai:
                print(f"  🤖 ML/AI: {', '.join(ml_ai)}")
            if web:
                print(f"  🌐 Web: {', '.join(web)}")
        else:
            print("  ⚠️  No specific technical skills detected")
        
        print("\n💼 EXPERIENCE AND EDUCATION")
        print("-" * 40)
        
        # Look for experience indicators
        experience_indicators = ['experience', 'work history', 'employment', 'job', 'position', 'role']
        experience_found = False
        for indicator in experience_indicators:
            if indicator.lower() in all_text.lower():
                # Find the section around this keyword
                start_idx = all_text.lower().find(indicator.lower())
                if start_idx != -1:
                    section_start = max(0, start_idx - 100)
                    section_end = min(len(all_text), start_idx + 200)
                    section = all_text[section_start:section_end]
                    print(f"  🏢 Experience section (around '{indicator}'):")
                    print(f"     {section.strip()}")
                    experience_found = True
                    break
        
        if not experience_found:
            print("  ⚠️  No experience section clearly identified")
        
        # Look for education indicators
        education_indicators = ['education', 'degree', 'university', 'college', 'bachelor', 'master', 'phd']
        education_found = False
        for indicator in education_indicators:
            if indicator.lower() in all_text.lower():
                start_idx = all_text.lower().find(indicator.lower())
                if start_idx != -1:
                    section_start = max(0, start_idx - 100)
                    section_end = min(len(all_text), start_idx + 200)
                    section = all_text[section_start:section_end]
                    print(f"  🎓 Education section (around '{indicator}'):")
                    print(f"     {section.strip()}")
                    education_found = True
                    break
        
        if not education_found:
            print("  ⚠️  No education section clearly identified")
        
        # Display all text content for comprehensive analysis
        print("\n" + "="*60)
        print("📝 FULL TEXT CONTENT")
        print("="*60)
        for page in result.pages:
            print(f"\n📄 Page {page.page_number}:")
            print("-" * 40)
            for line in page.lines:
                print(f"  {line.content}")
            print()

except ResourceNotFoundError as e:
    print(f"Error: Model not found. This could be due to:")
    print("1. The model name is incorrect")
    print("2. The model is not available in your Azure region")
    print("3. Your service tier doesn't support this model")
    print(f"\nError details: {e}")
    
    # Let's try to list available models
    print("\nTrying to list available models...")
    try:
        models = client.list_document_models()
        print("Available models:")
        for model in models:
            print(f"- {model.model_id}")
    except Exception as list_error:
        print(f"Could not list models: {list_error}")

except ClientAuthenticationError as e:
    print(f"Authentication error: {e}")
    print("Please check your endpoint and key in the .env file")

except FileNotFoundError:
    print("Error: your_resume.pdf file not found in the current directory")

except Exception as e:
    print(f"Unexpected error: {e}")
