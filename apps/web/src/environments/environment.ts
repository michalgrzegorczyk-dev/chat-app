export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  websocketUrl: 'http://localhost:3000'
};

// todo maybe
// export interface EnvironmentConfig {
//   apiUrl: string;
//   websocketUrl: string;
// }
//
// export const ENVIRONMENT_CONFIG = new InjectionToken<EnvironmentConfig>('environment.config');
//
// if (environment.production) {
//   enableProdMode();
// }
//
// platformBrowserDynamic([
//   { provide: ENVIRONMENT_CONFIG, useValue: environment }
// ]).bootstrapModule(AppModule)
//   .catch(err => console.error(err));
