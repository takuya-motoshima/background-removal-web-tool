const PORT = 3002;

module.exports = {
  apps : [
    {
      name: 'background-removal-web-tool',
      script: 'bin/www',
      exec_mode: 'cluster_mode',
      watch: '.',
      watch_delay: 3000,
      ignore_watch : [
        'node_modules',
        "client",
        'public',
        'views',
      ],
      watch_options: {
        followSymlinks: false,
        usePolling: true
      },
      env: {
        NODE_ENV: 'development',
        PORT
      },
      env_test: {
        NODE_ENV: 'test',
        PORT
      },
      env_production: {
        NODE_ENV: 'production',
        PORT
      }
    }
  ]
};