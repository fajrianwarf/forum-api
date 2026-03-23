import createServer from './Infrastructures/http/createServer';
import container from './Infrastructures/container';
import Logger from './Infrastructures/logging/Logger';
(async () => {
  try {
    const server = await createServer(container);
    await server.start();
    Logger.info('server started', {
      uri: server.info.uri,
    });
  } catch (error) {
    Logger.error('failed to start server', error);
    process.exit(1);
  }
})();
