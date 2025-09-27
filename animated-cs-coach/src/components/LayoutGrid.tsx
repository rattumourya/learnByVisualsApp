import type { ReactNode } from 'react';

export function LayoutGrid({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:flex-row md:px-6">
      {children}
    </div>
  );
}
