import './index.css';
import { useState, useEffect } from 'react';

interface GuestProps {
  content: string;
}
const Guest = (prop: GuestProps) => {
  const { content } = prop;
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div className={`chat-guest ${fadeIn ? 'fade-in' : ''}`}>
      <div className="chat-guest-text">
        {content}
      </div>
    </div>
  );
}
export default Guest;