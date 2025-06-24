# Resume Parser using Azure Form Recognizer

This project uses Azure Form Recognizer to extract information from resume PDFs.

## Setup

1. **Install Dependencies**
   ```bash
   conda install azure-ai-formrecognizer python-dotenv
   ```

2. **Azure Form Recognizer Setup**
   - Create an Azure Form Recognizer resource in the Azure portal
   - Note down the endpoint URL and key
   - Make sure to choose a region that supports the models you need

3. **Environment Variables**
   - Copy `env_template.txt` to `.env`
   - Update the `.env` file with your actual Azure Form Recognizer endpoint and key:
   ```
   AZURE_FORM_RECOGNIZER_ENDPOINT=https://your-resource-name.cognitiveservices.azure.com/
   AZURE_FORM_RECOGNIZER_KEY=your-form-recognizer-key-here
   ```

4. **Place your resume**
   - Put your resume PDF file in the project directory
   - Name it `your_resume.pdf` or update the filename in `main.py`

## Running the Program

```bash
python main.py
```

## Troubleshooting

### "Model not found" Error

If you get a "ModelNotFound" error, this usually means:

1. **Wrong model name**: The original code used "prebuilt-resume" which may not be available. The updated code uses "prebuilt-document" which is more widely available.

2. **Region restrictions**: Some models are only available in specific Azure regions. Common regions that support most models:
   - East US
   - West US 2
   - West Europe
   - Southeast Asia

3. **Service tier**: Make sure you're using a service tier that supports the model you want to use.

### Available Models

The program will automatically try to list available models if there's an error. Common model names include:
- `prebuilt-document` (general document analysis)
- `prebuilt-layout` (layout analysis)
- `prebuilt-read` (text extraction)

### Authentication Errors

If you get authentication errors:
1. Check that your endpoint URL is correct and ends with a forward slash
2. Verify your key is correct
3. Make sure your Azure Form Recognizer resource is active

## Output

The program will extract and display:
- Document fields and their confidence scores
- Key-value pairs found in the document
- Tables and their content
- General text content

## Notes

- The "prebuilt-resume" model mentioned in the original code may not be available in all regions or service tiers
- The updated code uses "prebuilt-document" which provides general document analysis capabilities
- For more specific resume parsing, you might need to use custom models or different approaches 