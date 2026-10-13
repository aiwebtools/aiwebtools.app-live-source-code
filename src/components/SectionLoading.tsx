import { Skeleton } from "@/components/ui/skeleton";

const SectionLoading = () => (
  <div role="status" aria-label="Loading section" className="mx-auto min-h-[35vh] w-full max-w-6xl space-y-5 px-4 py-10">
    <p className="text-center text-sm text-primary">Loading content…</p>
    <Skeleton className="mx-auto h-7 w-2/3 max-w-sm" />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((item) => <Skeleton key={item} className="aspect-video w-full" />)}
    </div>
  </div>
);

export default SectionLoading;