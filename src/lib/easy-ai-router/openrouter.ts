import axios from 'axios';
import { Message } from '../../../types/easy-ai-router';

const HOST = process.env.SERVICE_EASY_AI_ROUTER_HOST || '';
const ACCESS_OPENROUTER = process.env.SERVICE_EASY_AI_ROUTER_ACCESS_OPENROUTER || '';
const urls = {
  ping: `${HOST}/openrouter/api/v1/ping`,
  key: `${HOST}/openrouter/api/v1/key`,
  chat: `${HOST}/openrouter/api/v1/chat`,
};
const headers = {
  'Content-Type': 'application/json',
  'Access-Openrouter': ACCESS_OPENROUTER,
};

export async function ping() {
  const response = await axios(urls.ping, { headers: headers });

  return response.data;
}

export async function key() {
  const response = await axios(urls.key, { headers: headers });

  return response.data;
}

export async function chat(messages: Message[]) {
  const response = await axios(urls.chat, {
    method: 'POST',
    headers: headers,
    data: messages,
  });

  return response.data;
}