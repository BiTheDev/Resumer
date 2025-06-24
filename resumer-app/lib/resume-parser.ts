import { client } from './azure-client';
import { extractContactInfo, extractSkills, extractExperience } from '@/utils/regex-patterns';
import { ResumeData } from './types';
import mammoth from 'mammoth';

export async function parseResume(fileBuffer: Buffer, fileName: string): Promise<ResumeData> {
  try {
    console.log(`Processing file: ${fileName}`);
    console.log(`File size: ${fileBuffer.length} bytes`);
    
    // Check file signature for Word documents
    const fileSignature = fileBuffer.slice(0, 4).toString('hex').toUpperCase();
    console.log(`File signature: ${fileSignature}`);
    
    // Word document signatures
    if (fileName.toLowerCase().endsWith('.doc') && fileSignature !== 'D0CF11E0') {
      console.warn(`Warning: DOC file signature mismatch. Expected: D0CF11E0, Got: ${fileSignature}`);
    }
    if (fileName.toLowerCase().endsWith('.docx') && fileSignature !== '504B0304') {
      console.warn(`Warning: DOCX file signature mismatch. Expected: 504B0304, Got: ${fileSignature}`);
    }

    // Analyze document with Azure
    console.log(`Processing ${fileName} with model: prebuilt-document`);
    
    let result;
    let successfulModel = "prebuilt-document";
    let usedFallback = false;
    
    try {
      const poller = await client.beginAnalyzeDocument("prebuilt-document", fileBuffer);
      result = await poller.pollUntilDone();
    } catch (error) {
      console.warn(`prebuilt-document model failed: ${error instanceof Error ? error.message : String(error)}`);
      
      // Try fallback model for Word documents
      if (fileName.toLowerCase().endsWith('.doc') || fileName.toLowerCase().endsWith('.docx')) {
        console.log(`Trying fallback model: prebuilt-read`);
        try {
          const fallbackPoller = await client.beginAnalyzeDocument("prebuilt-read", fileBuffer);
          result = await fallbackPoller.pollUntilDone();
          successfulModel = "prebuilt-read";
          console.log(`Successfully used fallback model: prebuilt-read`);
        } catch (fallbackError) {
          console.error(`Fallback model also failed: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`);
          throw error; // Throw the original error
        }
      } else {
        throw error; // For non-Word documents, throw the original error
      }
    }

    console.log(`Successfully analyzed document with ${successfulModel}. Pages: ${result.pages?.length || 0}`);

    // Extract all text content
    let allText = "";

    // Prefer lines from pages
    if (result.pages && result.pages.length > 0) {
      for (const page of result.pages) {
        if (page.lines && page.lines.length > 0) {
          for (const line of page.lines) {
            allText += line.content + " ";
          }
        }
      }
    }

    // Fallback: use result.content if pages are empty
    if (allText.trim().length === 0 && result.content) {
      console.log("Using fallback: result.content");
      allText = result.content;
      usedFallback = true;
    }

    // Final fallback: use Mammoth for Word documents if Azure extraction is empty
    if (allText.trim().length === 0 && (fileName.toLowerCase().endsWith('.doc') || fileName.toLowerCase().endsWith('.docx'))) {
      console.log("Using Mammoth fallback for Word document");
      try {
        const mammothResult = await mammoth.extractRawText({ buffer: fileBuffer });
        allText = mammothResult.value;
        usedFallback = true;
        console.log("Mammoth successfully extracted text");
      } catch (mammothError) {
        console.error("Mammoth fallback also failed:", mammothError);
      }
    }

    console.log(`Extracted text length: ${allText.length} characters`);
    console.log(`Text trimmed length: ${allText.trim().length} characters`);
    console.log(`Has content: ${allText.trim().length > 0 ? 'Yes' : 'No'}`);
    console.log(`Used fallback: ${usedFallback ? 'Yes' : 'No'}`);
    
    // Show sample of extracted text for debugging
    if (allText.length > 0) {
      console.log(`Sample text (first 200 chars): ${allText.substring(0, 200)}`);
      console.log(`Sample text (last 200 chars): ${allText.substring(Math.max(0, allText.length - 200))}`);
    } else {
      console.warn('No text was extracted from the document');
    }

    // Extract structured data
    const contactInfo = extractContactInfo(allText);
    const skills = extractSkills(allText);
    const experience = extractExperience(allText);

    console.log(`Extracted contact info:`, contactInfo);
    console.log(`Extracted skills:`, skills);
    console.log(`Extracted experience:`, experience);

    // Extract key-value pairs and tables
    const keyValuePairs = result.keyValuePairs?.map(kv => ({
      key: kv.key?.content || '',
      value: kv.value?.content || ''
    })) || [];

    const tables = result.tables?.map(table => ({
      rowCount: table.rowCount,
      columnCount: table.columnCount,
      cells: table.cells.map(cell => ({
        rowIndex: cell.rowIndex,
        columnIndex: cell.columnIndex,
        content: cell.content
      }))
    })) || [];

    return {
      fileName,
      contactInfo,
      skills,
      experience,
      keyValuePairs,
      tables,
      fullText: allText,
      confidence: result.documents?.[0]?.confidence || 0,
      pages: result.pages?.length || 0,
      usedFallback
    };

  } catch (error) {
    console.error('Error parsing resume:', error);
    
    // Provide more detailed error information
    if (error instanceof Error) {
      // Check for specific Azure errors
      if (error.message.includes('corrupted') || error.message.includes('unsupported')) {
        throw new Error(`The file appears to be corrupted or in an unsupported format. Please ensure the file is a valid Word document or PDF. Original error: ${error.message}`);
      }
      
      if (error.message.includes('InvalidRequest') || error.message.includes('InvalidContent')) {
        throw new Error(`Azure Form Recognizer could not process this file. The file might be corrupted, password-protected, or in an unsupported format. Original error: ${error.message}`);
      }
      
      if (error.message.includes('authentication') || error.message.includes('unauthorized')) {
        throw new Error(`Authentication error with Azure Form Recognizer. Please check your credentials. Original error: ${error.message}`);
      }
      
      // For other errors, include the original error message
      throw new Error(`Failed to parse resume document: ${error.message}`);
    }
    
    // For non-Error objects
    throw new Error(`Failed to parse resume document: ${String(error)}`);
  }
} 