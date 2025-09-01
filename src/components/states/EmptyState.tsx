import { ReactNode } from "react";

export default function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="bg-white text-center space-y-2 py-12 rounded-lg border border-gray-200 shadow-sm">
      <div className="h-12 w-12 mx-auto text-gray-400">{icon}</div>
      <div>
        <p className="text-gray-600 text-lg">{title}</p>
        {description && <p className="text-gray-500">{description}</p>}
      </div>
    </div>
  );
}
