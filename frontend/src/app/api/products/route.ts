import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "localhost:3306",
  user: process.env.DB_USER || "adan",
  password: process.env.DB_PASSWORD || "motdepasse",
  database: process.env.DB_DATABASE || "epicosmetique",
};

const connection = await mysql.createConnection(dbConfig);

 const [rows] = await connection.execute("SELECT * FROM products");
    await connection.end();

    const products: any[] = rows as any[];