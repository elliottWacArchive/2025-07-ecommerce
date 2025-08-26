import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "adan",
  password: process.env.DB_PASSWORD || "motdepasse",
  database: process.env.DB_DATABASE || "epicosmetique",
  port: 3306,
};

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute("SELECT * FROM products");
    await connection.end();

    const products: any[] = rows as any[];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Produits");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Nom", key: "name", width: 30 },
      { header: "Description", key: "description", width: 40 },
      { header: "Prix (€)", key: "price", width: 15 },
      { header: "Stock", key: "stock", width: 10 },
      { header: "Image", key: "image", width: 40 },
      { header: "Marque", key: "brand", width: 20 },
      { header: "Vues", key: "views", width: 10 },
      { header: "Catégorie ID", key: "category_id", width: 15 },
      { header: "Sous-catégorie ID", key: "subcategory_id", width: 15 },
      { header: "Sous-sous-catégorie ID", key: "sub_subcategory_id", width: 20 },
      { header: "Créé le", key: "created_at", width: 20 },
      { header: "Modifié le", key: "updated_at", width: 20 },
    ];

    products.forEach((p) => {
      worksheet.addRow({
        id: p.id,
        name: p.name,
        description: p.description || "",
        price: p.price,
        stock: p.stock,
        image: p.image || "",
        brand: p.brand,
        views: p.views,
        category_id: p.category_id,
        subcategory_id: p.subcategory_id,
        sub_subcategory_id: p.sub_subcategory_id,
        created_at: p.created_at,
        updated_at: p.updated_at,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": 'attachment; filename="produits.xlsx"',
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error: any) {
    console.error("Erreur export Excel:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'export" },
      { status: 500 }
    );
  }
}
