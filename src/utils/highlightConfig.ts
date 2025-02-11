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
  'plaintext',
];

languages.forEach(async (lang) => {
  try {
    const module = await import(`highlight.js/lib/languages/${lang}`);
    hljs.registerLanguage(lang, module.default);
  } catch {
    console.warn(`Failed to load language: ${lang}`);
  }
});

try {
  import('highlightjs-vue').then((module) => {
    hljs.registerLanguage('vue', module.default);
  });
} catch {
  console.warn('Vue syntax highlighting not available');
}

export default hljs;
