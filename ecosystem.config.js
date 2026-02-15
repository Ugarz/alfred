module.exports = {
    apps: [{
        name: "alfred",
        script: "./dist/index.js",
        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '500M',
        env: {
            NODE_ENV: "production",
        },
    }]
};
