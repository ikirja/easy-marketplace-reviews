export type Message = {
  role: Role;
  content: string;
};

export const enum Role {
  System = 'system',
  Assistant = 'assistant',
  User = 'user',
}

export const enum OpenrouterLimits {
  FreeLimit = Number(process.env.SERVICE_EASY_AI_ROUTER_OPENROUTER_LIMIT) ||
    180,
}

export type OpenrouterChatResponse = {
  id: string;
  choices: Choice[];
};

export type Choice = {
  message: Message;
};
