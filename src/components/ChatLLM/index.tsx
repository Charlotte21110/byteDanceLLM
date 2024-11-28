import React, { useState } from 'react';
import "./index.css";
import "../../icon/font/iconfont.css";
import { Input } from 'antd';
import Guest from '../Guest';

const ChatLLM = () => {
  const { Search } = Input;

  const onSearch = (value: string) => console.log(value);
  const [guestContent, setGuestContent] = useState<string>('');

  return (
    <div className="chat-body">
      <div className="chat-main">
        <div className="chat-content">            
          {/* 访客说的话 */}
          <div className="chat-guest">
            <div className="chat-guest-text">
              Can you help me create a personalized morning routine that would
              help increase my productivity throughout the day? Start by asking me
              about my current habits and what activities energize me in the
              morning.
            </div>
          </div>
          <Guest content={guestContent} />
          <div className="chat-ai">
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
          </div>
        </div>
        <div className="chat-input">
          <Search 
            placeholder="input search text" 
            onSearch={onSearch} 
            className="chat-input-search"
            // style={{ width: '100%' }} 
          />
        </div>
      </div>
    </div>
  );
};

export default ChatLLM;