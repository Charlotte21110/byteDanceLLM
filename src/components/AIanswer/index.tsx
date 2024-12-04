import "./index.css";
import ReactMarkdown from 'react-markdown';
interface AIanswerProps {
  content: string;
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
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};
export default AIanswer;
