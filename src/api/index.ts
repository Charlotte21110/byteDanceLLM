import { CozeAPI, COZE_COM_BASE_URL, ChatStatus, RoleType } from '@coze/api';

export interface Iquery {
  query: string; // ?
}
// enum RoleType {
//   User = 'User',
//   Bot = 'Bot'
// }

const client = new CozeAPI({
  token: 'your_pat_token', // 替换为你的 Personal Access Token
  baseURL: COZE_COM_BASE_URL,
});

export const fetchAIResponse = async (input: string): Promise<string> => {
  const response = await client.chat.createAndPoll({
    bot_id: 'your_bot_id', // 替换为你的 bot_id
    additional_messages: [{
      role: RoleType.User,
      content: input,
      content_type: 'text',
    }],
  });

  if (response.chat.status === ChatStatus.COMPLETED) {
    const aiMessage = response.messages?.find(msg => msg.role === RoleType.Bot);
    return aiMessage ? aiMessage.content : 'No response from AI';
  }

  return 'AI response is not completed';
};