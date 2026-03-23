declare module '@hapi/hapi' {
  export interface Request {
    payload: unknown;
    response: unknown;
    info: {
      id: string;
    };
    method: string;
    path: string;
    auth: {
      credentials: unknown;
    };
    params: Record<string, string>;
  }

  export interface ResponseObject {
    code(statusCode: number): ResponseObject;
  }

  export interface ResponseToolkit {
    response(value: unknown): ResponseObject;
    continue: unknown;
  }

  export interface ServerInjectResponse {
    statusCode: number;
    payload: string;
  }

  export interface Server {
    info: {
      uri: string;
    };
    start(): Promise<void>;
    inject(options: unknown): Promise<ServerInjectResponse>;
    register(plugins: unknown): Promise<void>;
    route(routes: unknown): void;
    ext(type: string, method: (request: Request, h: ResponseToolkit) => unknown): void;
    auth: {
      strategy(name: string, scheme: string, options: unknown): void;
    };
  }

  export interface Plugin<T = unknown> {
    name: string;
    register(server: Server, options: T): Promise<void>;
  }

  interface HapiStatic {
    server(options: {
      host: string;
      port: number;
    }): Server;
  }

  const Hapi: HapiStatic;

  export = Hapi;
}
