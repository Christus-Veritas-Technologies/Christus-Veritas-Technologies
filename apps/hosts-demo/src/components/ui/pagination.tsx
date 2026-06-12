import * as React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav role="navigation" aria-label="pagination" className={cn("mx-auto flex w-full justify-center", className)} {...props} />
);

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  )
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = { isActive?: boolean } & React.ComponentProps<"a">;
const PaginationLink = ({ className, isActive, ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({ variant: isActive ? "default" : "outline", size: "icon" }),
      "cursor-pointer",
      className
    )}
    {...props}
  />
);

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<"a">) => (
  <PaginationLink aria-label="Go to previous page" className={cn("gap-1 pl-2.5", className)} {...props}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
    <span>Previous</span>
  </PaginationLink>
);

const PaginationNext = ({ className, ...props }: React.ComponentProps<"a">) => (
  <PaginationLink aria-label="Go to next page" className={cn("gap-1 pr-2.5", className)} {...props}>
    <span>Next</span>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
  </PaginationLink>
);

export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext };
