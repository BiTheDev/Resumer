// Test script for regex patterns
const { extractContactInfo } = require('./utils/regex-patterns.ts');

// Test cases
const testCases = [
  {
    name: "Phone number with parentheses and dashes",
    text: "Contact me at (123)-456-7890 or call 123-456-7890"
  },
  {
    name: "Phone number with spaces",
    text: "Phone: 123 456 7890 and also 123.456.7890"
  },
  {
    name: "Phone number with country code",
    text: "Call +1-123-456-7890 or 1234567890"
  },
  {
    name: "Website vs email domain",
    text: "Visit my website at https://example.com or email me at john@gmail.com"
  },
  {
    name: "Multiple email domains",
    text: "Email: john@yahoo.com, website: https://mysite.com, another: jane@hotmail.com"
  },
  {
    name: "LinkedIn and GitHub links",
    text: "LinkedIn: linkedin.com/in/johndoe, GitHub: github.com/johndoe, Website: https://portfolio.com"
  },
  {
    name: "LinkedIn link should not appear in website",
    text: "Check my LinkedIn: linkedin.com/in/johndoe and my portfolio at https://mysite.com"
  },
  {
    name: "GitHub link should not appear in website",
    text: "My GitHub: github.com/johndoe and my blog: https://blog.com"
  },
  {
    name: "Complex contact info with all types",
    text: "Phone: (555)-123-4567, Email: test@gmail.com, LinkedIn: linkedin.com/in/johndoe, GitHub: github.com/johndoe, Website: https://portfolio.com"
  }
];

function testRegexPatterns() {
  console.log('🧪 Testing Regex Patterns');
  console.log('='.repeat(50));
  
  testCases.forEach((testCase, index) => {
    console.log(`\n${index + 1}. ${testCase.name}`);
    console.log(`Text: "${testCase.text}"`);
    
    try {
      const result = extractContactInfo(testCase.text);
      
      console.log('Results:');
      console.log(`  Emails: ${result.emails.length > 0 ? result.emails.join(', ') : 'None'}`);
      console.log(`  Phones: ${result.phones.length > 0 ? result.phones.join(', ') : 'None'}`);
      console.log(`  LinkedIn: ${result.linkedin || 'None'}`);
      console.log(`  GitHub: ${result.github || 'None'}`);
      console.log(`  Website: ${result.website || 'None'}`);
      
      // Check for issues
      if (result.phones.length > 1) {
        console.log('  ⚠️  Multiple phone numbers found - check for duplicates');
      }
      
      if (result.website && result.website.includes('@')) {
        console.log('  ⚠️  Website contains @ symbol - might be an email');
      }
      
      if (result.website && ['gmail.com', 'yahoo.com', 'hotmail.com'].some(domain => 
        result.website.toLowerCase().includes(domain))) {
        console.log('  ⚠️  Website appears to be an email domain');
      }
      
      // Check for LinkedIn/GitHub duplication
      if (result.website && result.linkedin && result.website.includes('linkedin.com')) {
        console.log('  ❌ LinkedIn link appears in website field - should be filtered out');
      }
      
      if (result.website && result.github && result.website.includes('github.com')) {
        console.log('  ❌ GitHub link appears in website field - should be filtered out');
      }
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  });
}

// Run tests
testRegexPatterns(); 