import type { Plugin } from '@hapi/hapi';
import type { PluginOptions } from '../../types';
import RepliesHandler from './handler';
import routes from './routes';
const replies: Plugin<PluginOptions> = {
  name: 'replies',
  register: async (server, { container }) => {
    const repliesHandler = new RepliesHandler(container);
    server.route(routes(repliesHandler));
  },
};

export default replies;
