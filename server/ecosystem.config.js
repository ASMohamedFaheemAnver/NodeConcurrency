// Apply me by running : pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "server",
      script: "index.js",
      watch: true,
      instances: 4,
      exec_mode: "cluster",
      env: {
        MONGODB_URI: "mongodb://localhost:27017/concurrency",
      },
    },
  ],
};
