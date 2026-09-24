"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { defaultQuery, fetchProducts } from "src/lib/products";
import type {
  Product,
  ProductDraft,
  ProductList,
  SearchQuery,
} from "src/lib/products";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";
type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  function showResult(list: ProductList) {
    setProducts(list.products);
    setErrorMessage("");
    setStatus("ready");
    // โชว์ข products ใน console เพื่อดูข้อมูล
    console.log("products", products);
  }
  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สําเร็จ",
    );
    setStatus("error");
  }
  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");
    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }
  function saveProduct(draft: ProductDraft) {
    // เติม: เครื่องหมายที่คัดลอกสมาชิกเดิมทั้งหมดของ Array
    console.log("draft", draft);
    setProducts([...products, { ...draft, id: Date.now() }]);
  }
    useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
    // เติม: สิ่งที่กำหนดให้ทำงานเพียงครั้งเดียวตอนแสดงผลครั้งแรก
  }, []);

  return (
    <main>
      <ProductForm editing={null} onSave={saveProduct} onCancel={() => {}} />
      <ProductSearchForm onSearch={loadProducts} />
      <h1>รายการสินค้า</h1>
      <button
        type="button"
        onClick={() => loadProducts(defaultQuery)}
        disabled={status === "loading"}
      >
        {status === "loading" ? "กำลังโหลด" : "โหลดข้อมูล"}
      </button>
      {
        <section aria-live="polite">
          {status === "idle" && <p>คลิกปุ่มโหลดข้อมูลเพื่อเริ่ม</p>}
          {status === "loading" && <p>กำลังโหลดข้อมูล</p>}
          {status === "error" && <p role="alert">{errorMessage}</p>}
          {status === "ready" && products.length === 0 && (
            <p>ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
          )}
          {status === "ready" && products.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>รูปสินค้า</th>
                  <th>รหัสสินค้า</th>
                  <th>ชื่อสินค้า</th>
                  <th>ราคา</th>
                  <th>คงเหลือ</th>
                  <th>หมวดหมู่</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Image
                        src={item.thumbnail ?? "/placeholder.png"}
                        alt={item.title}
                        width={100}
                        height={100}
                        unoptimized
                      />
                    </td>
                    <td>{item.id}</td>
                    <td>{item.title}</td>
                    <td>{item.price}</td>
                    <td>{item.stock}</td>
                    <td>{item.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      }
    </main>
  );
}
