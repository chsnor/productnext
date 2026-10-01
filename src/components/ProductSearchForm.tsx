import { zodResolver } from "@hookform/resolvers/zod";
import {
  SORT_FIELDS,
  SearchQuery,
  SearchQuerySchema,
} from "src/lib/products";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";

type ProductSearchFormProps = {
  defaultValues: SearchQuery;
  onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm({
  defaultValues,
  onSearch,
}: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    mode: "onTouched",
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      noValidate
      className="mb-6 flex max-w-2xl flex-wrap items-end gap-4 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="min-w-[160px] flex-1">
        <label
          htmlFor="q"
          className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400"
        >
          คำค้นหา
        </label>
        <input
          id="q"
          {...register("q")}
          aria-invalid={!!errors.q}
          aria-describedby="q-error"
          placeholder="ค้นหาชื่อสินค้า..."
          className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 transition placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus-visible:ring-zinc-100/10"
        />
        {errors.q && (
          <span
            id="q-error"
            role="alert"
            className="mt-1 block text-xs text-red-500 dark:text-red-400"
          >
            {errors.q?.message}
          </span>
        )}
      </div>

      <div className="min-w-[140px] flex-1">
        <label
          htmlFor="limit"
          className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400"
        >
          จำนวนรายการ
        </label>
        <input
          id="limit"
          type="number"
          required
          {...register("limit", { valueAsNumber: true })}
          aria-invalid={!!errors.limit}
          aria-describedby="limit-error"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 transition focus:border-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus-visible:ring-zinc-100/10"
        />
        {errors.limit && (
          <span
            id="limit-error"
            role="alert"
            className="mt-1 block text-xs text-red-500 dark:text-red-400"
          >
            {errors.limit?.message}
          </span>
        )}
      </div>

      <div className="min-w-[160px] flex-1">
        <label
          htmlFor="sortBy"
          className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400"
        >
          เรียงตาม
        </label>
        <select
          id="sortBy"
          {...register("sortBy")}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 transition focus:border-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus-visible:ring-zinc-100/10"
        >
          {SORT_FIELDS.map((field) => (
            <option
              key={field}
              value={field}
              className="bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
            >
              {field}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition disabled:opacity-50 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        <Search className="h-4 w-4" />
        <span>{isSubmitting ? "กำลังค้นหา..." : "ค้นหา"}</span>
      </button>
    </form>
  );
}
