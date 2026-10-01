"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/lib/products";
import type { Product, ProductDraft } from "@/lib/products";
import { PlusCircle, Pencil, X, Check } from "lucide-react";
type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};
export default function ProductForm({
  editing,
  onSave,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: editing
      ? {
          title: editing.title,
          price: editing.price,
          stock: editing.stock,
          category: editing.category,
        }
      : { title: "", price: undefined, stock: undefined },
  });

  function saveProduct(values: ProductDraft) {
    onSave(values);
    reset();
  }

    return (
    <form
      onSubmit={handleSubmit(saveProduct)}
      noValidate
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm mb-6 max-w-2xl"
    >
      <div className="flex items-center gap-2 mb-5 text-zinc-900 dark:text-zinc-100">
        {editing ? (
          <Pencil className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        ) : (
          <PlusCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        )}
        <h2 className="text-lg font-bold">
          {editing ? "แก้ไขข้อมูลสินค้า" : "เพิ่มสินค้าใหม่"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-full">
          <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            ชื่อสินค้า
          </label>
          <input
            id="title"
            required
            {...register("title")}
            aria-invalid={!!errors.title}
            aria-describedby="title-error"
            placeholder="กรอกชื่อสินค้า..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm transition"
          />
          {errors.title && (
            <span id="title-error" role="alert" className="text-red-500 dark:text-red-400 text-xs mt-1.5 block">
              {errors.title.message}
            </span>
          )}
        </div>


        <div>
          <label htmlFor="price" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            ราคา
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            required
            {...register("price", { valueAsNumber: true })}
            aria-invalid={!!errors.price}
            aria-describedby="price-error"
            placeholder="0.00"
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm transition"
          />
          {errors.price && (
            <span id="price-error" role="alert" className="text-red-500 dark:text-red-400 text-xs mt-1.5 block">
              {errors.price.message}
            </span>
          )}
        </div>


        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            จำนวนคงเหลือ
          </label>
          <input
            id="stock"
            type="number"
            required
            {...register("stock", { valueAsNumber: true })}
            aria-invalid={!!errors.stock}
            aria-describedby="stock-error"
            placeholder="0"
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm transition"
          />
          {errors.stock && (
            <span id="stock-error" role="alert" className="text-red-500 dark:text-red-400 text-xs mt-1.5 block">
              {errors.stock.message}
            </span>
          )}
        </div>


        <div className="col-span-full">
          <label htmlFor="category" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            หมวดหมู่
          </label>
          <select
            id="category"
            required
            {...register("category")}
            aria-invalid={!!errors.category}
            aria-describedby="category-error"
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm transition"
          >
            <option value="" className="text-zinc-400 dark:text-zinc-500">กรุณาเลือกหมวดหมู่</option>
            {CATEGORIES.map((name) => (
              <option key={name} value={name} className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800">
                {name}
              </option>
            ))}
          </select>
          {errors.category && (
            <span id="category-error" role="alert" className="text-red-500 dark:text-red-400 text-xs mt-1.5 block">
              {errors.category.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-5 mt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <button
          type="submit"
          disabled={!isDirty || !isValid}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          <Check className="w-4 h-4" />
          <span>{editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}</span>
        </button>

        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-medium transition"
          >
            <X className="w-4 h-4" />
            <span>ยกเลิก</span>
          </button>
        )}
      </div>
    </form>
  );
}
