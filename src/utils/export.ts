import { saveAs } from 'file-saver';
import pptxgen from 'pptxgenjs';

export type ExportFormat = 'txt' | 'rtf' | 'pptx';

interface ExportOptions {
  content: string;
  type: string;
  filename?: string;
  format: ExportFormat;
}

// LaTeX to Unicode conversion for simple math
const latexToUnicode: Record<string, string> = {
  '\\times': '×',
  '\\div': '÷',
  '\\pm': '±',
  '\\deg': '°',
  '\\mu': 'μ',
  '\\alpha': 'α',
  '\\beta': 'β',
  '\\gamma': 'γ',
  '\\delta': 'δ',
  '\\epsilon': 'ε',
  '\\theta': 'θ',
  '\\pi': 'π',
  '\\sigma': 'σ',
  '\\omega': 'ω',
  '\\infty': '∞',
  '\\sum': '∑',
  '\\prod': '∏',
  '\\sqrt': '√',
  '\\partial': '∂',
  '\\int': '∫',
  '\\approx': '≈',
  '\\neq': '≠',
  '\\leq': '≤',
  '\\geq': '≥',
};

const convertLatexToUnicode = (content: string): string => {
  // Replace simple LaTeX commands with Unicode
  Object.entries(latexToUnicode).forEach(([latex, unicode]) => {
    content = content.replace(new RegExp(latex.replace(/\\/g, '\\\\'), 'g'), unicode);
  });

  // Handle superscripts
  content = content.replace(/\^(\d+)/g, (_, num) => {
    const superscripts: Record<string, string> = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    };
    return num.split('').map((n: string) => superscripts[n]).join('');
  });

  // Handle subscripts
  content = content.replace(/_(\d+)/g, (_, num) => {
    const subscripts: Record<string, string> = {
      '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
      '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
    };
    return num.split('').map((n: string) => subscripts[n]).join('');
  });

  return content;
};

const handleComplexLatex = (content: string): string => {
  // Find all complex LaTeX expressions (between $$ or $)
  const complexLatexRegex = /\$\$(.*?)\$\$|\$(.*?)\$/g;
  return content.replace(complexLatexRegex, (match, displayMath, inlineMath) => {
    const latex = displayMath || inlineMath;
    // For complex expressions, keep them as LaTeX but add a note
    return displayMath 
      ? `\n[Complex Mathematical Expression: ${latex}]\n`
      : `[Math: ${latex}]`;
  });
};

const exportPPTX = async (content: string, filename: string) => {
  const pres = new pptxgen();
  
  // Set default slide layout and margins
  pres.defineLayout({ 
    name: 'CUSTOM',
    width: 10,
    height: 5.625
  });
  pres.layout = 'CUSTOM';

  // Function to create a new slide with title
  const createSlideWithTitle = (title: string) => {
    const slide = pres.addSlide();
    if (title) {
      slide.addText(title.trim(), {
        x: 0.5,
        y: 0.3,
        w: '90%',
        h: 0.75,
        fontSize: 24,
        bold: true,
        align: 'left',
        color: '363636'
      });
    }
    return slide;
  };

  // Function to clean content
  const cleanContent = (content: string): string => {
    return content
      .replace(/\n#+\s*$/, '') // Remove trailing # at the end of content
      .replace(/\n#+\n/g, '\n') // Remove lines that only contain #
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
      .trim();
  };

  // Function to add content to slide with proper formatting
  const addContentToSlide = (slide: any, content: string, startY: number = 1.3) => {
    const lines = cleanContent(content).split('\n').filter(line => line.trim());
    let currentY = startY;
    let currentIndentLevel = 0;

    lines.forEach(line => {
      // Skip empty lines and lines containing only #
      if (!line.trim() || /^#+$/.test(line.trim())) return;

      // Determine indentation level and format
      if (line.match(/^\d+\./)) {
        currentIndentLevel = 0;
      } else if (line.match(/^\s*\([a-z]\)/)) {
        currentIndentLevel = 1;
      } else if (line.startsWith('   ')) {
        currentIndentLevel = 2;
      }

      // Clean up the line
      const cleanLine = line.trim()
        .replace(/^\d+\.\s*/, '')  // Remove leading numbers
        .replace(/^\([a-z]\)\s*/, '')  // Remove (a), (b), etc.
        .replace(/#+$/, '')  // Remove trailing #
        .trim();

      if (!cleanLine) return; // Skip if line is empty after cleaning

      // Add text with proper formatting
      slide.addText(cleanLine, {
        x: 0.5 + (currentIndentLevel * 0.5),
        y: currentY,
        w: '85%',
        h: 0.3,
        fontSize: 14,
        bullet: currentIndentLevel > 0,
        align: 'left',
        color: '363636'
      });

      currentY += 0.35;
    });

    return currentY;
  };

  // Split content into main sections and clean them
  const sections = content
    .split(/(?=###[^#])/)
    .map(section => cleanContent(section))
    .filter(section => section.trim());

  for (const section of sections) {
    if (!section.trim()) continue;

    // Handle regular slides (#### Slide X:)
    if (section.includes('#### Slide')) {
      const slides = section
        .split(/####\s+Slide\s+\d+:/)
        .map(slide => cleanContent(slide))
        .filter(slide => slide.trim());
      
      slides.forEach((slideContent) => {
        const lines = slideContent.trim().split('\n');
        const title = lines[0];
        const slide = createSlideWithTitle(title);
        
        // Group remaining content
        const contentLines = lines.slice(1).join('\n');
        addContentToSlide(slide, contentLines);
      });
    }
    // Handle section content (### Section)
    else if (section.startsWith('###')) {
      const lines = section.trim().split('\n');
      const sectionTitle = lines[0].replace(/^###\s*/, '').replace(/#+$/, '').trim();
      let contentLines = lines.slice(1);
      
      // Calculate how many lines can fit on one slide (approximately)
      const LINES_PER_SLIDE = 10;
      
      // Split content into multiple slides if needed
      for (let i = 0; i < contentLines.length; i += LINES_PER_SLIDE) {
        const slideContent = contentLines.slice(i, i + LINES_PER_SLIDE);
        const cleanSlideContent = cleanContent(slideContent.join('\n'));
        
        if (cleanSlideContent.trim()) {  // Only create slide if there's content
          const slide = createSlideWithTitle(
            i === 0 ? sectionTitle : `${sectionTitle} (Continued)`
          );
          addContentToSlide(slide, cleanSlideContent);
        }
      }
    }
  }
  
  // Save the presentation
  await pres.writeFile({ fileName: `${filename}.pptx` });
};

export const exportContent = async ({ content, type, filename, format }: ExportOptions) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const defaultFilename = `${type}-${timestamp}`;
  const finalFilename = filename || defaultFilename;

  // First handle complex LaTeX expressions
  let processedContent = handleComplexLatex(content);
  // Then convert simple LaTeX to Unicode
  processedContent = convertLatexToUnicode(processedContent);
  
  switch (format) {
    case 'txt':
      return exportTXT(processedContent, finalFilename);
    case 'rtf':
      const htmlContent = convertToHTML(processedContent);
      return exportRTF(htmlContent, finalFilename);
    case 'pptx':
      return exportPPTX(processedContent, finalFilename);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

const convertToHTML = (content: string): string => {
  // First handle bold text across multiple lines
  content = content.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');
  
  return content
    .split('\n')
    .map(line => {
      // Handle headers (h1 to h6) - only if they have a space after the #
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

      // Handle lines starting with ## (without space) as regular text with ##
      if (line.trim().startsWith('##') && !line.trim().startsWith('## ')) {
        return `<p>${line}</p>`;
      }

      // Handle lines starting with single # (without space) as regular text with #
      if (line.trim().startsWith('#') && !line.trim().startsWith('# ')) {
        return `<p>${line}</p>`;
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
    // Headers with different sizes - only for headers with space after #
    .replace(/<h1>(.*?)<\/h1>/g, '\\pard\\par\\f0\\fs40\\b $1\\b0\\fs24\\par\n')  // Two spaces for main header
    .replace(/<h2>(.*?)<\/h2>/g, '\\pard\\par\\f0\\fs36\\b $1\\b0\\fs24\\par\n')  // Two spaces for main header
    .replace(/<h3>(.*?)<\/h3>/g, '\\pard\\f0\\fs32\\b $1\\b0\\fs24\\par\n')       // One space for section header
    .replace(/<h4>(.*?)<\/h4>/g, '\\pard\\f0\\fs28\\b $1\\b0\\fs24\\par\n')       // One space for section header
    .replace(/<h5>(.*?)<\/h5>/g, '\\pard\\f0\\fs26\\b $1\\b0\\fs24\\par\n')       // One space for section header
    .replace(/<h6>(.*?)<\/h6>/g, '\\pard\\f0\\fs24\\b $1\\b0\\fs24\\par\n')       // One space for section header
    
    // Lists - preserve original numbers and add spacing
    .replace(/<ol start="(\d+)"><li value="\d+">(.*?)<\/li><\/ol>/g, '\\pard\\fi-360\\li720\\f0\\fs24 $1. $2\\par\n')
    
    // Text formatting
    .replace(/<strong>(.*?)<\/strong>/g, '\\b $1\\b0 ')
    .replace(/<em>(.*?)<\/em>/g, '\\i $1\\i0 ')
    
    // Paragraphs and spacing - preserve original ## and # at start of lines
    .replace(/<p>(.*?)<\/p>/g, '\\pard\\f0\\fs24 $1\\par\n')  // Single space after paragraphs
    .replace(/<hr\/>/g, '\\pard\\brdrb\\brdrs\\brdrw10\\brsp20 \\par\\pard\n')  // Single space after horizontal rule
    
    // Add section breaks with extra spacing
    .replace(/(?:\\par\\par\n){3,}/g, '\\par\n')  // Normalize multiple paragraph breaks to single
    .replace(/\\par\s*\\pard/g, '\\par\\pard')    // Normalize spacing between sections
    
    // Handle special characters
    .replace(/[–—]/g, '-') // Convert em and en dashes to regular dashes
    .replace(/['']/g, "'") // Convert smart quotes to regular quotes
    .replace(/[""]/g, '"') // Convert smart quotes to regular quotes
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    // Additional special character handling
    .replace(/[™]/g, '(TM)')
    .replace(/[©]/g, '(c)')
    .replace(/[®]/g, '(R)')
    .replace(/[±]/g, '+/-')
    .replace(/[×]/g, 'x')
    .replace(/[÷]/g, '/')
    .replace(/[°]/g, ' degrees')
    .replace(/[µ]/g, 'u')
    .replace(/[α]/g, 'alpha')
    .replace(/[β]/g, 'beta')
    .replace(/[γ]/g, 'gamma')
    .replace(/[δ]/g, 'delta')
    .replace(/[π]/g, 'pi')
    .replace(/[σ]/g, 'sigma')
    .replace(/[ω]/g, 'omega')
    .replace(/[∞]/g, 'infinity')
    .replace(/[≈]/g, '~=')
    .replace(/[≠]/g, '!=')
    .replace(/[≤]/g, '<=')
    .replace(/[≥]/g, '>=')
    .replace(/[∑]/g, 'sum')
    .replace(/[∫]/g, 'integral')
    .replace(/[√]/g, 'sqrt');
  
  // Add proper spacing at the beginning of the document
  rtf += '\\pard\n' + content;
  rtf += '}';
  
  return rtf;
};

const exportRTF = (htmlContent: string, filename: string) => {
  const rtfContent = convertHtmlToRtf(htmlContent);
  const blob = new Blob([rtfContent], { type: 'application/rtf' });
  saveAs(blob, `${filename}.rtf`);
};