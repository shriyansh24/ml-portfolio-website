import { ReactNode } from 'react';

interface TagsLayoutProps {
  children: ReactNode;
}

export default function TagsLayout({ children }: TagsLayoutProps) {
  return (
    <section className="min-h-screen">
      {children}
    </section>
  );
}