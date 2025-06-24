# Resume Parser API

A Next.js application that uses Azure Form Recognizer to extract structured information from resume PDFs and Word documents.

## Features

- 📄 **Document Support**: Upload PDF, DOC, or DOCX files
- 🎯 **Smart Extraction**: Extracts contact info, skills, experience, and education
- 📊 **Table Detection**: Identifies and parses tables in resumes
- 🔗 **Key-Value Pairs**: Extracts form fields and structured data
- 🎨 **Modern UI**: Clean, responsive interface with drag-and-drop upload
- ⚡ **Real-time Processing**: Instant feedback and results display

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI/ML**: Azure Form Recognizer
- **File Processing**: PDF and Word document parsing

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Azure Form Recognizer Setup

1. Create an Azure Form Recognizer resource in the Azure portal
2. Note down the endpoint URL and key
3. Make sure to choose a region that supports the models you need

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
AZURE_FORM_RECOGNIZER_ENDPOINT=https://your-resource-name.cognitiveservices.azure.com/
AZURE_FORM_RECOGNIZER_KEY=your-form-recognizer-key-here
```

**Important Notes:**
- The endpoint should end with a forward slash (/)
- Use the primary or secondary key from your Azure Form Recognizer resource
- Choose a region that supports the `prebuilt-document` model

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. **Upload Resume**: Drag and drop or click to upload your resume file (PDF, DOC, or DOCX)
2. **Processing**: The app will analyze your document using Azure Form Recognizer
3. **View Results**: See extracted information organized into sections:
   - Contact Information (emails, phones, LinkedIn, GitHub, website)
   - Skills & Technologies (categorized by type)
   - Experience & Education
   - Key-Value Pairs
   - Tables
   - Full Text Content

## API Endpoints

### POST `/api/parse-resume`

Upload and parse a resume file.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `file` field containing the resume

**Supported Formats:**
- PDF (.pdf)
- Word Document (.doc)
- Word Document (.docx)

**Response:**
```json
{
  "fileName": "resume.pdf",
  "contactInfo": {
    "emails": ["john@example.com"],
    "phones": ["+1234567890"],
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe",
    "website": "johndoe.com"
  },
  "skills": [
    {
      "category": "languages",
      "skills": ["python", "javascript"]
    }
  ],
  "experience": [
    {
      "type": "work",
      "content": "Work experience section..."
    }
  ],
  "keyValuePairs": [...],
  "tables": [...],
  "fullText": "Complete extracted text...",
  "confidence": 0.95,
  "pages": 2
}
```

### GET `/api/parse-resume`

Health check endpoint.

**Response:**
```json
{
  "message": "Resume Parser API is running"
}
```

## Project Structure

```
resumer-app/
├── app/
│   ├── api/parse-resume/
│   │   └── route.ts          # API endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Main page
├── components/
│   ├── FileUpload.tsx        # File upload component
│   └── ResumeResults.tsx     # Results display component
├── lib/
│   ├── azure-client.ts       # Azure Form Recognizer client
│   ├── resume-parser.ts      # Main parsing logic
│   └── types.ts              # TypeScript types
├── utils/
│   └── regex-patterns.ts     # Text extraction patterns
└── package.json
```

## Troubleshooting

### "Model not found" Error

If you get a model not found error:

1. **Check Region**: Ensure your Azure Form Recognizer resource is in a supported region
2. **Service Tier**: Make sure you're using a tier that supports the `prebuilt-document` model
3. **Model Availability**: The app uses `prebuilt-document` which is widely available

### Authentication Errors

1. Check that your endpoint URL is correct and ends with a forward slash
2. Verify your key is correct
3. Ensure your Azure Form Recognizer resource is active

### File Upload Issues

1. Ensure the file is a supported format (PDF, DOC, DOCX)
2. Check file size (Azure has limits)
3. Verify the file isn't corrupted

## Development

### Adding New Skills

Edit `utils/regex-patterns.ts` to add new skill categories or keywords:

```typescript
const skillsKeywords = {
  languages: ['python', 'java', 'javascript', /* add more */],
  frameworks: ['react', 'angular', /* add more */],
  // Add new categories here
};
```

### Customizing Extraction

Modify the regex patterns in `utils/regex-patterns.ts` to improve extraction accuracy for your specific use case.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## License

MIT License - feel free to use this project for your own resume parsing needs!
