import { CozeAPI, COZE_COM_BASE_URL, ChatEventType, RoleType } from '@coze/api';

export interface Iquery {
  query: string; 
}

const client = new CozeAPI({
  token: 'pat_ACH4wCddJw87lXBDEGiMfih6uLfOX7EVjboLkkDWGBfxtsJSYbigYuv7lc6cadsP', // 改token
  allowPersonalAccessTokenInBrowser: true,
  baseURL: '/api',
  headers: new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer pat_ACH4wCddJw87lXBDEGiMfih6uLfOX7EVjboLkkDWGBfxtsJSYbigYuv7lc6cadsP', // 改token
  }),
});

// ... existing code ...
export const fetchAIResponse = async (
  input: string, 
  additionalMessages: { role: string; content: string; content_type: string }[],
  onData: (data: string) => void,
  signal?: AbortSignal
): Promise<void> => {
  try {
    const stream = await client.chat.stream({
      bot_id: '7463105894428704773',  // 改bot_id
      auto_save_history: true,
      user_id: '123',
      additional_messages: [
        ...additionalMessages,
        {
          role: RoleType.User,
          content: input,
          content_type: 'text',
        },
      ],
    }, { signal });

    for await (const part of stream) {
      if (signal?.aborted) {
        break;
      }
      if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
        onData(part.data.content);
      }
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
      onData('\n[已停止回复]');
    } else {
      console.error('Error fetching AI response:', error);
      onData('Error fetching AI response');
    }
  }
};