const config = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'root',
    database: 'gis',
    // 扩展属性
    max: 40, // 连接池最大连接数
    idleTimeoutMillis: 3000, // 连接最大空闲时间 3s
};

module.exports = config;