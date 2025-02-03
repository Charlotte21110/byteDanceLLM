import { useEffect, useState, useRef } from 'react';
import "./index.css";
import "../../icon/font/iconfont.css";
import { Input, Button } from 'antd';
import Guest from '../Guest';
import AIanswer from '../AIanswer';
import { fetchAIResponse } from '../../api/index';
import { ArrowUpOutlined, StopOutlined } from '@ant-design/icons';

export interface Content {
  content: string;
  type?: string;
}

const ChatLLM = () => {
  const { Search } = Input;
  const [guestContents, setGuestContents] = useState<Content[]>([]);
  const [aiContents, setAIContents] = useState<Content[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [combinedContents, setCombinedContents] = useState<Content[]>([]);
  const [isResponding, setIsResponding] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
      setIsResponding(false);
    }
  };

  const onSearch = async (value: string) => {
    if (!value.trim()) return;
    
    setGuestContents(prevContents => [...prevContents, { content: value }]);
    setSearchValue('');
    let aiContent = '';
    setAIContents(prevContents => [...prevContents, { content: aiContent }]);
    
    const controller = new AbortController();
    setAbortController(controller);
    setIsResponding(true);

    // Prepare additional messages from previous conversation
    const additionalMessages = combinedContents.map(content => ({
      role: content.type === 'guest' ? 'user' : 'assistant',
      content: content.content,
      content_type: 'text',
    }));

    try {
      await fetchAIResponse(value, additionalMessages, (data: string) => {
        aiContent += data;
        setAIContents(prevContents => {
          const newContents = [...prevContents];
          newContents[newContents.length - 1].content = aiContent;
          return newContents;
        });
      }, controller.signal);
    } finally {
      setIsResponding(false);
      setAbortController(null);
    }

    // 调整 textarea 高度
    const textarea = document.querySelector('.chat-input-search') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto'; // 重置高度
      textarea.style.height = `${Math.min(textarea.scrollHeight, 15 * window.innerHeight / 100)}px`; // 设置新高度，最大为 15vh
    }
  };

  useEffect(() => {
    const combined: Content[] = [];
    for (let i = 0; i < Math.max(guestContents.length, aiContents.length); i++) {
      if (guestContents[i]) {
        combined.push({ ...guestContents[i], type: 'guest'})
      }
      if (aiContents[i]) combined.push({ ...aiContents[i], type: 'ai' });

    }
    console.log(combined);
    setCombinedContents(combined);
  }, [guestContents, aiContents]);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [combinedContents]);

  return (
    <div className="chat-body">
      <div className="chat-main">
        <div className="chat-content" ref={chatContentRef}>
          {/* {guestContents.map((content, index) => {
            return (
              <Guest key={index} content={content} />
            );
          })}
          {aiContents.map((content, index) => (
            <AIanswer key={index} content={content} />
          ))} */}
          {combinedContents.map((content, index) => {
            if (content.type === 'guest') {
              return <Guest key={index} content={content.content} />;
            } else {
              return <AIanswer key={index} content={content.content} />;
            }
          })}
        </div>
        <div className="chat-input">
          <textarea
            placeholder="input search text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              // 调整 textarea 高度
              const textarea = e.target;
              textarea.style.height = 'auto'; // 重置高度
              textarea.style.height = `${Math.min(textarea.scrollHeight, 15 * window.innerHeight / 100)}px`; // 设置新高度，最大为 15vh
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSearch(searchValue);
              }
            }}
            className="chat-input-search"
            rows={3}
          />
          <Button onClick={() => onSearch(searchValue)}>
            <ArrowUpOutlined />
          </Button>
          {isResponding && (
            <Button className="stop-button" onClick={handleStop}>
              <StopOutlined />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatLLM;