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

export const fetchAIResponse = async (input: string, onData: (data: string) => void): Promise<void> => {
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
    });


    for await (const part of stream) {
      if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
        onData(part.data.content);
      }
    }

  } catch (error) {
    console.error('Error fetching AI response:', error);
    onData('Error fetching AI response');
  }
};