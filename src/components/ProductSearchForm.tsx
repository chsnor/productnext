import { zodResolver } from "@hookform/resolvers/zod";
import {
  SORT_FIELDS,
  SearchQuery,
  SearchQuerySchema,
  defaultQuery,
} from "src/lib/products";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm({
  onSearch,
}: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    mode: "onTouched",
    defaultValues: defaultQuery,
  });

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      noValidate
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm mb-6 max-w-2xl flex flex-wrap items-end gap-4"
    >
      <div className="flex-1 min-w-[140px]">
        <label
          htmlFor="limit"
          className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider"
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
          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
        />
        {errors.limit && (
          <span
            id="limit-error"
            role="alert"
            className="text-red-500 dark:text-red-400 text-xs mt-1 block"
          >
            {errors.limit?.message}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-[160px]">
        <label
          htmlFor="sortBy"
          className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider"
        >
          เรียงตาม
        </label>
        <select
          id="sortBy"
          {...register("sortBy")}
          className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
        >
          {SORT_FIELDS.map((field) => (
            <option
              key={field}
              value={field}
              className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800"
            >
              {field}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition disabled:opacity-50 shadow-sm h-[40px]"
      >
        <Search className="w-4 h-4" />
        <span>{isSubmitting ? "กำลังค้นหา..." : "ค้นหา"}</span>
      </button>
    </form>
  );
}
