import { ContactInfo, Skill, Experience } from '@/lib/types';

export function extractContactInfo(text: string): ContactInfo {
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const phonePattern = /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const linkedinPattern = /(?:linkedin\.com|linkedin\.com\/in\/)[^\s]+/gi;
  const githubPattern = /(?:github\.com\/)[^\s]+/gi;
  const websitePattern = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:com|org|net|io|co|me)[^\s]*/g;

  return {
    emails: [...text.matchAll(emailPattern)].map(match => match[0]),
    phones: [...text.matchAll(phonePattern)].map(match => match.join('')),
    linkedin: text.match(linkedinPattern)?.[0],
    github: text.match(githubPattern)?.[0],
    website: text.match(websitePattern)?.[0]
  };
}

export function extractSkills(text: string): Skill[] {
  const skillsKeywords = {
    languages: ['python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala'],
    frameworks: ['react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', '.net'],
    databases: ['sql', 'mysql', 'postgresql', 'mongodb', 'redis'],
    tools: ['git', 'github', 'docker', 'kubernetes'],
    cloud: ['aws', 'azure', 'gcp'],
    ml_ai: ['machine learning', 'ai', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy'],
    web: ['html', 'css', 'bootstrap', 'tailwind']
  };

  const skills: Skill[] = [];
  
  for (const [category, keywords] of Object.entries(skillsKeywords)) {
    const found = keywords.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
    if (found.length > 0) {
      skills.push({ category, skills: found });
    }
  }

  return skills;
}

export function extractExperience(text: string): Experience[] {
  const experience: Experience[] = [];
  
  // Look for work experience
  const workPatterns = ['experience', 'work history', 'employment', 'job', 'position', 'role'];
  for (const pattern of workPatterns) {
    if (text.toLowerCase().includes(pattern)) {
      const startIdx = text.toLowerCase().indexOf(pattern);
      const sectionStart = Math.max(0, startIdx - 100);
      const sectionEnd = Math.min(text.length, startIdx + 200);
      const section = text.substring(sectionStart, sectionEnd).trim();
      
      experience.push({
        type: 'work',
        content: `Work experience section (around "${pattern}"): ${section}`
      });
      break;
    }
  }

  // Look for education
  const educationPatterns = ['education', 'degree', 'university', 'college', 'bachelor', 'master', 'phd'];
  for (const pattern of educationPatterns) {
    if (text.toLowerCase().includes(pattern)) {
      const startIdx = text.toLowerCase().indexOf(pattern);
      const sectionStart = Math.max(0, startIdx - 100);
      const sectionEnd = Math.min(text.length, startIdx + 200);
      const section = text.substring(sectionStart, sectionEnd).trim();
      
      experience.push({
        type: 'education',
        content: `Education section (around "${pattern}"): ${section}`
      });
      break;
    }
  }

  return experience;
} 