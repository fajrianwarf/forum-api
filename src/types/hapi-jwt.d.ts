declare module '@hapi/jwt' {
  interface JwtTokenArtifacts<TPayload = Record<string, unknown>> {
    decoded: {
      payload: TPayload;
    };
  }

  interface JwtTokenApi {
    generate(payload: unknown, key: string): Promise<string> | string;
    decode<TPayload = Record<string, unknown>>(token: string): JwtTokenArtifacts<TPayload>;
    verify<TPayload = Record<string, unknown>>(
      artifacts: JwtTokenArtifacts<TPayload>,
      key: string,
    ): void;
  }

  interface JwtPlugin {
    token: JwtTokenApi;
  }

  const jwtPlugin: JwtPlugin;

  export default jwtPlugin;
}
