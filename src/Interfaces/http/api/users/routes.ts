import type UsersHandler from './handler';

const routes = (handler: UsersHandler) => ([
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
]);

export default routes;
