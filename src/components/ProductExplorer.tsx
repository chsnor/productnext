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
import {
  Package,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";

type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState<SearchQuery>(defaultQuery);
  const [total, setTotal] = useState(0);
  const [editing, setEditing] = useState<Product | null>(null);

  function showResult(list: ProductList) {
    setProducts(list.products);
    setTotal(list.total);
    setErrorMessage("");
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ",
    );
    setStatus("error");
  }

  async function loadProducts(nextQuery: SearchQuery) {
    setQuery(nextQuery);
    setStatus("loading");
    setErrorMessage("");
    try {
      showResult(await fetchProducts(nextQuery));
    } catch (error) {
      showError(error);
    }
  }

  function saveProduct(draft: ProductDraft) {
    if (editing) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editing.id ? { ...draft, id: editing.id } : item,
        ),
      );
      setEditing(null);
    } else {
      setProducts((prev) => [...prev, { ...draft, id: Date.now() }]);
    }
  }

  const limit = query.limit;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(totalPages, Math.floor(query.skip / limit) + 1);

  function goToPage(page: number) {
    loadProducts({ ...query, skip: (page - 1) * limit });
  }

  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-600 text-white">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Product Explorer
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">
              ระบบจัดการและค้นหารายการสินค้า
            </p>
          </div>
        </div>
      </header>


      <ProductForm
        key={editing ? `edit-${editing.id}` : "new"}
        editing={editing}
        onSave={saveProduct}
        onCancel={() => setEditing(null)}
      />

      <ProductSearchForm
        defaultValues={query}
        onSearch={(values) => loadProducts({ ...values, skip: 0 })}
      />

      <div className="flex items-center justify-between mt-10 mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          รายการสินค้า
        </h2>
        <button
          type="button"
          onClick={() => loadProducts(query)}
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
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 font-medium border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4 uppercase text-xs tracking-wider">รูปสินค้า</th>
                  <th className="py-3.5 px-4 uppercase text-xs tracking-wider">รหัส</th>
                  <th className="py-3.5 px-4 uppercase text-xs tracking-wider">ชื่อสินค้า</th>
                  <th className="py-3.5 px-4 uppercase text-xs tracking-wider">ราคา</th>
                  <th className="py-3.5 px-4 uppercase text-xs tracking-wider">คงเหลือ</th>
                  <th className="py-3.5 px-4 uppercase text-xs tracking-wider">หมวดหมู่</th>
                  <th className="py-3.5 px-4 uppercase text-xs tracking-wider">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {products.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">                        <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-700 flex items-center justify-center">
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
                    <td className="py-3 px-4">                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                          {item.category}
                        </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(item);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>แก้ไข</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {status === "ready" && total > 0 && (
          <nav
            aria-label="แบ่งหน้า"
            className="flex flex-wrap items-center justify-center gap-2 mt-6"
          >
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>ก่อนหน้า</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                disabled={page === currentPage}
                aria-current={page === currentPage ? "page" : undefined}
                className={
                  page === currentPage
                    ? "min-w-9 px-3 py-1.5 rounded-full text-sm font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    : "min-w-9 px-3 py-1.5 rounded-full text-sm font-medium text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                }
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>ถัดไป</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <p className="w-full text-center text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              หน้า {currentPage} จาก {totalPages} · ทั้งหมด {total} รายการ
            </p>
          </nav>
        )}
      </section>
    </main>
  );
}