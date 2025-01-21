import { CozeAPI, COZE_COM_BASE_URL, ChatEventType, RoleType } from '@coze/api';

export interface Iquery {
  query: string; 
}

const client = new CozeAPI({
  token: 'pat_eMqLhvhdzGu3WIOqGHbKxCUAY50cjbFVcQDWZLwlMcEa2IMnnTGuxrvvc1GGHHvt',
  allowPersonalAccessTokenInBrowser: true,
  baseURL: '/api',
  headers: new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer pat_eMqLhvhdzGu3WIOqGHbKxCUAY50cjbFVcQDWZLwlMcEa2IMnnTGuxrvvc1GGHHvt',
  }),
});

// ... existing code ...
export const fetchAIResponse = async (
  input: string, 
  onData: (data: string) => void,
  signal?: AbortSignal
): Promise<void> => {
  try {
    const stream = await client.chat.stream({
      bot_id: '7460806738728648720', 
      auto_save_history: true,
      user_id: '123',
      additional_messages: [{
        role: RoleType.User,
        content: input,
        content_type: 'text',
      }],
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