export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  websocketUrl: 'http://localhost:3000'
};

// 1. konfiguracja powinna byc zrobiona per apke (powinna znalezc sie w aplikacji)
// minusem stosowania envow per srodowisko jest to, ze musisz generowac osobny build (zbudowac apke per srodowisko)
// z punktu widzenia testera testujesz inna aplikacje (inny build)
// zamiast tego mozna to ograc zmiennymi konfiguracyjnymi (replace token na ci/cd, albo plikiem config.js zaciaganym w html)




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
