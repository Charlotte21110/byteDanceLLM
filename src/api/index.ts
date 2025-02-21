import {
  CozeAPI,
  COZE_COM_BASE_URL,
  ChatEventType,
  RoleType,
  ContentType,
} from '@coze/api';
import axios from 'axios';
import { AdditionalMessage } from '../types/additionalMessage';

export interface Iquery {
  query: string;
}
const token =
  import.meta.env?.VITE_TOKEN ||
  window.__RUNTIME_CONFIG__?.REACT_APP_TOKEN ||
  '';
const botId =
  import.meta.env?.VITE_BOT_ID ||
  window.__RUNTIME_CONFIG__?.REACT_APP_BOT_ID ||
  '';

const client = new CozeAPI({
  token: token,
  allowPersonalAccessTokenInBrowser: true,
  baseURL: '/api',
  headers: new Headers({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }),
});
export const fetchAIResponse = async (
  input: string,
  additionalMessages: AdditionalMessage[],
  onData: (data: string) => void,
  messageType: string,
  signal?: AbortSignal
): Promise<void> => {
  const contentTypeMap: { [key: string]: string } = {
    text: 'text',
    image: 'object_string',
  };
  const contentType = contentTypeMap[messageType] || 'text';

  try {
    // 如果不使用mock数据，就打开这一段代码，底下那段注释掉

    /** 调api开始 */

    const stream = await client.chat.stream(
      {
        bot_id: botId,
        auto_save_history: true,
        user_id: '123',
        additional_messages: [
          ...additionalMessages,
          {
            role: RoleType.User,
            content: input,
            content_type: contentType as ContentType,
          },
        ],
      },
      { signal }
    );

    /** 调api结束 */

    /** 读mock数据开始（还有一点问题服了） */

    // const mockResponse = await fetch('/src/mock/response.txt');
    // const text = await mockResponse.text();
    // const events = text.split('\n').filter(line => line.trim());

    // // 创建一个异步迭代器来模拟流式响应
    // const stream = {
    //   [Symbol.asyncIterator]() {
    //     let index = 0;
    //     return {
    //       async next(): Promise<IteratorResult<{ event: string; data: { content: string } }, void>> {
    //         if (index >= events.length) {
    //           return { done: true, value: undefined };
    //         }

    //         const event = events[index];
    //         index++;

    //         if (event.startsWith('event:')) {
    //           const eventType = event.split(':')[1].trim();
    //           const dataLine = events[index];
    //           index++;

    //           if (dataLine && dataLine.startsWith('data:')) {
    //             const data = JSON.parse(dataLine.slice(5));
    //             return {
    //               value: {
    //                 event: eventType,
    //                 data: data
    //               },
    //               done: false
    //             };
    //           }
    //         }

    //         return this.next();
    //       }
    //     };
    //   }

    // };

    /** 读mock数据结束 */
    const followUps: string[] = [];
    for await (const part of stream) {
      if (signal?.aborted) {
        break;
      }
      if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
        onData(part.data.content);
      }
      if (part.event === ChatEventType.CONVERSATION_MESSAGE_COMPLETED) {
        // 拿回复结束的时候的时候紧接着的建议
        if ('type' in part.data && part.data.type === 'follow_up') {
          onData(
            JSON.stringify({
              type: 'suggestions',
              suggestions: [...followUps, part.data.content],
            })
          );
          followUps.push(part.data.content);
        }
      }
    }
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'AbortError'
    ) {
      onData('\n[已停止回复]');
    } else {
      console.error('Error fetching AI response:', error);
      onData('Error fetching AI response');
    }
  }
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      `${COZE_COM_BASE_URL}/v1/files/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    if (response.data.code === 0) {
      return response.data.data;
    } else {
      throw new Error(response.data.data);
    }
  } catch (error) {
    console.error('上传文件发生错误：', error);
    throw error;
  }
};
