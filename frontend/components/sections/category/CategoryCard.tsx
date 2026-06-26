import { DeleteCategoryForm } from "@/components/forms/category/DeleteCategoryForm";
import { UpdateCategoryForm } from "@/components/forms/category/UpdateCategoryForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/types/category";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Card
      className={`
      transition-all
      duration-300
      hover:shadow-lg
    border-sky-500/30
      bg-gradient-to-br
      from-sky-500/5
      via-background
      to-background
      hover:border-sky-500/50
    `}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle className="text-lg font-semibold tracking-tight">
            {category.name}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex justify-end gap-2">
        <UpdateCategoryForm category={category} />
        <DeleteCategoryForm category={category} />
      </CardContent>
    </Card>
  );
}
