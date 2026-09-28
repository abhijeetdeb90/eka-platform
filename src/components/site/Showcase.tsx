import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export function ShowcaseLayout({
  eyebrow,
  title,
  lede,
  image,
  imageAlt,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  image: string;
  imageAlt: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-border/60">
          <img
            src={image}
            alt={imageAlt}
            width={1600}
            height={1008}
            className="absolute inset-0 size-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
          <div className="container-eka relative py-24 lg:py-32">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">{eyebrow}</p>
            <h1 className="mt-6 max-w-3xl text-4xl leading-[1.08] sm:text-5xl">{title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{lede}</p>
            <Button asChild size="lg" className="mt-9">
              <Link to="/join">Join EKA</Link>
            </Button>
          </div>
        </section>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export function ShowcaseGrid({
  items,
}: {
  items: readonly { title: string; body: string; meta?: string }[];
}) {
  return (
    <section className="py-20">
      <div className="container-eka grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="bg-card p-8">
            {item.meta && (
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {item.meta}
              </p>
            )}
            <h2 className="mt-2 text-lg leading-snug">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ShowcaseSplit({
  image,
  imageAlt,
  title,
  body,
  points,
}: {
  image: string;
  imageAlt: string;
  title: string;
  body: string;
  points: readonly string[];
}) {
  return (
    <section className="border-y border-border/60 bg-sand/50 py-20">
      <div className="container-eka grid items-center gap-12 lg:grid-cols-2">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          width={1600}
          height={1008}
          className="rounded-2xl object-cover shadow-lift"
        />
        <div>
          <h2 className="text-3xl leading-snug">{title}</h2>
          <p className="mt-5 text-muted-foreground">{body}</p>
          <ul className="mt-7 space-y-3 text-sm text-muted-foreground">
            {points.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
