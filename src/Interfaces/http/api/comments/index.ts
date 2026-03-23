import type { Plugin } from '@hapi/hapi';
import type { PluginOptions } from '../../types';
import CommentsHandler from './handler';
import routes from './routes';
const comments: Plugin<PluginOptions> = {
  name: 'comments',
  register: async (server, { container }) => {
    const commentsHandler = new CommentsHandler(container);
    server.route(routes(commentsHandler));
  },
};

export default comments;
