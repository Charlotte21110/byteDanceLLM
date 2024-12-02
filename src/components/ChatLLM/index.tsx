import { useEffect, useState } from 'react';
import "./index.css";
import "../../icon/font/iconfont.css";
import { Input } from 'antd';
import Guest from '../Guest';
import AIanswer from '../AIanswer';
import { fetchAIResponse } from '../../api/index';

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

  const addGuestContent = (content: string) => {
    setGuestContents([...guestContents, { content }]);
  };

  const addAIContent = (content: string) => {
    setAIContents([...aiContents, { content }]);
  };
  const onSearch = async (value: string) => {
    setGuestContents(prevContents => [...prevContents, { content: value }]);
    setSearchValue('');
    const aiResponse = await fetchAIResponse(value);
    setAIContents(prevContents => [...prevContents, { content: aiResponse }]);
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

  return (
    <div className="chat-body">
      <div className="chat-main">
        <div className="chat-content">
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
            onSearch={onSearch}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="chat-input-search"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatLLM;