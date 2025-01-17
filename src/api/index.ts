import { CozeAPI, COZE_COM_BASE_URL, ChatEventType, RoleType } from '@coze/api';

export interface Iquery {
  query: string; 
}

const client = new CozeAPI({
  token: 'pat_UseoDrO2DOIASw4wrOJLV3tXj2xPG9kSi21hUT2Dct1BnpKnHAq9K8plW9F0phjB',
  allowPersonalAccessTokenInBrowser: true,
  baseURL: COZE_COM_BASE_URL,
  headers: new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer pat_UseoDrO2DOIASw4wrOJLV3tXj2xPG9kSi21hUT2Dct1BnpKnHAq9K8plW9F0phjB',
  }),
});

export const fetchAIResponse = async (input: string, onData: (data: string) => void): Promise<void> => {
  try {
    const stream = await client.chat.stream({
      bot_id: '7460784970463395856', 
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