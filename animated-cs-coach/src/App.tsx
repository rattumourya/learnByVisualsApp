import { Outlet } from 'react-router-dom';

import { AppFooter } from './components/AppFooter';
import { AppHeader } from './components/AppHeader';
import { AppSidebar } from './components/AppSidebar';
import { LayoutGrid } from './components/LayoutGrid';

export function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <LayoutGrid>
        <AppSidebar />
        <main id="main" className="flex-1 px-4 pb-16 pt-6 md:px-8">
          <Outlet />
        </main>
      </LayoutGrid>
      <AppFooter />
    </div>
  );
}

export default App;
