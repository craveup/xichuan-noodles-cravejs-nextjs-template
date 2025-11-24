"use client";

const shimmer = "animate-pulse bg-muted";

const ProductDescriptionSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className={`h-64 w-full ${shimmer}`} />
      <div className="flex-1 space-y-4 px-4 py-6">
        <div className={`h-6 w-1/2 rounded ${shimmer}`} />
        <div className={`h-4 w-1/3 rounded ${shimmer}`} />
        <div className={`h-4 w-full rounded ${shimmer}`} />
        <div className={`h-20 w-full rounded ${shimmer}`} />
        <div className={`h-32 w-full rounded ${shimmer}`} />
      </div>
    </div>
  );
};

export default ProductDescriptionSkeleton;
