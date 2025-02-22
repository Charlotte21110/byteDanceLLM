import React, { useState } from 'react';
import hljs from '../../utils/highlightConfig';

interface CodeBlockProps {
  language: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copyMessage, setCopyMessage] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopyMessage('已复制');
    setTimeout(() => setCopyMessage('Copy'), 5000); // 2秒后恢复为"Copy"
  };

  const highlighted = language
    ? hljs.highlight(value, { language: language || 'plaintext' }).value
    : value;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          right: '10px',
          top: '10px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--button-text)',
          borderRadius: '5px',
          padding: '5px 10px',
          backgroundColor: 'var(--button-bg)',
        }}
      >
        {copyMessage || 'Copy'}
      </button>
      <pre
        style={{
          backgroundColor: '#1E1E1E',
          padding: '1em',
          borderRadius: '6px',
          overflow: 'auto',
        }}
      >
        <code
          dangerouslySetInnerHTML={{ __html: highlighted }}
          style={{
            fontFamily: 'Consolas, Monaco, monospace',
            backgroundColor: 'black',
            color: '#fff',
          }}
        />
      </pre>
    </div>
  );
};

export default CodeBlock;
