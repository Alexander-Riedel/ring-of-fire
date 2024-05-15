import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-a834c","appId":"1:331569999969:web:616b588715e53122953a20","storageBucket":"ring-of-fire-a834c.appspot.com","apiKey":"AIzaSyDf2Ot2yOQtPpYqi3G0HDB5qCle43QS4Vs","authDomain":"ring-of-fire-a834c.firebaseapp.com","messagingSenderId":"331569999969"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
