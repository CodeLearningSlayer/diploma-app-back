import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { initializeApp } from 'firebase/app';

const FirebaseProvider: Provider = {
  provide: 'FIREBASE_APP',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const firebaseConfig = {
      apiKey: configService.get('firebaseApiKey'),
      authDomain: configService.get('firebaseAuthDomain'),
      projectId: configService.get('firebaseProjectId'),
      storageBucket: configService.get('firebaseStorageBucket'),
      messagingSenderId: configService.get('firebaseMessagingSenderId'),
      appId: configService.get('firebaseAppId'),
    };

    return initializeApp({
      databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
      storageBucket: `${firebaseConfig.projectId}.appspot.com`,
    });
  },
};

@Module({
  imports: [ConfigModule],
  providers: [FirebaseProvider],
  exports: [FirebaseProvider],
})
export class FirebaseModule {}
