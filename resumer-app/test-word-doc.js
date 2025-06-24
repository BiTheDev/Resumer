const fs = require('fs');
const { DocumentAnalysisClient, AzureKeyCredential } = require('@azure/ai-form-recognizer');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const endpoint = process.env.AZURE_FORM_RECOGNIZER_ENDPOINT;
const key = process.env.AZURE_FORM_RECOGNIZER_KEY;

if (!endpoint || !key) {
  console.error('Missing Azure Form Recognizer credentials in .env.local');
  process.exit(1);
}

const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

async function testWordDocument(filePath) {
  try {
    console.log(`Testing Word document: ${filePath}`);
    console.log('='.repeat(50));
    
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    console.log(`File size: ${fileBuffer.length} bytes`);
    
    // Check file signature
    const fileSignature = fileBuffer.slice(0, 4).toString('hex').toUpperCase();
    console.log(`File signature: ${fileSignature}`);
    
    const fileName = filePath.split('/').pop() || filePath.split('\\').pop();
    console.log(`File name: ${fileName}`);
    
    // Try different models
    const models = ["prebuilt-document", "prebuilt-read"];
    
    for (const model of models) {
      try {
        console.log(`\nTrying model: ${model}`);
        const poller = await client.beginAnalyzeDocument(model, fileBuffer);
        const result = await poller.pollUntilDone();
        
        console.log(`✅ Success with ${model}!`);
        console.log(`Pages: ${result.pages?.length || 0}`);
        console.log(`Key-value pairs: ${result.keyValuePairs?.length || 0}`);
        console.log(`Tables: ${result.tables?.length || 0}`);
        
        // Show some extracted text
        if (result.pages && result.pages.length > 0) {
          let sampleText = "";
          for (const page of result.pages.slice(0, 1)) { // First page only
            if (page.lines) {
              for (const line of page.lines.slice(0, 5)) { // First 5 lines
                sampleText += line.content + " ";
              }
            }
          }
          console.log(`Sample text: ${sampleText.substring(0, 200)}...`);
        }
        
        return true; // Success
      } catch (error) {
        console.log(`❌ Failed with ${model}: ${error.message}`);
        if (error.details?.error?.innererror?.message) {
          console.log(`   Inner error: ${error.details.error.innererror.message}`);
        }
      }
    }
    
    console.log('\n❌ All models failed');
    return false;
    
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
}

// Usage: node test-word-doc.js <path-to-word-file>
const filePath = process.argv[2];
if (!filePath) {
  console.log('Usage: node test-word-doc.js <path-to-word-file>');
  console.log('Example: node test-word-doc.js ./test_file.docx');
  process.exit(1);
}

testWordDocument(filePath).then(success => {
  process.exit(success ? 0 : 1);
}); 