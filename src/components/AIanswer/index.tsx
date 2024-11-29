import './index.css'
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
        {content}
      </div>
    </div>
  )
}
export default AIanswer;