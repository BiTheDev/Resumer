'use client';

import { ResumeData } from '@/lib/types';

interface ResumeResultsProps {
  data: ResumeData;
}

export default function ResumeResults({ data }: ResumeResultsProps) {
  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          📄 Resume Analysis Results
        </h2>
        <div className="text-sm text-gray-600 mb-4">
          File: {data.fileName} | Pages: {data.pages} | Confidence: {(data.confidence * 100).toFixed(1)}%
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          📞 Contact Information
        </h3>
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
      </div>

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            💻 Skills & Technologies
          </h3>
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
        </div>
      )}

      {/* Experience & Education */}
      {data.experience.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            💼 Experience & Education
          </h3>
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
        </div>
      )}

      {/* Key-Value Pairs */}
      {data.keyValuePairs.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            🔗 Key-Value Pairs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.keyValuePairs.map((kv, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="font-medium text-gray-800 text-sm">{kv.key}</div>
                <div className="text-gray-600 text-sm">{kv.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tables */}
      {data.tables.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            📊 Tables Detected
          </h3>
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
        </div>
      )}

      {/* Full Text (Collapsible) */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <details className="group">
          <summary className="text-xl font-semibold text-gray-900 mb-4 flex items-center cursor-pointer list-none">
            📝 Full Text Content
            <span className="ml-2 text-sm text-gray-500 group-open:hidden">(Click to expand)</span>
            <span className="ml-2 text-sm text-gray-500 hidden group-open:inline">(Click to collapse)</span>
          </summary>
          <div className="mt-4">
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {data.fullText}
              </pre>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
} 