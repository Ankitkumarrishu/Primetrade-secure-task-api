const express = require('express');
const authRoutes = require('./auth.routes');
const taskRoutes = require('./task.routes');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/tasks',
    route: taskRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
