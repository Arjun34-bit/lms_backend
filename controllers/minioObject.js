const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: 's3storage.duoples.com',
    // endPoint: 's3storage.duoples.com',
    accessKey: '0Ib0S7OPaQ2ueaJsT6Yr',
    secretKey: 'UWOk0t9B7Q0LfTZN0huXjVpGlpyI4DogD05dQUc9'
});

module.exports = minioClient;