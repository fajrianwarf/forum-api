import type { Plugin } from '@hapi/hapi';
import type { PluginOptions } from '../../types';
import ThreadsHandler from './handler';
import routes from './routes';
const threads: Plugin<PluginOptions> = {
  name: 'threads',
  register: async (server, { container }) => {
    const threadsHandler = new ThreadsHandler(container);
    server.route(routes(threadsHandler));
  },
};

export default threads;
