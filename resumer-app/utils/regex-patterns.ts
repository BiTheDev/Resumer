import { ContactInfo, Skill, Experience } from '@/lib/types';

export function extractContactInfo(text: string): ContactInfo {
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  
  // Improved phone pattern to handle various formats and prevent duplicates
  const phonePattern = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  
  const linkedinPattern = /(?:linkedin\.com|linkedin\.com\/in\/)[^\s]+/gi;
  const githubPattern = /(?:github\.com\/)[^\s]+/gi;
  
  // Improved website pattern to exclude email domains
  const websitePattern = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g;

  const emails = [...text.matchAll(emailPattern)].map(match => match[0]);
  
  // Fix phone number extraction to avoid duplicates
  const phoneMatches = [...text.matchAll(phonePattern)];
  const phones = phoneMatches.map(match => {
    // Reconstruct the phone number from groups, removing any undefined parts
    const parts = match.slice(1).filter(part => part !== undefined);
    return parts.join('');
  }).filter((phone, index, array) => array.indexOf(phone) === index); // Remove duplicates
  
  const linkedin = text.match(linkedinPattern)?.[0];
  const github = text.match(githubPattern)?.[0];
  
  // Filter out email domains from website matches
  const websiteMatches = text.match(websitePattern) || [];
  const website = websiteMatches.find(match => {
    // Exclude common email domains and email-like patterns
    const lowerMatch = match.toLowerCase();
    const emailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com'];
    
    // Check if it's an email domain or email address
    const isEmailDomain = emailDomains.some(domain => lowerMatch.includes(domain)) || 
                         lowerMatch.includes('@') || 
                         lowerMatch.match(/^[a-zA-Z0-9._%+-]+@/);
    
    // Check if it's already detected as LinkedIn or GitHub
    const isLinkedIn = linkedin && lowerMatch.includes('linkedin.com');
    const isGitHub = github && lowerMatch.includes('github.com');
    
    // Return true only if it's not an email and not already detected as LinkedIn/GitHub
    return !isEmailDomain && !isLinkedIn && !isGitHub;
  });

  // Debug logging
  console.log(`Contact extraction - Emails: ${emails.length}, Phones: ${phones.length}, LinkedIn: ${linkedin ? 'yes' : 'no'}, GitHub: ${github ? 'yes' : 'no'}, Website: ${website ? 'yes' : 'no'}`);
  if (phones.length > 0) {
    console.log(`Phone numbers found: ${phones.join(', ')}`);
  }
  if (website) {
    console.log(`Website found: ${website}`);
  }

  return {
    emails,
    phones,
    linkedin,
    github,
    website
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