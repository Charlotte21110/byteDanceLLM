import { useState } from 'react';
import "./index.css";
import "../../icon/font/iconfont.css";
import { Input } from 'antd';
import Guest from '../Guest';
import AIanswer from '../AIanswer';
import { fetchAIResponse } from '../../api/index';

const ChatLLM = () => {
  const { Search } = Input;
  const [guestContents, setGuestContents] = useState<string[]>([]);
  const [aiContents, setAIContents] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const onSearch = async (value: string) => {
    setGuestContents([...guestContents, value]);
    setSearchValue('');
    const aiResponse = await fetchAIResponse(value);
    setAIContents([...aiContents, aiResponse]);
  };

  return (
    <div className="chat-body">
      <div className="chat-main">
        <div className="chat-content">
          {/* 访客说的话 */}
          {/* <div className="chat-guest">
            <div className="chat-guest-text">
              Can you help me create a personalized morning routine that would
              help increase my productivity throughout the day? Start by asking me
              about my current habits and what activities energize me in the
              morning.
            </div>
          </div> */}
          {guestContents.map((content, index) => {
            return (
              <Guest key={index} content={content} />
            );
          })}
          {/* <div className="chat-ai">
            <div className="chat-ai-avator">
              <i
                className="iconfont icon-gpt"
                style={{ fontSize: "24px", color: "#fff" }}
              ></i>
            </div>
            <div className="chat-ai-answer">
              Absolutely! Let's start by discussing your current morning
              habits. What does a typical morning look like for you? Additionally,
              are there specific activities or practices that you find energizing
              or enjoyable in the morning?
            </div>
          </div> */}
          {/* TODO: AI https://www.npmjs.com/package/@coze/api */}
          {aiContents.map((content, index) => (
            <AIanswer key={index} content={content} />
          ))}
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