import "./index.css";
import "../../icon/font/iconfont.css";
import { Input } from 'antd';

const ChatLLM = () => {
  const { Search } = Input;

  const onSearch = (value: string) => console.log(value);

  return (
    <div className="chat-body">
      <div className="chat-main">
        <div className="chat-content">
          <div className="chat-guest">
            <div className="chat-guest-text">
              Can youhelpme create a personalized morning routine that would
              helpincrease myproductivity throughout theday?Start by asking me
              about my current habits and what activities energize me in the
              morning.
            </div>
          </div>
          <div className="chat-ai">
            <div className="chat-ai-avator">
              <i
                className="iconfont icon-gpt"
                style={{ fontSize: "24px", color: "#fff" }}
              ></i>
            </div>
            <div className="chat-ai-answer">
              Absolutely!Let's start by discussing your current morning
              habits.What does a typical morning look like
              foryou?Additionally,are there specific activities orpractices that
              youfind energizing or enjoyable in the morning?
            </div>
          </div>
        </div>
        <div className="chat-input">
          {/* <div className="chat-input-tips"></div> */}
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
