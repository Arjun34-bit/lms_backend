

// // src/modules/common/services/google/google.service.ts
// import { Injectable } from '@nestjs/common';
// import { google } from 'googleapis';
// import { ConfigService } from '@nestjs/config';
// import { Credentials } from 'google-auth-library';

// type OAuth2ClientType = InstanceType<typeof google.auth.OAuth2>;

// interface GoogleExchangeResult {
//   profile: { id: string; email: string; name: string; picture?: string };
//   tokens: Credentials;
// }

// @Injectable()
// export class GoogleService {
//   private oauth2Client: OAuth2ClientType;

//   constructor(private config: ConfigService) {
//  this.oauth2Client = new google.auth.OAuth2(
//   config.get('GOOGLE_CLIENT_ID'),
//   config.get('GOOGLE_CLIENT_SECRET'),
//   config.get('GOOGLE_CALLBACK_URL')
// );

//   }

//   generateAuthUrl(): string {
//     return this.oauth2Client.generateAuthUrl({
//       access_type: 'offline',
//       scope: ['email', 'profile'],
//       prompt: 'consent',
//     });
//   }

//   async exchangeCode(code: string): Promise<GoogleExchangeResult> {
//   const { tokens } = await this.oauth2Client.getToken(code);
//   this.oauth2Client.setCredentials(tokens);
//   const oauth2 = google.oauth2({
//     auth: this.oauth2Client,
//     version: 'v2',
//   });
//   const { data } = await oauth2.userinfo.get();

//   return {
//     profile: {
//       id: data.id!,
//       email: data.email!,
//       name: data.name!,
//       picture: data.picture,
//     },
//     tokens,
//   };
// }

// }

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Credentials } from 'google-auth-library';

interface GoogleExchangeResult {
  profile: { id: string; email: string; name: string; picture?: string };
  tokens: Credentials;
}

@Injectable()
export class GoogleService {
  constructor(private config: ConfigService) {}

  async exchangeCode(code: string): Promise<GoogleExchangeResult> {
    const clientId = this.config.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.config.get<string>('GOOGLE_CLIENT_SECRET');
    const redirectUri = this.config.get<string>('GOOGLE_CALLBACK_URL'); // e.g., http://localhost:8287/api/parent/auth/google/callback

    try {
      // Prepare x-www-form-urlencoded data
      const payload = new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      });

      // Exchange code for tokens
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        payload.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const tokens = tokenResponse.data;

      // Use token to get user info
      const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({
        auth: oauth2Client,
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
    } catch (err) {
      console.error('Google OAuth Error:', err.response?.data || err.message);
      throw new InternalServerErrorException({
        message: 'OAuth failed',
        error: err.response?.data?.error || err.message,
      });
    }
  }
  generateAuthUrl(): string {
  const clientId = this.config.get<string>('GOOGLE_CLIENT_ID');
  const clientSecret = this.config.get<string>('GOOGLE_CLIENT_SECRET');
  const redirectUri = this.config.get<string>('GOOGLE_CALLBACK_URL');

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['email', 'profile'],
    prompt: 'consent',
  });
}

}
