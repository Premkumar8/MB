import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { fallbackProducts } from '@/data/products';

export async function GET() {
  try {
    // 1. Create table if it doesn't exist
    await sql`
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
    `;

    // 2. Clear existing table to re-seed cleanly
    await sql`TRUNCATE TABLE products RESTART IDENTITY;`;

    // 3. Insert all products
    for (const product of fallbackProducts) {
      await sql`
        INSERT INTO products (
          id, name, category, origin, finish, thickness, applications, 
          description, price, availability, image_url, images
        ) VALUES (
          ${product.id}, ${product.name}, ${product.category}, ${product.origin}, 
          ${product.finish}, ${product.thickness}, ${product.applications}, 
          ${product.description}, ${product.price}, ${product.availability}, 
          ${product.image_url}, ${JSON.stringify(product.images)}
        )
      `;
    }

    return NextResponse.json({ message: 'Database seeded successfully', count: fallbackProducts.length }, { status: 200 });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
