import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  multipleStatements: true
};

let pool = null;
let isDbConnected = false;

// Query helper using MySQL pool
export const query = async (sql, params = []) => {
  if (isDbConnected && pool) {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows;
    } catch (err) {
      console.error('MySQL Query Error:', err.message);
      throw err;
    }
  } else {
    throw new Error('MySQL database not connected');
  }
};

export const getPool = () => pool;

// Initialize MySQL Connection & Database Schema
export const initDb = async () => {
  try {
    // Step 1: Connect without database to ensure DB exists
    const tempConnection = await mysql.createConnection(dbConfig);
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'studylms_db'}\`;`);
    await tempConnection.end();

    // Step 2: Create connection pool with targeted database
    pool = mysql.createPool({
      ...dbConfig,
      database: process.env.DB_NAME || 'studylms_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const conn = await pool.getConnection();
    isDbConnected = true;
    console.log('✅ Connected to MySQL database successfully!');

    // Step 3: Run DDL schema initialization
    const schemaPath = path.join(__dirname, '../schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await conn.query(sql);
      console.log('✅ MySQL Schema initialized/verified.');
    }
    conn.release();
    return true;
  } catch (err) {
    isDbConnected = false;
    console.warn(`⚠️ MySQL connection attempt failed (${err.message}).`);
    return false;
  }
};

export const getDbStatus = () => isDbConnected;
