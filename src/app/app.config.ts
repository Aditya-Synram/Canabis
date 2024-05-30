import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JwtModule } from '@auth0/angular-jwt';
import * as $ from 'jquery';

export function tokenGetter() {
  return localStorage.getItem("access_token");
}
export const appConfig: ApplicationConfig = {
  
  providers: [provideRouter(routes), provideAnimationsAsync(),provideHttpClient(),

    importProvidersFrom(
      JwtModule.forRoot({
          config: {
              tokenGetter: tokenGetter,
          },
      }),
  ),
  provideHttpClient(
      withInterceptorsFromDi()
  ),
  ]
};
