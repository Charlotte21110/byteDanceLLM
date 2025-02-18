import React from 'react';
import { Button } from 'antd';
import {
  ArrowUpOutlined,
  MessageOutlined,
  PictureOutlined,
  CloseOutlined,
  StopOutlined,
} from '@ant-design/icons';

interface ChatInputProps {
  searchValue: string;
  previewImage: string | null;
  isUploading: boolean;
  isResponding: boolean;
  onSearchValueChange: (value: string) => void;
  onSearch: (value: string) => void;
  onNewConversation: () => void;
  onSubmitPicture: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage: () => void;
  handleStop: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  searchValue,
  previewImage,
  isUploading,
  isResponding,
  onSearchValueChange,
  onSearch,
  onNewConversation,
  onSubmitPicture,
  clearImage,
  handleStop,
}) => {
  return (
    <div
      style={{
        border: '2px solid var(--border-color)',
        borderRadius: '10px',
        padding: '10px',
        position: 'relative',
        marginBottom: '3vh',
        height: 'auto',
        maxHeight: '30vh',
        backgroundColor: 'var(--input-bg)',
        boxShadow: '0 2px 4px var(--shadow-color)',
      }}
    >
      {previewImage && (
        <div
          style={{
            position: 'relative',
            width: '120px',
            padding: '8px',
            borderRadius: '4px',
            background: 'var(--secondary-bg)',
            marginBottom: '8px',
            border: '2px solid var(--border-color)',
          }}
        >
          <img
            src={previewImage}
            alt="preview"
            style={{
              opacity: isUploading ? 0.6 : 1,
              maxWidth: '100px',
              maxHeight: '100px',
              objectFit: 'contain',
            }}
          />
          {isUploading && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid var(--border-color)',
                  borderTop: '2px solid var(--accent-color)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              ></div>
            </div>
          )}
          <Button
            icon={<CloseOutlined />}
            size="small"
            onClick={clearImage}
            style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              borderRadius: '50%',
              padding: '4px',
              background: 'var(--bg-color)',
              boxShadow: '0 2px 4px var(--shadow-color)',
            }}
          />
        </div>
      )}
      <textarea
        placeholder="input search text"
        value={searchValue}
        onChange={(e) => {
          onSearchValueChange(e.target.value);
          const textarea = e.target;
          textarea.style.height = 'auto';
          textarea.style.height = `${Math.min(textarea.scrollHeight, (15 * window.innerHeight) / 100)}px`;
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSearch(searchValue);
          }
        }}
        rows={3}
        style={{
          color: 'var(--text-color)',
          backgroundColor: 'var(--input-bg)',
          border: 'none',
          width: '100%',
          maxHeight: '30vh',
          height: 'auto',
          resize: 'none',
          outline: 'none',
          marginBottom: '2vh',
          fontSize: '16px',
          fontWeight: 600,
          padding: '8px',
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = 'none';
          e.currentTarget.style.border = 'none';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button
            onClick={onNewConversation}
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            <MessageOutlined />
          </Button>
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}
        >
          <Button
            onClick={() => document.getElementById('file-input')?.click()}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: '#bfcad6',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              outline: 'none',
            }}
          >
            <PictureOutlined />
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={onSubmitPicture}
            style={{ display: 'none' }}
            id="file-input"
          />
          {isResponding ? (
            <Button
              onClick={handleStop}
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              <StopOutlined />
            </Button>
          ) : (
            <Button
              onClick={() => onSearch(searchValue)}
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              <ArrowUpOutlined />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
