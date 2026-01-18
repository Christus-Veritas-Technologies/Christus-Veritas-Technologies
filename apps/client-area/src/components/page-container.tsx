import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
    children: ReactNode;
    className?: string;
}

/**
 * PageContainer - Standard container for all admin pages
 * Provides consistent padding, spacing, and background
 */
export function PageContainer({ children, className }: PageContainerProps) {
    return (
        <div className={cn("p-8 space-y-6 bg-[#E8E7E3] min-h-screen", className)}>
            {children}
        </div>
    );
}
