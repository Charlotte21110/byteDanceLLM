import { useState, useEffect } from 'react';
import './App.css';
import ChatLLM from './components/ChatLLM';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    // 设置主题
    const setTheme = (dark: boolean) => {
      // 设置 HTML 和 body 的 data-theme 属性
      document.documentElement.setAttribute(
        'data-theme',
        dark ? 'dark' : 'light'
      );
      document.body.setAttribute('data-theme', dark ? 'dark' : 'light');

      // 设置 CSS 变量
      const root = document.documentElement;
      if (dark) {
        root.style.setProperty('--bg-color', '#1a1a1a');
        root.style.setProperty('--text-color', '#ffffff');
        root.style.setProperty('--secondary-bg', '#2d2d2d');
        root.style.setProperty('--border-color', '#404040');
      } else {
        root.style.setProperty('--bg-color', '#ffffff');
        root.style.setProperty('--text-color', '#333333');
        root.style.setProperty('--secondary-bg', '#f5f5f5');
        root.style.setProperty('--border-color', '#e0e0e0');
      }

      // 设置类名
      document.body.className = dark ? 'dark-theme' : 'light-theme';

      // 保存设置
      localStorage.setItem('theme', dark ? 'dark' : 'light');

      // 强制更新所有元素的背景色和文字颜色
      const elements = document.querySelectorAll('*');
      elements.forEach((el) => {
        const element = el as HTMLElement;
        element.style.transition =
          'background-color 0.3s ease, color 0.3s ease';
      });
    };

    setTheme(isDark);

    // 添加 MutationObserver 来监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          setTheme(isDark);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div className="app-container">
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        type="button"
        aria-label="切换深浅色模式"
      >
        {/* 在当前是暗色模式时显示月亮，在当前是亮色模式时显示太阳 */}
        {isDark ? '🌙' : '☀️'}
      </button>
      <ChatLLM />
    </div>
  );
}

export default App;
