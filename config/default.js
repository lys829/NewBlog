/**
 * Created by zeng on 17-1-12.
 */

/**
 * 如果程序以 NODE_ENV=test node app 启动，则通过 require('config-lite')
 * 会依次降级查找 config/test.js、config/test.json、config/test.node、config/test.yml、config/test.yaml 并合并 default 配置;
 * 如果程序以 NODE_ENV=production node app 启动，则通过 require('config-lite')
 * 会依次降级查找 config/production.js、config/production.json、config/production.node、config/production.yml、config/production.yaml 并合并 default 配置。
 * @type {{port: number, session: {secret: string, key: string, maxAge: number}, mongodb: string}}
 */

module.exports = {
    port: 3000,
    session: {
        secret: 'blog',
        key: 'blog',
        maxAge: 2592000000
    },
    mongodb: 'mongodb://localhost:27017/blog'
};