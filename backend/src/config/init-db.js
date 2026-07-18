require('dotenv').config();
const mysql = require('mysql2/promise');

async function initializeDatabase() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || '';
  const database = process.env.DB_NAME || 'spk_topsis_lq45';

  console.log(`Connecting to MySQL at ${host}:${port} as ${user}...`);

  try {
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password
    });

    console.log(`Creating database "${database}" if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    console.log(`Database "${database}" initialized successfully.`);
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

initializeDatabase();
