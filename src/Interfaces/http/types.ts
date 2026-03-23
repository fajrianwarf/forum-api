export interface DependencyContainer {
  getInstance<T = unknown>(key: string): T;
}

export interface PluginOptions {
  container: DependencyContainer;
}

export interface AuthCredentials {
  id: string;
}
