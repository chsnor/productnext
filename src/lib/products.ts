import { z } from "zod";
// รายชื:อหมวดหมู่ คัดลอกจาก
// https://dummyjson.com/products/category-list
export const CATEGORIES = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
] as const;
const ProductSchema = z.object({
  id: z.number(),
  // เติม: เงื:อนไขที:บังคับว่าข้อความต้องยาวอย่างน้อยเท่าใด
  title: z.string().trim().min(1, "กรุณากรอกชือสินค้า"),
  price: z.number({ error: "กรุณากรอกราคา" }).min(0, "ราคาต้องไม่ติดลบ"),
  stock: z
    .number({ error: "กรุณากรอกจํานวนคงเหลือ" })
    .int("จํานวนคงเหลือต้องเป็นจํานวนเต็ม")
    .min(0, "จํานวนคงเหลือต้องไม่ติดลบ"),
  category: z.enum(CATEGORIES, { error: "กรุณาเลือกหมวดหมู่" }),
  description: z.string().trim().optional(),
  thumbnail: z.string().url("รูปภาพไม่ถูกต้อง").optional(),
});
const ProductListSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});
// เติม: ตัวช่วยของ Zod ที:อ่าน Type ออกมาจาก Schema
export type Product = z.infer<typeof ProductSchema>;
export type ProductList = z.infer<typeof ProductListSchema>;
export const ProductDraftSchema = ProductSchema.omit({ id: true });
export type ProductDraft = z.infer<typeof ProductDraftSchema>;

const API_BASE = "https://dummyjson.com";
export const SORT_FIELDS = ["title", "price", "stock"] as const;
export const SearchQuerySchema = z.object({
  q: z.string().trim(),
  skip: z
    .number({ error: "กรุณากรอกจำนวนข้าม" })
    .int("จำนวนข้ามต้องเป็นจำนวนเต็ม")
    .min(0, "จำนวนข้ามต้องไม่ติดลบ"),
  limit: z
    .number({ error: "กรุณากรอกจํานวนรายการ" })
    .int("จํานวนรายการต้องเป็นจํานวนเต็ม")
    .min(1, "อย่างน้อย 1 รายการ")
    .max(30, "ไม่เกิน 30 รายการ"),
  sortBy: z.enum(SORT_FIELDS),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export const defaultQuery: SearchQuery = {
  q: "",
  skip: 0,
  limit: 10,
  sortBy: "title",
};
function buildProductUrl(query: SearchQuery): string {
  const params = new URLSearchParams();
  params.set("q", query.q);
  params.set("skip", String(query.skip));
  // เติม: เมธอดที:กําหนดค่าให้พารามิเตอร์หนึ:งตัว
  params.set("limit", String(query.limit));
  params.set("sortBy", query.sortBy);
  params.set("order", "asc");
  params.set("select", "title,price,stock,category,thumbnail,description");
  return `${API_BASE}/products/search?${params.toString()}`;
}

export async function fetchProducts(query: SearchQuery): Promise<ProductList> {
  const response = await fetch(buildProductUrl(query));
  console.log("response", response);
  // เติม: ค่าที:บอกว่าสถานะการตอบกลับอยู่ในช่วง 200 ถึง 299 หรือไม่
  if (!response.ok) {
    throw new Error(`เรียกข้อมูลไม่สําเร็จ สถานะ ${response.status}`);
  }
  // เติม: เมธอดที:อ่านเนื?อหาการตอบกลับเป็น JSON
  const data = await response.json();
  console.log("data", data);
  // เติม: เมธอดที:ตรวจข้อมูลแล้วคืนผลลัพธ์แทนการโยน Error
  const result = ProductListSchema.safeParse(data);
  if (!result.success) {
    throw new Error("รูปแบบข้อมูลที่ได้รับไม่ตรงกับที่กำหนดไว้");
  }
  return result.data;
}
