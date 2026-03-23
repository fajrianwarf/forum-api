declare module 'instances-container' {
  interface ContainerDependency {
    concrete?: unknown;
    internal?: string;
    name?: string;
  }

  interface Registration {
    key: string;
    Class: new (...args: unknown[]) => unknown;
    parameter?: {
      injectType?: string;
      dependencies?: ContainerDependency[];
    };
  }

  interface Container {
    register(items: Registration[]): void;
    getInstance<T = unknown>(key: string): T;
  }

  export function createContainer(): Container;
}
