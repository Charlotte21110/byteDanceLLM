import { CozeAPI, COZE_COM_BASE_URL, ChatEventType, RoleType } from '@coze/api';

export interface Iquery {
  query: string; 
}

const client = new CozeAPI({
  token: 'pat_UshPqQGJIszHVJ848mIDH3inDDbov9mlDOh7uXUtq5MjVKwKMGG3BkyZZ6ChpieG',
  allowPersonalAccessTokenInBrowser: true,
  baseURL: COZE_COM_BASE_URL,
  headers: new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer pat_UshPqQGJIszHVJ848mIDH3inDDbov9mlDOh7uXUtq5MjVKwKMGG3BkyZZ6ChpieG',
  }),
});

export const fetchAIResponse = async (input: string): Promise<string> => {
  try {
    const stream = await client.chat.stream({
      bot_id: '7443420280162746386', 
      auto_save_history: true,
      user_id: '123',
      additional_messages: [{
        role: RoleType.User,
        content: input,
        content_type: 'text',
      }],
    });

    let aiResponse = '';

    for await (const part of stream) {
      if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
        aiResponse += part.data.content;
      }
    }

    return aiResponse;
  } catch (error) {
    console.error('Error fetching AI response:', error);
    return 'Error fetching AI response';
  }
};