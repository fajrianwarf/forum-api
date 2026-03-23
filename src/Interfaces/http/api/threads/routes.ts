import type ThreadsHandler from './handler';

const routes = (handler: ThreadsHandler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadhandler,
    options: {
      auth: 'forum_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThreadByIdHandler,
  },
]);

export default routes;
