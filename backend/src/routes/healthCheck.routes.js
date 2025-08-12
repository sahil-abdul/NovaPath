import { Router } from 'express';
import { healthcheck } from "../controler/healthCheck.controller.js"

const router = Router();

router.route('/').get(healthcheck);

export default router