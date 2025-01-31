module.exports = {
  apps: [
    {
      name: 'nestjs-app',
      script: 'dist/main.js',
      instances: 'max', // Run multiple instances based on CPU cores
      exec_mode: 'cluster', // Enable cluster mode for scalability
      watch: false, // Set to true for auto-restart on changes
      env: {
        NODE_ENV: 'production',
        PORT: 8287,
      },
    },
  ],
};
