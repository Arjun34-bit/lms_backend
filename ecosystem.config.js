module.exports = {
  apps: [
    {
      name: 'pcc_backend',
      script: 'dist/main.js',
      instances: 1, // Run a single instance
      exec_mode: 'cluster', // Enable clustering for load balancing
      watch: false, // Disable watch in production for stability
      env: {
        NODE_ENV: 'production',
        PORT: 8287,
      },
      error_file: './logs/pm2/error.log',
      out_file: './logs/pm2/output.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 5000, // Wait 5 seconds before restarting on failure
    },
  ],
};