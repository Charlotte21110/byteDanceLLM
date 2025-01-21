import { useEffect, useState, useRef } from 'react';
import "./index.css";
import "../../icon/font/iconfont.css";
import { Input, Button } from 'antd';
import Guest from '../Guest';
import AIanswer from '../AIanswer';
import { fetchAIResponse } from '../../api/index';
import { SendOutlined, StopOutlined } from '@ant-design/icons';

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

    try {
      await fetchAIResponse(value, (data: string) => {
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
          <Search
            placeholder="input search text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={onSearch}
            className="chat-input-search"
            enterButton={
              isResponding ? (
                <Button className="stop-button" onClick={handleStop}>
                  <StopOutlined />
                </Button>
              ) : (
                <Button>
                  <SendOutlined />
                </Button>
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ChatLLM;