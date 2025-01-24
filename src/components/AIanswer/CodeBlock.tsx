import 'highlight.js/styles/vs2015.css';
import hljs from 'highlight.js';
import 'highlight.js/lib/languages/javascript';
import 'highlight.js/lib/languages/typescript';
import 'highlight.js/lib/languages/python';
import 'highlight.js/lib/languages/java';
import 'highlight.js/lib/languages/cpp';
import 'highlight.js/lib/languages/css';
import 'highlight.js/lib/languages/xml';
import 'highlight.js/lib/languages/sql';

interface CodeBlockProps {
  language: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const highlighted = language
    ? hljs.highlight(value, { language: language || 'plaintext' }).value
    : value;

  return (
    <pre style={{ 
      backgroundColor: '#1E1E1E',
      padding: '1em',
      borderRadius: '6px',
      overflow: 'auto'
    }}>
      <code 
        dangerouslySetInnerHTML={{ __html: highlighted }}
        style={{ fontFamily: 'Consolas, Monaco, monospace', backgroundColor: 'black', color: '#fff' }}
      />
    </pre>
  );
};

export default CodeBlock; 