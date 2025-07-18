import { ReactNode } from 'react';

interface TagLayoutProps {
  children: ReactNode;
}

export default function TagLayout({ children }: TagLayoutProps) {
  return (
    <section className="min-h-screen">
      {children}
    </section>
  );
}