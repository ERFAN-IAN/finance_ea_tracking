import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/types/category";
// import { UpdateCategoryForm } from "../forms/category/UpdateCategoryForm";
// import { DeleteCategoryForm } from "../forms/category/DeleteCategoryForm";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Card className="border-2 border-violet-200 bg-linear-to-br from-violet-50/70 via-slate-50 to-white hover:border-violet-300 transition-all duration-200 shadow-sm hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-semibold tracking-tight">
          {category.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex justify-end gap-2">
        {/* <UpdateCategoryForm category={category} />
        <DeleteCategoryForm category={category} /> */}
      </CardContent>
    </Card>
  );
}
