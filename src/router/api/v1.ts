import { Router } from 'express';
import mpReviews from './v1/mp-reviews';
import * as task from './v1/task';
import ai from './v1/easy-ai-router';

const router = Router();

router.get('/reviews/wildberries', mpReviews.wbReviews.getReviews);
router.get('/reviews/summs', mpReviews.wbReviews.getReviewSumms);

router.get('/task', task.get);
router.post('/task', task.create);

router.get('/easy-ai/openrouter/limits', ai.openrouter.limits);

export const apiV1 = router;
