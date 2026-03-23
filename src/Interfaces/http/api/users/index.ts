import type { Plugin } from '@hapi/hapi';
import type { PluginOptions } from '../../types';
import UsersHandler from './handler';
import routes from './routes';
const users: Plugin<PluginOptions> = {
  name: 'users',
  register: async (server, { container }) => {
    const usersHandler = new UsersHandler(container);
    server.route(routes(usersHandler));
  },
};

export default users;
