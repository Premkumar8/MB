import { Client } from 'pg';
import { fallbackProducts } from '../data/products';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  try {
    console.log("Seeding database...");
    await client.connect();

    console.log("Dropping existing tables...");
    await client.query(`DROP TABLE IF EXISTS cart_items CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS products CASCADE;`);

    console.log("Creating new products table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        origin VARCHAR(100),
        finish VARCHAR(100),
        thickness VARCHAR(50),
        applications TEXT,
        description TEXT,
        price DECIMAL(10, 2),
        availability VARCHAR(100),
        image_url TEXT,
        images JSONB
      );
    `);

    await client.query(`TRUNCATE TABLE products CASCADE;`);

    for (const product of fallbackProducts) {
      await client.query(`
        INSERT INTO products (
          id, name, category, origin, finish, thickness, applications, 
          description, price, availability, image_url, images
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        )
      `, [
        product.id, product.name, product.category, product.origin, 
        product.finish, product.thickness, product.applications, 
        product.description, product.price, product.availability, 
        product.image_url, JSON.stringify(product.images)
      ]);
    }
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding:", error);
  } finally {
    process.exit();
  }
}

main();
