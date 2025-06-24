import { client } from './azure-client';
import { extractContactInfo, extractSkills, extractExperience } from '@/utils/regex-patterns';
import { ResumeData } from './types';

export async function parseResume(fileBuffer: Buffer, fileName: string): Promise<ResumeData> {
  try {
    // Analyze document with Azure
    const poller = await client.beginAnalyzeDocument("prebuilt-document", fileBuffer);
    const result = await poller.pollUntilDone();

    // Extract all text content
    let allText = "";
    for (const page of result.pages) {
      for (const line of page.lines) {
        allText += line.content + " ";
      }
    }

    // Extract structured data
    const contactInfo = extractContactInfo(allText);
    const skills = extractSkills(allText);
    const experience = extractExperience(allText);

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
      pages: result.pages.length
    };

  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume document');
  }
} 