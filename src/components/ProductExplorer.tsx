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
import { Package, RefreshCw, Loader2, AlertCircle } from "lucide-react";

type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  function showResult(list: ProductList) {
    setProducts(list.products);
    setErrorMessage("");
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ",
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
    setProducts([...products, { ...draft, id: Date.now() }]);
  }

  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Product Explorer
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              ระบบจัดการและค้นหารายการสินค้า
            </p>
          </div>
        </div>
      </header>

      {/* แบบฟอร์มเพิ่ม/แก้ไขสินค้า */}
      <ProductForm editing={null} onSave={saveProduct} onCancel={() => {}} />

      {/* ฟอร์มค้นหาและตัวกรอง */}
      <ProductSearchForm onSearch={loadProducts} />

      {/* ส่วนหัวตารางและปุ่มโหลดข้อมูล */}
      <div className="flex items-center justify-between mt-10 mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          รายการสินค้า
        </h2>
        <button
          type="button"
          onClick={() => loadProducts(defaultQuery)}
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-medium text-zinc-800 dark:text-zinc-200 transition disabled:opacity-50 shadow-sm"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
              <span>กำลังโหลด...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 text-zinc-500" />
              <span>โหลดข้อมูล</span>
            </>
          )}
        </button>
      </div>

      {/* ผลลัพธ์และตารางสินค้า */}
      <section aria-live="polite">
        {status === "loading" && (
          <div className="p-12 text-center text-blue-500 font-medium flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p>กำลังโหลดข้อมูลสินค้า...</p>
          </div>
        )}
        {status === "error" && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {status === "ready" && products.length === 0 && (
          <div className="p-8 text-center text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800">
            ไม่พบสินค้าที่ตรงกับเงื่อนไข
          </div>
        )}
        {status === "ready" && products.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900">
            <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-200 font-semibold border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4">รูปสินค้า</th>
                  <th className="py-3.5 px-4">รหัส</th>
                  <th className="py-3.5 px-4">ชื่อสินค้า</th>
                  <th className="py-3.5 px-4">ราคา</th>
                  <th className="py-3.5 px-4">คงเหลือ</th>
                  <th className="py-3.5 px-4">หมวดหมู่</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {products.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition"
                  >
                    <td className="py-3 px-4">
                      <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                        <Image
                          src={item.thumbnail ?? "/placeholder.png"}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-zinc-400">
                      #{item.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-zinc-900 dark:text-white">
                      {item.title}
                    </td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                      ฿{Number(item.price).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.stock > 10
                            ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                        }`}
                      >
                        {item.stock} ชิ้น
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                        {item.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}