'use client';

import { ResumeData } from '@/lib/types';

interface ResumeResultsProps {
  data: ResumeData;
}

export default function ResumeResults({ data }: ResumeResultsProps) {
  // Check if any structured data was extracted
  const hasContactInfo = data.contactInfo.emails.length > 0 || 
                        data.contactInfo.phones.length > 0 || 
                        data.contactInfo.linkedin || 
                        data.contactInfo.github || 
                        data.contactInfo.website;
  
  const hasSkills = data.skills.length > 0;
  const hasExperience = data.experience.length > 0;
  const hasTables = data.tables.length > 0;
  
  const hasAnyStructuredData = hasContactInfo || hasSkills || hasExperience || hasTables;
  const hasFullText = data.fullText && data.fullText.trim().length > 0;

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          📄 Resume Analysis Results
        </h2>
        <div className="text-sm text-gray-600 mb-4">
          File: {data.fileName} | Pages: {data.pages} | Confidence: {(data.confidence * 100).toFixed(1)}%
        </div>
        
        {/* Show extraction status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-blue-800 mb-2">Extraction Status:</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
            <div className={`px-2 py-1 rounded ${hasContactInfo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              Contact Info: {hasContactInfo ? '✓' : '✗'}
            </div>
            <div className={`px-2 py-1 rounded ${hasSkills ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              Skills: {hasSkills ? '✓' : '✗'}
            </div>
            <div className={`px-2 py-1 rounded ${hasExperience ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              Experience: {hasExperience ? '✓' : '✗'}
            </div>
            <div className={`px-2 py-1 rounded ${hasTables ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              Tables: {hasTables ? '✓' : '✗'}
            </div>
          </div>
        </div>
        
        {/* Warning if no structured data found */}
        {!hasAnyStructuredData && hasFullText && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">⚠️ Limited Structured Data Extracted</h4>
            <p className="text-yellow-700 text-sm">
              The document was processed successfully and text was extracted, but no structured information (contact info, skills, experience) was automatically identified. 
              Check the "Full Text Content" section below to see the complete extracted text.
            </p>
          </div>
        )}
        
        {/* Warning if fallback methods were used */}
        {data.usedFallback && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">ℹ️ Fallback Processing Used</h4>
            <p className="text-blue-700 text-sm">
              This document was processed using fallback methods to ensure text extraction. 
              Some structured data extraction might be limited, but the full text content is available below.
            </p>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          📞 Contact Information
        </h3>
        {hasContactInfo ? (
          <div className="space-y-2">
            {data.contactInfo.emails.map((email, index) => (
              <div key={index} className="flex items-center">
                <span className="text-gray-500 w-16">Email:</span>
                <span className="text-blue-600">{email}</span>
              </div>
            ))}
            {data.contactInfo.phones.map((phone, index) => (
              <div key={index} className="flex items-center">
                <span className="text-gray-500 w-16">Phone:</span>
                <span>{phone}</span>
              </div>
            ))}
            {data.contactInfo.linkedin && (
              <div className="flex items-center">
                <span className="text-gray-500 w-16">LinkedIn:</span>
                <a href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {data.contactInfo.linkedin}
                </a>
              </div>
            )}
            {data.contactInfo.github && (
              <div className="flex items-center">
                <span className="text-gray-500 w-16">GitHub:</span>
                <a href={data.contactInfo.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {data.contactInfo.github}
                </a>
              </div>
            )}
            {data.contactInfo.website && (
              <div className="flex items-center">
                <span className="text-gray-500 w-16">Website:</span>
                <a href={data.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {data.contactInfo.website}
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 italic">No contact information found</div>
        )}
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          💻 Skills & Technologies
        </h3>
        {hasSkills ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.skills.map((skillGroup, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2 capitalize">
                  {skillGroup.category.replace('_', ' ')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 italic">No skills found</div>
        )}
      </div>

      {/* Experience & Education */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          💼 Experience & Education
        </h3>
        {hasExperience ? (
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="font-medium text-gray-800 mb-1">
                  {exp.type === 'work' ? '🏢 Work Experience' : '🎓 Education'}
                </div>
                <div className="text-gray-600 text-sm">
                  {exp.content}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 italic">No experience or education sections found</div>
        )}
      </div>

      {/* Tables */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          📊 Tables Detected
        </h3>
        {hasTables ? (
          <div className="space-y-4">
            {data.tables.map((table, tableIndex) => (
              <div key={tableIndex} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">
                  Table {tableIndex + 1} ({table.rowCount} rows × {table.columnCount} columns)
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <tbody>
                      {Array.from({ length: table.rowCount }, (_, rowIndex) => (
                        <tr key={rowIndex}>
                          {Array.from({ length: table.columnCount }, (_, colIndex) => {
                            const cell = table.cells.find(
                              c => c.rowIndex === rowIndex && c.columnIndex === colIndex
                            );
                            return (
                              <td key={colIndex} className="border border-gray-300 px-3 py-2 text-sm">
                                {cell?.content || ''}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 italic">No tables found</div>
        )}
      </div>

      {/* Full Text Content - Always show if no structured data or if text exists */}
      {hasFullText && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            📝 Full Text Content
            {!hasAnyStructuredData && (
              <span className="ml-2 text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                Primary Content
              </span>
            )}
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {data.fullText}
            </pre>
          </div>
          {!hasAnyStructuredData && (
            <div className="mt-3 text-sm text-gray-600">
              💡 <strong>Tip:</strong> The text above shows what was successfully extracted from your document. 
              You can manually review this content to find contact information, skills, and experience details.
            </div>
          )}
        </div>
      )}
    </div>
  );
} 