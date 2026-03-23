import Hapi from '@hapi/hapi';
import type { Request, ResponseToolkit, Server } from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import ClientError from '../../Commons/exceptions/ClientError';
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator';
import users from '../../Interfaces/http/api/users';
import authentications from '../../Interfaces/http/api/authentications';
import threads from '../../Interfaces/http/api/threads';
import comments from '../../Interfaces/http/api/comments';
import replies from '../../Interfaces/http/api/replies';
import config from '../config';
import Logger from '../logging/Logger';
import type { DependencyContainer } from '../../Interfaces/http/types';

interface JwtArtifacts {
  decoded: {
    payload: {
      id: string;
    };
  };
}

interface ServerError extends Error {
  isServer?: boolean;
}

const createServer = async (container: DependencyContainer): Promise<Server> => {
  const server = Hapi.server({
    host: config.server.host,
    port: config.server.port,
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('forum_jwt', 'jwt', {
    keys: config.auth.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.auth.accessTokenAge,
    },
    validate: (artifacts: JwtArtifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
    {
      plugin: comments,
      options: { container },
    },
    {
      plugin: replies,
      options: { container },
    },
  ]);

  const sanitizePayload = (payload: unknown): unknown => {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return payload;
    }

    const clone = { ...(payload as Record<string, unknown>) };

    if ('password' in clone) {
      clone.password = '[REDACTED]';
    }

    if ('refreshToken' in clone) {
      clone.refreshToken = '[REDACTED]';
    }

    return clone;
  };

  server.ext('onPreResponse', (request: Request, h: ResponseToolkit) => {
    const { response } = request;

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response) as ServerError;
      const requestMeta = {
        requestId: request.info?.id,
        method: request.method,
        path: request.path,
        params: request.params,
        payload: sanitizePayload(request.payload),
      };

      if (translatedError instanceof ClientError) {
        Logger.warn('client error response', {
          ...requestMeta,
          errorMessage: translatedError.message,
          statusCode: translatedError.statusCode,
        });

        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      if (!translatedError.isServer) {
        return h.continue;
      }

      Logger.error('unhandled server error response', response, requestMeta);

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  return server;
};

export default createServer;
