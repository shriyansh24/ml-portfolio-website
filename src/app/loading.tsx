export default function Loading() {
  return (
    <div className="container mx-auto py-24 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  );
}