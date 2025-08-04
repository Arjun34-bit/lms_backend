import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

const firebaseConfig: ServiceAccount = {
  projectId: 'let-s-learn-20ff9',
  privateKey:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCVMSEtDgS3LXFX\nXSz2ldfS70OSb2nqyjhcJx+nPzyNwAGDUIf9hk7dXXdJ8TLtkaCxzgq1oPOby+1R\nQ+gs+dNObpnvzVm1B4AFyReSForBOPBQ+AmKtqOg9j3h0fOmSfJo/5uX5ECAXoyp\n+BILUgetrRFGtFXmkS0wdRlZUmFAGxpoOPTY9uxTI7A5u/JKNSPvj+zS0eArpz6c\nR2FgCPxDLYsZwzj9keP/71m7QeiHWWhNXFMsddAwDTFp3fb5EklddfzrSScYCge6\n1TGt8fWFNLQKKzh7IYHlkoYyfVvbORn2Kez1konAHXJ5AoEFm7iQCU+0ngnc6q2w\nwBJcr5UbAgMBAAECggEAP8YRDu/bnyvLM9OuCTgzWkURxvJePdG0dtv4gWccLOHD\nI81UXFDBvImcGN0Ebp4eKXNQi6RiDhqFdwQGptch9vh7UBEhRCuRE6gKrdV5+a+r\ntojYl1WMK52nBTVYqCAbAbwl2C9nTRhdm7hhijpF8v00kds7jwRG41xi+hYnYR2t\npGTPT6GP5K8ilUw5alptcQqF972f1NWnoiKi+ho0zG1f6ChclJV0y567dfyVFeSt\ng8kdvW7sdz53OH30XIGqcl70e+zQN8NBG/aV6Ydvx7Gomxio78rxoS4SJR/k512r\n7PZ9GIPreuKFraqriBBqgnuhYR7J+Ux/idjTwHOjwQKBgQDKco0eJVXIONtdgjuY\ng1Cbb6E5T30SNrL/P9YIiCfFdSl/ys16cwDAUDcczuhvfPMa1myzu0GdtliSWP07\nZV3NMnVw/Lq05tZpVD1n9Kej4kneZItQwcwuUrFd/WCLI2PINKoQZBuHP8+2yVID\nryaXj67xN9CM/uXyNnwlCcYN2wKBgQC8qDCEj0LI+/LAUxyXp6/8fYCDfWB+/89w\nfoCuBtWWM3O0VgaccV9wMKm2UjwQz7d8jb5b5IoL1CjvsSZbgO9gSFv4Zd7GAHa1\nHJAtVAu7zncyrzjH+CsLiWpH4gvxBgg3TxPEJFitAbVnk8dE5gXEN+XXSo4fhmux\nbVTgmwpZwQKBgDlXlvcZ9iE/UYs77yt0zmkohk8YX8G/8pVv/GzwO+unEvkadXcg\nie7vCZ1EUfv6NVW9tI54FM7aLl5NjHS9coNDrpYxT6Ub2VF+ReJjHvTBjNDMQ9W8\n/tuEGq8XrLfcb0/u8tivskht36TTg0J94v18+j1i5NR7AqDHpARNr2aPAoGBAKfs\n0Zr85gZ+dTqKADZhlb2afK0OCbmhvCS3BZViEfYrgD8yH5pbNAdp2XanRj30lq+w\nf5POHq6ev31zYuAqKWi7n9m/24bFXOSjMxaV7AfUpLchztn4ZWBUhZzMcbKtmtyY\nb9C0RZZhofY7TTFfyhw5YUW8YDthbDS3S8jNWG5BAoGBALKhgydAIiaODQ8b9iHP\nxaEbCBry1flNIdRH/NHYmY8rXYMbmJ+rlECpqC+9nwLcLEnCJtYwd/nbrZT7/W3g\nbc39K3+LQnI1uVDRXxTOFfnNF7r2bwOg+UGyczZ0LuG8YRnJQxXhAtixMZbPVFF5\nGQuEXxFu70boqyDsxeY9Wlw2\n-----END PRIVATE KEY-----\n'?.replace(
      /\\n/g,
      '\n',
    ),
  clientEmail:
    'firebase-adminsdk-fbsvc@let-s-learn-20ff9.iam.gserviceaccount.com',
};

export const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

export const firebaseAuth = admin.auth();
