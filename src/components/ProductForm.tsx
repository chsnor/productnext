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
      className="mb-6 max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="mb-5 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
        {editing ? (
          <Pencil className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
        ) : (
          <PlusCircle className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
        )}
        <h2 className="text-base font-semibold">
          {editing ? "แก้ไขข้อมูลสินค้า" : "เพิ่มสินค้าใหม่"}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="col-span-full">
          <label
            htmlFor="title"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            ชื่อสินค้า
          </label>
          <input
            id="title"
            required
            {...register("title")}
            aria-invalid={!!errors.title}
            aria-describedby="title-error"
            placeholder="กรอกชื่อสินค้า..."
            className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus-visible:ring-zinc-100/10"
          />
          {errors.title && (
            <span
              id="title-error"
              role="alert"
              className="mt-1.5 block text-xs text-red-500 dark:text-red-400"
            >
              {errors.title.message}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="price"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
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
            className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus-visible:ring-zinc-100/10"
          />
          {errors.price && (
            <span
              id="price-error"
              role="alert"
              className="mt-1.5 block text-xs text-red-500 dark:text-red-400"
            >
              {errors.price.message}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="stock"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
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
            className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus-visible:ring-zinc-100/10"
          />
          {errors.stock && (
            <span
              id="stock-error"
              role="alert"
              className="mt-1.5 block text-xs text-red-500 dark:text-red-400"
            >
              {errors.stock.message}
            </span>
          )}
        </div>

        <div className="col-span-full">
          <label
            htmlFor="category"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            หมวดหมู่
          </label>
          <select
            id="category"
            required
            {...register("category")}
            aria-invalid={!!errors.category}
            aria-describedby="category-error"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition focus:border-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus-visible:ring-zinc-100/10"
          >
            <option
              value=""
              className="bg-white text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
            >
              กรุณาเลือกหมวดหมู่
            </option>
            {CATEGORIES.map((name) => (
              <option
                key={name}
                value={name}
                className="bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
              >
                {name}
              </option>
            ))}
          </select>
          {errors.category && (
            <span
              id="category-error"
              role="alert"
              className="mt-1.5 block text-xs text-red-500 dark:text-red-400"
            >
              {errors.category.message}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800/60">
        <button
          type="submit"
          disabled={!isDirty || !isValid}
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          <Check className="h-4 w-4" />
          <span>{editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}</span>
        </button>

        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
          >
            <X className="h-4 w-4" />
            <span>ยกเลิก</span>
          </button>
        )}
      </div>
    </form>
  );
}
