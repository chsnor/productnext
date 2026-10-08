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

type ProductExplorerProps = {
  isLoggedIn?: boolean;
};

export default function ProductExplorer({ isLoggedIn = false }: ProductExplorerProps) {
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
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          <Package className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Product Explorer
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            ระบบจัดการและค้นหารายการสินค้า
          </p>
        </div>
      </header>

      {isLoggedIn ? (
        <ProductForm
          key={editing ? `edit-${editing.id}` : "new"}
          editing={editing}
          onSave={saveProduct}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <div className="mb-6 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50 p-4 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            🔒 กรุณาเข้าสู่ระบบด้วย Google เพื่อเพิ่มหรือแก้ไขสินค้า
          </p>
        </div>
      )}

      <ProductSearchForm
        defaultValues={query}
        onSearch={(values) => loadProducts({ ...values, skip: 0 })}
      />


      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          รายการสินค้า
        </h2>
        <button
          type="button"
          onClick={() => loadProducts(query)}
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
              <span>กำลังโหลด...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 text-zinc-400" />
              <span>โหลดข้อมูล</span>
            </>
          )}
        </button>
      </div>

      <section aria-live="polite">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center gap-3 p-12 text-sm font-medium text-zinc-500">
            <Loader2 className="h-7 w-7 animate-spin text-zinc-400" />
            <p>กำลังโหลดข้อมูลสินค้า...</p>
          </div>
        )}
        {status === "error" && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {status === "ready" && products.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50/50 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
            ไม่พบสินค้าที่ตรงกับเงื่อนไข
          </div>
        )}
        {status === "ready" && products.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-900">
            <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
              <thead className="border-b border-zinc-200/80 bg-zinc-50/60 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-800/40 dark:text-zinc-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    รูปสินค้า
                  </th>
                  <th scope="col" className="px-4 py-3">
                    รหัส
                  </th>
                  <th scope="col" className="px-4 py-3">
                    ชื่อสินค้า
                  </th>
                  <th scope="col" className="px-4 py-3">
                    ราคา
                  </th>
                  <th scope="col" className="px-4 py-3">
                    คงเหลือ
                  </th>
                  <th scope="col" className="px-4 py-3">
                    หมวดหมู่
                  </th>
                  <th scope="col" className="px-4 py-3">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
                {products.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-md bg-zinc-100 ring-1 ring-zinc-200/80 dark:bg-zinc-800 dark:ring-zinc-700/60">
                        <Image
                          src={item.thumbnail ?? "/placeholder.png"}
                          alt={item.title}
                          width={44}
                          height={44}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-400 dark:text-zinc-500">
                      #{item.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {item.title}
                    </td>
                    <td className="px-4 py-3 font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                      ฿{Number(item.price).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2 tabular-nums text-zinc-700 dark:text-zinc-300">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.stock > 10 ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                          aria-hidden
                        />
                        {item.stock} ชิ้น
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {item.category}
                    </td>
                    <td className="px-4 py-3">
                      {isLoggedIn ? (
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(item);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>แก้ไข</span>
                        </button>
                      ) : (
                        <span className="text-xs text-zinc-400">
                          ต้องเข้าสู่ระบบ
                        </span>
                      )}
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
            className="mt-6 flex flex-wrap items-center justify-center gap-1.5"
          >
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
            >
              <ChevronLeft className="h-4 w-4" />
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
                    ? "min-w-9 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "min-w-9 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
                }
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
            >
              <span>ถัดไป</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <p className="mt-1 w-full text-center text-xs text-zinc-500 dark:text-zinc-400">
              หน้า {currentPage} จาก {totalPages} · ทั้งหมด {total} รายการ
            </p>
          </nav>
        )}
      </section>
    </main>
  );
}
