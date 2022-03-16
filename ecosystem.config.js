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
        NODE_ENV: 'production',
      },
    },
  ],
  deploy: {
    production: {
      user: 'ayo',
      host: ['168.119.119.25'],
      ref: 'origin/prod',
      repo: 'git@github.com:betterstack-community/dadjokes.git',
      path: '/home/ayo/dadjokes',
      'post-deploy': 'npm install',
    },
  },
};
