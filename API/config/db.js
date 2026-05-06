require('dotenv').config();
const mysql = require('mysql2');

const RETRYABLE_DB_ERRORS = new Set([
    'ECONNRESET',
    'PROTOCOL_CONNECTION_LOST',
    'ETIMEDOUT',
    'EPIPE',
    'ECONNREFUSED'
]);

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(fn, args, opts = {}) {
    const {
        retries = 3,
        baseDelayMs = 150,
        maxDelayMs = 1500
    } = opts;

    let lastErr;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await fn(...args);
        } catch (err) {
            lastErr = err;
            const code = err?.code;
            const shouldRetry = RETRYABLE_DB_ERRORS.has(code);
            if (!shouldRetry || attempt === retries) {
                throw err;
            }
            const delay = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
            await sleep(delay);
        }
    }
    throw lastErr;
}

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    connectTimeout: 10000,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 25),
    queueLimit: 0
});

pool.on('error', (err) => {
    // Pool errors are rare but important for stability diagnostics
    console.error('MySQL Pool Error:', err);
});

// Promisify the pool query method for convenience
const db = pool.promise();

// Wrap execute/query with retry logic so the whole project benefits without refactoring models.
const _execute = db.execute.bind(db);
const _query = db.query.bind(db);

db.execute = async (...args) => withRetry(_execute, args);
db.query = async (...args) => withRetry(_query, args);

module.exports = db;
