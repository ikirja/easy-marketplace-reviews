import { Router } from 'express';
import mpReviews from './v1/mp-reviews';
import * as task from './v1/task';
import ai from './v1/easy-ai-router';

const router = Router();

router.get('/reviews/wildberries', mpReviews.wbReviews.getReviews);

router.get('/task', task.get);
router.post('/task', task.create);

router.get('/easy-ai/openrouter/ping', ai.openrouter.ping);
router.get('/easy-ai/openrouter/key', ai.openrouter.key);
router.post('/easy-ai/openrouter/chat', ai.openrouter.chat);
router.get('/easy-ai/openrouter/limits', ai.openrouter.limits);

export const apiV1 = router;
