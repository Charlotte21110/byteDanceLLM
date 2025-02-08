import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';

// 注册所有你需要的语言
const languages = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'css',
  'xml',
  'sql',
  'vue', 
  'plaintext'
];

languages.forEach(lang => {
  try {
    require(`highlight.js/lib/languages/${lang}`);
  } catch (e) {
    console.warn(`Failed to load language: ${lang}`);
  }
});

try {
  require('highlightjs-vue');
} catch (e) {
  console.warn('Vue syntax highlighting not available');
}

export default hljs;