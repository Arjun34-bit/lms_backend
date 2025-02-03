import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

const firebaseConfig: ServiceAccount = {
  projectId: 'pcc-mobile-app-84266',
  privateKey:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCsGbeAZC6wLRid\nq0KolJ1oTNilaryOh+3lZyZVAqFo0ODDt1efsaYrRXvUR+ln6bKjbdAHz416jWMf\nYy48qbpreI4w0lLFc4AKpmI/8+h0QT9DVuPQIzNWxqzAsv/okJ00V2v+be3SJA8U\nnv38QaeyzK7RkrhMrM9/jxtQ/PMuWoXZgLqcSxYnQXtFo3nhHTgSO2viZHXpw6Gc\nPQyLVP6ctSFvaJASw31ppoHsA1ix3v5uLM17Dn9cssCzQeATtK66J6r0OthiDdcj\nFMAid07785CxJ3wxJCNCaj+WxQ4GGxZ09NtwdBh8s3CjPwkjeX/Mx6iH9B4yrTEY\nK8JMiNFdAgMBAAECggEAKX6A1yCwfhM9bGR6q607X4aptIZt5HqjEezDGfuKobw8\n+QtXQd5iB2xXHRlijgaTZuKG5h81iB8XT13JK+CrXRahx+UqBkfhDxBLP4qmGQOT\nRn/oaQpXqjw4MjTmTTMy6AgM9nkYPlKp3SmxaLUGwy4lF0wGChyfYezF5Aq88keF\nCQdR3FRg5Q+4QN/gMlqp/yDLghLhpGeU25FAzH56hMvBowI+76arLOBQjhYrhD5C\nd9zqUYX82J+gYGNyKMl+XE0XHtbWa0IasGArBr2AkOEEAmStUYKTsIAu29HBIxg1\nXhtq5qqLqF/SiKYXc4Xj8j/WTjRnQBU0lXzM+LhFAQKBgQDkkhXPY5voOjyCE36o\nBDKF4fpu0flJx8qQQgXbpNw7lXfRCq1KEmFMJGBzueno2SscOqooj7p+gDmfWH5l\nLDuhHzOOQGEl5s847GZFRsHhQUuz3AWe+EITefheAu5nl/Bmj8Gz+fpHOFyS5Z0J\nOLJtP/eJb6f+48JJrPpB7s5HAQKBgQDAwM/ZsXwrkMSFDkGG+RbGIraGwbLUwTYd\nKBpzwTl/8lTV1beHHbGoihe5nE6blEGKM79EL8cK3iRwMZIcLP52yHe8hFEMMLPI\nQp24p8RceQC8hD6ZAgLYf79zcw+/gh32LN6ZhbS1Mg547c8qya1PFXEOQdBQJayJ\n4sKtbO8GXQKBgE17V/ldgtROKYTOpvi9s4K+/+3hL+ha2cfdGa9DS4THPj6Wp/ec\nE2+ERU31j91nAL4pBNWLI2UOgnoJvY7+V5hew1NNb6ExhL1/JYwGWGLLh6YIx78D\n2SJRDmiQBdEIKG4b/UXNT5IlAPyq6Xjex11RedAVEZXOD2Z6RLtlAHgBAoGBAKnb\nP05+8QUTFZqK7YObjU4c2Ov3VTfW63DWHjlTVPBDBC9Lnecba6sxxaZy73J6Oycm\nYq4bzDLvfvy/MhpSLAtQrPMbRrCPWl5nFcXbUVaL6vI1N1RuSUOvj26VPpNsfiqp\nb5+qC4yBB+/Y4G68OlUud+owZPm7uUfo49Uf4aKhAoGAa82tMGYN0dSgvyt9gGXC\nkqcBNBo5QmNqFv627EDKppcJX/M51+d3W/u/Mv3NJYflgivB8BH3CAg8qksvWTcq\nREv+jDW+RmahknpKGfKTZHmPGymqnXV0onzRa+IV2wDVjyfp4DHsNG2sCUpVE+7L\nzZxZCFxisRomZI7QB/+ACBE=\n-----END PRIVATE KEY-----\n'?.replace(
      /\\n/g,
      '\n',
    ),
  clientEmail:
    'firebase-adminsdk-f20nz@pcc-mobile-app-84266.iam.gserviceaccount.com',
};

export const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

export const firebaseAuth = admin.auth();
