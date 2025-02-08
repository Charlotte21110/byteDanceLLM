import { CozeAPI, COZE_COM_BASE_URL, ChatEventType, RoleType } from '@coze/api';
import axios from 'axios';
import { AdditionalMessage } from '../types/additionalMessage';

export interface Iquery {
  query: string; 
}
const token = 'pat_7tXvKZGD1qMm4tLBszbR3Lh8h9l43lvQTbLp4INC41JqsaSkDCY8XVjFPOhbSsZd'; // 改token
const botId =  '7468952453728239624';  // 改bot_id 

const client = new CozeAPI({
  token: token,
  allowPersonalAccessTokenInBrowser: true,
  baseURL: '/api',
  headers: new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, 
  }),
});
export const fetchAIResponse = async (
  input: string, 
  additionalMessages: AdditionalMessage[],
  onData: (data: string) => void,
  messageType: string,
  signal?: AbortSignal,
): Promise<void> => {
  console.log('marisa additionalMessages:', additionalMessages, 'input:', input, 'messageType:', messageType);
  const contentTypeMap: { [key: string] : string} = {
    text: 'text',
    image: 'object_string',
  }
  const contentType = contentTypeMap[messageType] || 'text';
  try {
    // const stream = await client.chat.stream({
    //   bot_id: botId,
    //   auto_save_history: true,
    //   user_id: '123',
    //   additional_messages: [
    //     ...additionalMessages,
    //     {
    //       role: RoleType.User,
    //       content: input,
    //       content_type: contentType,
    //     },
    //   ],
    // }, { signal });

    // for await (const part of stream) {
    //   if (signal?.aborted) {
    //     break;
    //   }
    //   if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
    //     onData(part.data.content);
    //   }
    // }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
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
    const response = await axios.post(`${COZE_COM_BASE_URL}/v1/files/upload`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    });
    if (response.data.code === 0) {
      return response.data.data;
    } else {
      throw new Error(response.data.data)
    }
  } catch (error) {
    console.error('上传文件发生错误：', error);
    throw error;
  }
}
