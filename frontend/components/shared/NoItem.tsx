import { LucideIcon } from "lucide-react";

export const NoItem = ({
  value,
  Icon,
}: {
  value: string;
  Icon: LucideIcon;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="mb-4 h-10 w-10 text-muted-foreground" />
      <h3 className="text-lg font-semibold">No {value} yet</h3>
      <p className="text-sm text-muted-foreground">
        Create your first {value} to get started.
      </p>
    </div>
  );
};
