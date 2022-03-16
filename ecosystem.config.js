module.exports = {
  apps: [
    {
      name: 'dadjokes',
      script: './server.js',
      exp_backoff_restart_delay: 100,
      max_memory_restart: '1G',
      max_restarts: 10,
      min_uptime: 2000,
      out_file: '/var/log/pm2/dadjokes/out.log',
      error_file: '/var/log/pm2/dadjokes/error.log',
      instances: -1,
      exec_mode: 'cluster',
      env: {
        PORT: 3000,
        NODE_ENV: 'development',
      },
      env_production: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
    },
  ],
  deploy: {
    production: {
      user: '',
      host: [''],
      ref: 'origin/prod',
      repo: '',
      path: '',
      'post-setup': 'npm install',
      'post-deploy': 'pm2 startOrRestart ecosystem.config.js --env production',
    },
  },
};
