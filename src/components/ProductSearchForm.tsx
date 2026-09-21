import { zodResolver } from "@hookform/resolvers/zod";
import {
  SORT_FIELDS,
  SearchQuery,
  SearchQuerySchema,
  defaultQuery,
} from "src/lib/products";
import { useForm } from "react-hook-form";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};
export default function ProductSearchForm({
  onSearch,
}: ProductSearchFormProps) {
  const {
    register,
    formState: { errors },
  } = useForm<SearchQuery>({
    // เติม: ตัวเชื:อมที:ทําให้ React Hook Form ตรวจข้อมูลด้วย Zod Schema
    resolver: zodResolver(SearchQuerySchema),
    mode: "onTouched",
    defaultValues: defaultQuery,
  });
  return (
    <form>
      <label htmlFor="limit">จํานวนรายการ</label>
      <input
        id="limit"
        type="number"
        required
        {...register("limit", { valueAsNumber: true })}
        aria-invalid={!!errors.limit}
        aria-describedby="limit-error"
      />
      <span id="limit-error" role="alert">
        {errors.limit?.message}
      </span>
      <label htmlFor="sortBy">เรียงตาม</label>
      <select id="sortBy" {...register("sortBy")}>
        {SORT_FIELDS.map((field) => (
          <option key={field} value={field}>
            {field}
          </option>
        ))}
      </select>
      <button type="submit">ค้นหา</button>
    </form>
  );
}
