// import { Injectable } from '@nestjs/common';
// import { google } from 'googleapis';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class GoogleService {
//   private oauth2Client;

//   constructor(private config: ConfigService) {
//     this.oauth2Client = new google.auth.OAuth2(
//       config.get<string>('GOOGLE_CLIENT_ID'),
//       config.get<string>('GOOGLE_CLIENT_SECRET'),
//       config.get<string>('GOOGLE_CALLBACK_URL'),
//     );
//   }

//   async exchangeCode(code: string) {
//     const { tokens } = await this.oauth2Client.getToken(code);
//     this.oauth2Client.setCredentials(tokens);
//     const oauth2 = google.oauth2({ auth: this.oauth2Client, version: 'v2' });
//     const { data } = await oauth2.userinfo.get();
//     return {
//       profile: { id: data.id, email: data.email, name: data.name, picture: data.picture },
//       tokens,
//     };
//   }
// }

// src/modules/common/services/google/google.service.ts
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { Credentials } from 'google-auth-library';

type OAuth2ClientType = InstanceType<typeof google.auth.OAuth2>;

interface GoogleExchangeResult {
  profile: { id: string; email: string; name: string; picture?: string };
  tokens: Credentials;
}

@Injectable()
export class GoogleService {
  private oauth2Client: OAuth2ClientType;

  constructor(private config: ConfigService) {
    this.oauth2Client = new google.auth.OAuth2(
      config.get<string>('GOOGLE_CLIENT_ID'),
      config.get<string>('GOOGLE_CLIENT_SECRET'),
      config.get<string>('GOOGLE_CALLBACK_URL'),
    );
  }

  generateAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['email', 'profile'],
      prompt: 'consent',
    });
  }

  async exchangeCode(code: string): Promise<GoogleExchangeResult> {
  const { tokens } = await this.oauth2Client.getToken(code);
  this.oauth2Client.setCredentials(tokens);
  const oauth2 = google.oauth2({
    auth: this.oauth2Client,
    version: 'v2',
  });
  const { data } = await oauth2.userinfo.get();

  return {
    profile: {
      id: data.id!,
      email: data.email!,
      name: data.name!,
      picture: data.picture,
    },
    tokens,
  };
}

}

