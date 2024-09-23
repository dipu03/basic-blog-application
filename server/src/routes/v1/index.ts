import { Router } from 'express';
const router = Router();

import commonRoutes from './common';
import userAuthRoutes from './user';

const defaultRoutes = [...commonRoutes, ...userAuthRoutes];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
