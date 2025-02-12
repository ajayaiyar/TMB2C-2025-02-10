import { useEffect, useRef } from 'react';

declare global {
  interface MathJaxInstance {
    typesetPromise: (elements: (HTMLElement | null)[]) => Promise<void>;
    startup: {
      promise: Promise<void>;
      ready: () => Promise<void>;
    };
    loader: {
      load: (packages: string[]) => Promise<void>;
    };
  }

  interface Window {
    MathJax?: any;
  }
}

interface MathContentProps {
  content: string;
}

export function MathContent({ content }: MathContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializationAttempts = useRef(0);
  const maxAttempts = 3;

  useEffect(() => {
    const loadMathJax = async () => {
      if (!window.MathJax) {
        // Configure MathJax before loading
        window.MathJax = {
          loader: {
            load: ['[tex]/physics', '[tex]/mhchem', '[tex]/mathtools']
          },
          tex: {
            packages: ['base', 'ams', 'noerrors', 'noundefined', 'html', 'physics', 'mhchem', 'mathtools'],
            inlineMath: [['$', '$']],
            displayMath: [['$$', '$$']],
            processEscapes: true,
            processEnvironments: true,
            processRefs: true,
          },
          options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
            processHtmlClass: 'math-tex',
            ignoreHtmlClass: 'tex2jax_ignore',
          },
          startup: {
            typeset: false,
            ready: () => Promise.resolve(),
          },
          svg: {
            fontCache: 'global',
            scale: 1,
            minScale: .5,
          },
          chtml: {
            fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2'
          },
          output: 'svg'
        };

        // Load MathJax with MathML support
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js';
        script.async = true;
        
        // Create a promise that resolves when MathJax is fully loaded
        await new Promise<void>((resolve, reject) => {
          script.onload = () => {
            // Give MathJax a moment to initialize
            setTimeout(resolve, 100);
          };
          script.onerror = () => reject(new Error('Failed to load MathJax'));
          document.head.appendChild(script);
        });
      }

      try {
        const mathJax = window.MathJax as MathJaxInstance;
        
        // Wait for MathJax startup to complete
        if (mathJax?.startup?.promise) {
          await mathJax.startup.promise;
        }

        // Load additional packages if needed
        if (mathJax?.loader?.load) {
          await mathJax.loader.load(['physics', 'mhchem', 'mathtools']);
        }

        // Only attempt to typeset if we have content
        if (!content.trim()) {
          return;
        }

        // Typeset the math in the container
        if (containerRef.current && mathJax?.typesetPromise) {
          try {
            await mathJax.typesetPromise([containerRef.current]);
            initializationAttempts.current = 0; // Reset counter on success
          } catch (typesetError) {
            console.error('MathJax typesetting error:', typesetError);
            throw typesetError;
          }
        }
      } catch (error) {
        console.error('MathJax processing error:', error);
        
        // Retry logic for initialization errors
        if (initializationAttempts.current < maxAttempts) {
          initializationAttempts.current += 1;
          console.log(`Retrying MathJax initialization (attempt ${initializationAttempts.current}/${maxAttempts})`);
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * initializationAttempts.current));
          await loadMathJax();
          return;
        }

        // Only show error if we've exhausted retries
        if (containerRef.current) {
          containerRef.current.innerHTML = content;
        }
      }
    };

    loadMathJax();
  }, [content]);

  // Initial render with content, MathJax will process it after loading
  return (
    <div 
      ref={containerRef} 
      className="prose max-w-none whitespace-pre-wrap math-tex"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
} 