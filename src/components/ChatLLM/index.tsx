import { useEffect, useState, useRef } from 'react';
import "./index.css";
import "../../icon/font/iconfont.css";
import { Input, Button, Layout } from 'antd';
import Guest from '../Guest';
import AIanswer from '../AIanswer';
import { fetchAIResponse, uploadFile } from '../../api/index';
import { ArrowUpOutlined, StopOutlined, CheckOutlined, CopyOutlined,MessageOutlined, PictureOutlined, CloseOutlined } from '@ant-design/icons';
import HistorySidebar from '../Sidebar';

const { Sider, Content } = Layout;

export interface Content {
  content: string;
  type?: string;
  duration?: number; // Added duration to measure reply time (in ms)
  isCopied: boolean;
  image?: string; 
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
  // 修改 history 类型为二维数组
  const [history, setHistory] = useState<Content[][]>(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      // 兼容旧数据结构（一维数组转二维）
      return Array.isArray(parsed[0]) ? parsed : [parsed];
    }
    return [];
  });
  
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
      setIsResponding(false);
    }
  };

  const onSearch = async (value: string) => {
    if (!value.trim() && !previewImage) return;

    setGuestContents(prevContents => [...prevContents, { 
      content: value, 
      isCopied: false,
      image: previewImage || undefined 
    }]);
    setSearchValue('');
    setPreviewImage(null); // 清除预览图片
    let aiContent = '';
    // Add an empty AI answer entry (will be updated with streamed content)
    setAIContents(prevContents => [...prevContents, { content: aiContent, isCopied: false }]);

    const controller = new AbortController();
    setAbortController(controller);
    setIsResponding(true);

    // Record start time for timing the AI reply
    const startTime = Date.now();

    // Prepare additional messages from previous conversation
    const additionalMessages = combinedContents.map(content => ({
      role: content.type === 'guest' ? 'user' : 'assistant',
      content: content.content,
      content_type: 'text', // TODO: 需要改成多模态内容
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
      // Compute the reply duration (in milliseconds)
      const answerDuration = Date.now() - startTime;
      // Update the last AI answer with the duration so AIanswer can display it
      setAIContents(prevContents => {
        const newContents = [...prevContents];
        if (newContents.length > 0) {
          newContents[newContents.length - 1] = {
            ...newContents[newContents.length - 1],
            duration: answerDuration,
            isCopied: false
          };
        }
        return newContents;
      });
    }

    // Adjust textarea height
    const textarea = document.querySelector('.chat-input-search') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${Math.min(textarea.scrollHeight, 15 * window.innerHeight / 100)}px`; // New height (max 15vh)
    }
  };
  const onSubmitPicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      // 上传文件，包括图片在内，字节服务器保存三个月有效
      // TODO: 提交时，如果有图片，需要将内容和图片的url一起提交
      try {
        const fileData = await uploadFile(file);
        console.log('marisa 上传得到的结果', fileData);
        const fileId = fileData.Id;
        console.log('marisa 上传得到的文件ID', fileId);
      } catch (error) {
        console.error('上传文件发生错误：', error);
      }
    }
  };
  const handleCopy = (index: number, content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setCombinedContents(prevContents => {
          const newContents = [...prevContents];
          newContents[index] = { ...newContents[index], isCopied: true };
          return newContents;
        });
        setTimeout(() => {
          setCombinedContents(prevContents => {
            const newContents = [...prevContents];
            newContents[index] = { ...newContents[index], isCopied: false };
            return newContents;
          });
        }, 5000);
      })
      .catch((err) => {
        console.error("Copy failed:", err);
      });
  };

  const clearImage = () => {
    setPreviewImage(null);
    const input = document.getElementById('file-input') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  useEffect(() => {
    const combined: Content[] = [];
    for (let i = 0; i < Math.max(guestContents.length, aiContents.length); i++) {
      if (guestContents[i]) {
        combined.push({ ...guestContents[i], type: 'guest' });
      }
      if (aiContents[i]) combined.push({ ...aiContents[i], type: 'ai', isCopied: false });
    }
    console.log(combined);
    setCombinedContents(combined);
  }, [guestContents, aiContents]);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [combinedContents]);
  // 当 combinedContents 变化时自动保存到当前对话
  useEffect(() => {
    if (selectedHistoryIndex !== null) {
      setHistory(prevHistory => {
        const newHistory = [...prevHistory];
        newHistory[selectedHistoryIndex] = combinedContents;
        localStorage.setItem('chatHistory', JSON.stringify(newHistory)); // 同步到 LocalStorage
        return newHistory;
      });
    }
  }, [combinedContents, selectedHistoryIndex]);

  const restoreChatContent = (restoredContent: Content[], index: number) => {
    setGuestContents(restoredContent.filter(item => item.type === 'guest'));
    setAIContents(restoredContent.filter(item => item.type === 'ai'));
    setSelectedHistoryIndex(index); // 标记当前正在编辑的对话
  };

  const updateHistory = (updatedHistory: Content[][]) => {
    setHistory(updatedHistory);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory)); // 更新本地存储
  };
  const saveCurrentConversation = () => {
    // 注释或调整此判断以允许保存空对话
    // if (combinedContents.length === 0) return;
    
    setHistory(prev => {
      const newHistory = selectedHistoryIndex !== null
        ? prev.map((conv, i) => i === selectedHistoryIndex ? combinedContents : conv)
        : [...prev, combinedContents];
      
      localStorage.setItem('chatHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  
    // 重置对话状态
    setGuestContents([]);
    setAIContents([]);
    setCombinedContents([]);
    setSelectedHistoryIndex(null);
  };

  const onNewConversation = () => {
    // 保存当前对话到历史记录
    saveCurrentConversation();
    // 清空输入框和相关状态以开始新对话
    setSearchValue('');
    
  };
  

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={300} style={{ background: '#212121' }}>
        <HistorySidebar
          history={history}
          setSelectedHistoryIndex={setSelectedHistoryIndex}
          restoreChatContent={restoreChatContent}
          updateHistory={updateHistory} // 传递更新历史记录的函数
        />
      </Sider>
      <Layout>
        <Content>
          <div className="chat-body">
            <div className="chat-main">
              <div className="chat-content" ref={chatContentRef}>
                {combinedContents.map((content, index) => {
                  if (content.type === 'guest') {
                    return (
                <div key={index}>
                  <Guest content={content.content} />
                  {content.image && (
                    <div className="guest-image">
                      <img src={content.image} alt="uploaded" />
                    </div>
                  )}
                </div>
              );
                  } else {
                    return (
                      <div key={index}>
                        <AIanswer content={content.content} duration={content.duration} />
                        {content.duration !== undefined && (
                          <div
                            className="chat-ai-footer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginTop: '8px',
                              marginLeft: '30px',
                              marginRight: '15px',
                            }}
                          >
                            <CheckOutlined />
                            <span style={{ marginLeft: '4px', marginRight: '16px' }}>
                              {(content.duration / 1000).toFixed(2)}s
                            </span>
                            <CopyOutlined
                              onClick={() => handleCopy(index, content.content)}
                              style={{ cursor: 'pointer' }}
                            />
                            <span style={{ marginLeft: '8px' }}>
                              {content.isCopied ? "已复制" : ""}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }
                })}
              </div>
              <div className="chat-input">
                {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="preview" />
              <Button 
                className="clear-image" 
                icon={<CloseOutlined />} 
                size="small"
                onClick={clearImage}
              />
            </div>
          )}
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
          <div className="chat-input-button">
            <Button onClick={() => document.getElementById('file-input')?.click()}>
              <PictureOutlined />
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={onSubmitPicture}
              style={{ display: 'none' }}
              id="file-input"
            />
                  <Button onClick={() => onSearch(searchValue)}>
                    <ArrowUpOutlined />
                  </Button>
                <Button onClick={onNewConversation} style={{ position: 'absolute', left: '5px', bottom: '5px' }}>
                  <MessageOutlined />
                </Button>
                </div>
          {isResponding && (
                  <Button className="stop-button" onClick={handleStop}>
                    <StopOutlined />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ChatLLM;