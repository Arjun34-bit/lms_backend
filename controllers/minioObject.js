const Minio = require('minio');

// MinIO client setup with provided credentials
const minioClient = new Minio.Client({
    endPoint: 's3storage.duoples.com', // Endpoint for MinIO storage
    accessKey: 'KE6eY6O3X7ghZfDe5xqI', // Provided access key
    secretKey: 'lNpfk2NuD27ygvV9LOmZqyJ5nPNkdTzyOHWozpnm', // Provided secret key
    useSSL: true, // Use SSL if supported by your MinIO instance
   
    // Signature version for compatibility with S3v4
    signatureVersion: 'v4'
});

module.exports = minioClient;
