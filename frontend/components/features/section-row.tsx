import { ReactNode } from "react";

export function SectionRow({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="px-4 md:px-6 py-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {children}
      </div>
    </section>
  );
}