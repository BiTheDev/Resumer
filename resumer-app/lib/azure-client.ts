import { DocumentAnalysisClient, AzureKeyCredential } from '@azure/ai-form-recognizer';

const endpoint = process.env.AZURE_FORM_RECOGNIZER_ENDPOINT!;
const key = process.env.AZURE_FORM_RECOGNIZER_KEY!;

if (!endpoint || !key) {
  throw new Error('Missing Azure Form Recognizer credentials. Please check your .env.local file.');
}

export const client = new DocumentAnalysisClient(
  endpoint,
  new AzureKeyCredential(key)
); 