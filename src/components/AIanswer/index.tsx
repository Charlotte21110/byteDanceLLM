import React from 'react';
import "./index.css";
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';

interface AIanswerProps {
  content: string;
  duration?: number;
}
interface CodeProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

const AIanswer = (props: AIanswerProps) => {
  const { content } = props;

  return (
    <div className="chat-ai">
      <div className="chat-ai-avator">
        <i
          className="iconfont icon-gpt"
          style={{ fontSize: "24px", color: "#fff" }}
        ></i>
      </div>
      <div className="chat-ai-answer">
        <ReactMarkdown
          components={{
            code: ({ inline, className, children }: CodeProps) => {
              if (inline) {
                return <code className="chat-code" style={{ 
                  backgroundColor: '#f0f0f0', 
                  padding: '0.2em 0.4em',
                  borderRadius: '3px',
                  fontSize: '85%',
                }}>{children}</code>;
              }
              const language = className ? className.replace('language-', '') : '';
              return (
                <CodeBlock 
                  language={language} 
                  value={String(children).replace(/\n$/, '')} 
                />
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default AIanswer;
