import './index.css';

interface GuestProps {
  content: string;
}
const Guest = (prop: GuestProps) => {
  const { content } = prop;
  return (
    <div className="chat-guest">
      <div className="chat-guest-text">
        输出的内容：
        {content}
      </div>
    </div>
  );
}
export default Guest;