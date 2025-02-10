import { saveAs } from 'file-saver';

export type ExportFormat = 'txt' | 'rtf' | 'gdoc';

interface ExportOptions {
  content: string;
  type: string;
  filename?: string;
}

export const exportContent = async ({ content, type, filename }: ExportOptions) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const defaultFilename = `${type}-${timestamp}`;
  const finalFilename = filename || defaultFilename;

  const htmlContent = convertToHTML(content);
  
  return {
    txt: () => exportTXT(content, finalFilename),
    rtf: () => exportRTF(htmlContent, finalFilename),
    gdoc: () => exportToGoogleDocs(content, finalFilename),
  };
};

const convertToHTML = (content: string): string => {
  // First handle bold text across multiple lines
  content = content.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');
  
  return content
    .split('\n')
    .map(line => {
      // Handle headers (h1 to h6)
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const text = headerMatch[2];
        return `<h${level}>${text}</h${level}>`;
      }

      // Handle numbered lists - preserve the original number
      const numberedListMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (numberedListMatch) {
        const [, number, text] = numberedListMatch;
        return `<ol start="${number}"><li value="${number}">${text}</li></ol>`;
      }

      // Handle bullet points - preserve any text after the dash
      if (line.trim().startsWith('- ')) {
        const bulletText = line.slice(line.indexOf('- ') + 2);
        return `<ul><li class="bullet">${bulletText}</li></ul>`;
      }

      // Handle italic text
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');

      // Handle horizontal rules
      if (line.trim() === '---') {
        return '<hr/>';
      }

      // Handle regular paragraphs
      if (line.trim()) {
        return `<p>${line}</p>`;
      }

      return line;
    })
    .join('\n');
};

const exportTXT = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${filename}.txt`);
};

const convertHtmlToRtf = (html: string): string => {
  // Basic RTF header
  let rtf = '{\\rtf1\\ansi\\deff0\n';
  
  // Font table
  rtf += '{\\fonttbl\\f0\\fswiss\\fcharset0 Arial;}\n';
  
  // Color table
  rtf += '{\\colortbl;\\red0\\green0\\blue0;}\n';
  
  // Convert HTML to RTF
  const content = html
    // Headers with different sizes
    .replace(/<h1>(.*?)<\/h1>/g, '\\f0\\fs40\\b $1\\b0\\fs24\\par\n')
    .replace(/<h2>(.*?)<\/h2>/g, '\\f0\\fs36\\b $1\\b0\\fs24\\par\n')
    .replace(/<h3>(.*?)<\/h3>/g, '\\f0\\fs32\\b $1\\b0\\fs24\\par\n')
    .replace(/<h4>(.*?)<\/h4>/g, '\\f0\\fs28\\b $1\\b0\\fs24\\par\n')
    .replace(/<h5>(.*?)<\/h5>/g, '\\f0\\fs26\\b $1\\b0\\fs24\\par\n')
    .replace(/<h6>(.*?)<\/h6>/g, '\\f0\\fs24\\b $1\\b0\\fs24\\par\n')
    
    // Lists - preserve original numbers and proper bullet points
    .replace(/<ol start="(\d+)"><li value="\d+">(.*?)<\/li><\/ol>/g, '\\f0\\fs24 $1. $2\\par\n')
    .replace(/<ul><li class="bullet">(.*?)<\/li><\/ul>/g, '\\f0\\fs24 • $1\\par\n')
    
    // Text formatting
    .replace(/<strong>(.*?)<\/strong>/g, '\\b $1\\b0 ')
    .replace(/<em>(.*?)<\/em>/g, '\\i $1\\i0 ')
    
    // Paragraphs and spacing
    .replace(/<p>(.*?)<\/p>/g, '\\f0\\fs24 $1\\par\n')
    .replace(/<hr\/>/g, '\\pard\\brdrb\\brdrs\\brdrw10\\brsp20 \\par\\pard\n')
    
    // Handle special characters
    .replace(/[–—]/g, '-') // Convert em and en dashes to regular dashes
    .replace(/['']/g, "'") // Convert smart quotes to regular quotes
    .replace(/[""]/g, '"') // Convert smart quotes to regular quotes
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"');
  
  rtf += content;
  rtf += '}';
  
  return rtf;
};

const exportRTF = (htmlContent: string, filename: string) => {
  const rtfContent = convertHtmlToRtf(htmlContent);
  const blob = new Blob([rtfContent], { type: 'application/rtf' });
  saveAs(blob, `${filename}.rtf`);
};

const exportToGoogleDocs = async (content: string, filename: string) => {
  // Format the content for better readability
  const formattedContent = content
    .replace(/^(#{1,6})\s+(.+)$/gm, (_, hashes, text) => {
      const level = hashes.length;
      return '\n'.repeat(level === 1 ? 2 : 1) + text.toUpperCase() + '\n';
    })
    .replace(/^(\d+)\.\s+(.+)$/gm, '$1. $2\n')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\n\n+/g, '\n\n')
    .trim();

  // Create a blob with the content
  const blob = new Blob([formattedContent], { type: 'text/plain' });
  
  // Create a temporary link to download the file
  const tempLink = document.createElement('a');
  tempLink.href = URL.createObjectURL(blob);
  tempLink.download = `${filename}.txt`;
  
  // Trigger download
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  
  // Clean up the URL object
  URL.revokeObjectURL(tempLink.href);

  // Open Google Docs in a new tab
  setTimeout(() => {
    window.open('https://docs.google.com/document', '_blank');
  }, 100);
};