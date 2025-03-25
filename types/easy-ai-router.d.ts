export type Message = {
  role: Role;
  content: string;
}

export enum Role {
  System = 'system',
  Assistant = 'assistant',
  User = 'user'
}