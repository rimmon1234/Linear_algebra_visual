import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1 text-xs text-slate-400 mb-6" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center space-x-1">
            {index > 0 && <ChevronRight className="h-3 w-3 text-slate-600" />}
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-slate-200 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-medium text-slate-200" : ""}>{item.label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
