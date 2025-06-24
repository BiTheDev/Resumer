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

async function debugTextExtraction(filePath) {
  try {
    console.log(`🔍 Debugging text extraction for: ${filePath}`);
    console.log('='.repeat(60));
    
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    console.log(`📁 File size: ${fileBuffer.length} bytes`);
    
    // Check file signature
    const fileSignature = fileBuffer.slice(0, 4).toString('hex').toUpperCase();
    console.log(`🔍 File signature: ${fileSignature}`);
    
    const fileName = filePath.split('/').pop() || filePath.split('\\').pop();
    console.log(`📄 File name: ${fileName}`);
    
    // Try different models
    const models = ["prebuilt-document", "prebuilt-read"];
    let extractedText = "";
    let successfulModel = "";
    
    for (const model of models) {
      try {
        console.log(`\n🔄 Trying model: ${model}`);
        const poller = await client.beginAnalyzeDocument(model, fileBuffer);
        const result = await poller.pollUntilDone();
        
        console.log(`✅ Success with ${model}!`);
        console.log(`📊 Pages: ${result.pages?.length || 0}`);
        
        // Extract text
        if (result.pages) {
          for (const page of result.pages) {
            if (page.lines) {
              for (const line of page.lines) {
                extractedText += line.content + " ";
              }
            }
          }
        }
        
        console.log(`📝 Text length: ${extractedText.length} characters`);
        
        if (extractedText.length > 0) {
          console.log(`📄 Sample text (first 300 chars):`);
          console.log(extractedText.substring(0, 300));
          console.log(`\n📄 Sample text (last 300 chars):`);
          console.log(extractedText.substring(Math.max(0, extractedText.length - 300)));
        } else {
          console.log(`❌ No text extracted!`);
        }
        
        successfulModel = model;
        break;
        
      } catch (error) {
        console.log(`❌ Failed with ${model}: ${error.message}`);
        if (error.details?.error?.innererror?.message) {
          console.log(`   Inner error: ${error.details.error.innererror.message}`);
        }
      }
    }
    
    if (!extractedText) {
      console.log('\n❌ No text could be extracted from any model');
      return false;
    }
    
    console.log('\n📊 TEXT EXTRACTION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Model used: ${successfulModel}`);
    console.log(`✅ Text extracted: ${extractedText.length > 0 ? 'Yes' : 'No'}`);
    console.log(`✅ Text length: ${extractedText.length} characters`);
    console.log(`✅ Text trimmed length: ${extractedText.trim().length} characters`);
    console.log(`✅ Has content: ${extractedText.trim().length > 0 ? 'Yes' : 'No'}`);
    
    // Check for common issues
    if (extractedText.trim().length === 0) {
      console.log('❌ Issue: Text is empty after trimming');
    }
    
    if (extractedText.length > 0 && extractedText.trim().length === 0) {
      console.log('❌ Issue: Text contains only whitespace');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
    return false;
  }
}

// Usage: node debug-text-extraction.js <path-to-word-file>
const filePath = process.argv[2];
if (!filePath) {
  console.log('Usage: node debug-text-extraction.js <path-to-word-file>');
  console.log('Example: node debug-text-extraction.js ./test_file.docx');
  process.exit(1);
}

debugTextExtraction(filePath).then(success => {
  process.exit(success ? 0 : 1);
}); 