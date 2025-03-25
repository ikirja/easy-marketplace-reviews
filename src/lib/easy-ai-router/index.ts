import * as openrouter from './openrouter';

export const OpenrouterLimits = {
  FreeLimit: Number(process.env.SERVICE_EASY_AI_ROUTER_OPENROUTER_LIMIT) || 180,
};

export default {
  openrouter,
};
