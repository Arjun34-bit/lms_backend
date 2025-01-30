import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

const firebaseConfig: ServiceAccount = {
  projectId: 'perfectcoachingcenter-45af1',
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDZX59Mp0n39XZ8\n5KomXsC4t3tH6RZtbJlTkV1TR1F/AKmcfH3aAOTVI83nuxMqq8w3seTCsRn57Hm/\ntWrJdnQOWNGhzrctWifughLVxtlUpCTRESjeN8HfDzsiWRVUn1/369lZoTmYsTQz\nRY2uYzDvMPwpxoK5F+LgKgUAGiJIKdcGvo2QBrwr3BC4ncMsXEagwiC9Pqrn95RC\nJHmhHXB6wU1UeUndkojg9RSxis8D87U/JWIebpErJt4kxeZGy9ku50HN89t0Uv5r\n7U4mED1Pew/xsHQHT80t8qrXg+8rAnrshxzcH6OsQX/+lFoEOJBo3r2m7NEr6qxE\nQZgPcN99AgMBAAECggEALnWW11wQ/e+Hg+GesUVCtSg4L/I0Yi5aJgeVdglx9G5Y\nkhL0lh3nStvUdDEig1YFN6ksruUJ24YsrmoQuR75ZqCaq5YCRi31B2/jJTBTPpk3\nqjyb6sTpiaqYdbqrCbNnoFZXFeZU6FsFgGjfA5T9Pj5OwwID6hoeGlG40GEFjz0G\n6IIoBwWuqfb1IS+Yi5kG3r8Dy6Syje/KpDd1+PqyF1RnOmTiX1k5Fd6h2Xg22stR\nNq00ftpk7VjSuPejLw1HgKx75+SBZd6KOsDdSH7zNIEJ0/XnGzkuCWXrPhYtz4/N\nIHKH2JWQdd9iqZCr3atxYfDBP6/T9dfUAJ/U+sVE0QKBgQD/g8cNxf0gCGAVmYCT\nAWZizkcqETXhlgwoe4ppmbnEHRooSQKbzKJQk9ayDhWgsoOpBZvXdK58/kUyaryH\nDZ6tPOsG5qDm1IlMXs2C4pwtZ4DGMlYt7mTTwstoizYbohLfOM9oz+E6Vdo5WZTt\nxDRIn3uNZuzCo01Oge+kbNaNjQKBgQDZyU1ALOrXz/yuOeX3gNpd0f+EEDYNlXsH\nny2VxV9ZhOWNbuu/h4koI4bwkeummmSxiJaORrHutGCHkP/2JSj57IxfmG6BmtmP\n4zljo8PTPS6CzlI8UTZuou3ADDXsP8dWbjSgELIZbP7lJEIgux6xdkq+vxUtRpdP\nfHZRzTpFsQKBgQCnvsqidzXLntP9ui3X1NZzzXqY2n2mIMzQkvJ2i26Smox+oBfv\nUrPI9JXBhU+blTasczsxgq++7WteQwaMH1vp3ZFqkWRWxndwxNhksgLYKBg5hfhf\n5R8aisrhUmtuTsPW+kPoSnlRw+UlO3NzeRjeCJ2jYkvTKERrYxCBwNZGTQKBgHIq\nT1+r7DPTqN7gJQg4uL/j3LErGlrGmGbnb6sKezBfNUKN+fE+KI0tCojDxadhWhWi\nx2Gv94htcAjA3xz2X+Obt/5I1u0D8ra145iy+W2bre0OIRfTbthSepVpET9WM7XA\nMcAS4HnppDkUZ8HmtXFL1GTnoD9KuPkHArNhBQIRAoGATqhEJ6f9uFxlUrVmH7CY\n+e8CkwdN/Qtdx0ECBCcMM0lAjJVjQqS/yejQrd5A+Q6yT3xGYhMQvDLX70JgCseR\nnrPTHLTfGq5vQe0ul8nlxi3nwPDfe5TpzL7mv1SQ8gNZdg9HxQ6me+YS3s7AO8fS\nIiNJKi8HEl7iQ3q62Q/HUXc=\n-----END PRIVATE KEY-----\n"?.replace(/\\n/g, '\n'),
  clientEmail: 'firebase-adminsdk-fbsvc@perfectcoachingcenter-45af1.iam.gserviceaccount.com',
};

export const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

export const firebaseAuth = admin.auth();
