export interface ContactInfo {
  emails: string[];
  phones: string[];
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface Skill {
  category: string;
  skills: string[];
}

export interface Experience {
  type: 'work' | 'education';
  content: string;
}

export interface ResumeData {
  fileName: string;
  contactInfo: ContactInfo;
  skills: Skill[];
  experience: Experience[];
  keyValuePairs: Array<{ key: string; value: string }>;
  tables: Array<{
    rowCount: number;
    columnCount: number;
    cells: Array<{ rowIndex: number; columnIndex: number; content: string }>;
  }>;
  fullText: string;
  confidence: number;
  pages: number;
  usedFallback?: boolean;
} 