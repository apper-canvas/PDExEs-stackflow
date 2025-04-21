import Prism from 'prismjs';

// Import core Prism languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-markup'; // HTML
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-swift';

/**
 * Determines the language from a class string on a code element
 * @param {string} classStr - Class string from code element
 * @returns {string} - The detected language or 'javascript' as default
 */
const detectLanguage = (classStr) => {
  if (!classStr) return 'javascript';
  
  // Extract language from class like "language-javascript"
  const match = classStr.match(/language-(\w+)/);
  if (match && match[1]) {
    return match[1];
  }
  
  return 'javascript'; // Default to JavaScript
};

/**
 * Process HTML content to highlight code blocks using Prism.js
 * @param {string} html - HTML content containing code blocks
 * @returns {string} - Processed HTML with syntax highlighting
 */
export const processCodeBlocks = (html) => {
  if (!html) return '';
  
  // Create a DOM parser to work with the HTML content
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find all <pre><code> blocks (standard StackOverflow format)
  const codeBlocks = doc.querySelectorAll('pre code');
  
  codeBlocks.forEach(codeBlock => {
    // Determine language from class or default to javascript
    const language = detectLanguage(codeBlock.className);
    
    try {
      // Get the text content to highlight
      const code = codeBlock.textContent;
      
      // Apply syntax highlighting
      const highlightedCode = Prism.highlight(
        code,
        Prism.languages[language] || Prism.languages.javascript,
        language
      );
      
      // Update the code block with highlighted code
      codeBlock.innerHTML = highlightedCode;
      
      // Add appropriate classes for styling
      codeBlock.classList.add(`language-${language}`);
      const preElement = codeBlock.parentNode;
      if (preElement && preElement.tagName === 'PRE') {
        preElement.classList.add(`language-${language}`);
        preElement.classList.add('code-block');
      }
    } catch (error) {
      console.error('Error highlighting code:', error);
    }
  });
  
  // Convert back to HTML string
  return doc.body.innerHTML;
};