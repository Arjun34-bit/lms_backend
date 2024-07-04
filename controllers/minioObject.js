const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: 's3storage.duoples.com',
    // port: YOUR_MINIO_PORT,
    // useSSL: false, // or true if you are using SSL
    accessKey: 'kdzAcGsMTr3UVd86PaNa',
    secretKey: 'NzxyRz7674p9qTHqyT6I8AitNhzzkCgrOYFES5bz'
});

module.exports = minioClient;