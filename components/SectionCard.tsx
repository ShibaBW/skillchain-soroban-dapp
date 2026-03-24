import { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
};

export function SectionCard({
  title,
  eyebrow,
  description,
  children,
}: SectionCardProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur md:p-8">
      <div className="mb-6">
        {eyebrow ? (
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.32em] text-ember-300">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
