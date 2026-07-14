export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 px-6 py-10 mt-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-lg font-bold">Pulse</span>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Pulse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}