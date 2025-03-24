import { Router } from 'express';
import mpReviews from './v1/mp-reviews';
import * as task from './v1/task';

const router = Router();

router.get('/reviews/wildberries', mpReviews.wbReviews.getReviews);
router.get('/task', task.get);
router.post('/task', task.create);

export const apiV1 = router;
