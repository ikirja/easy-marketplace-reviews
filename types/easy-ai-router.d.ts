export type Message = {
  role: Role;
  content: string;
};

export const enum Role {
  System = 'system',
  Assistant = 'assistant',
  User = 'user',
}

export type OpenrouterChatResponse = {
  id: string;
  choices: Choice[];
};

export type Choice = {
  message: Message;
};
