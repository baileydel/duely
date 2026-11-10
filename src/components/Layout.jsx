import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app">
      <header className="site-header">
        <Link to="/" className="brand" aria-label="duely, home">
          duely
        </Link>
        <nav className="site-nav" aria-label="Main">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/add">Add</NavLink>
          <NavLink to="/help">Help</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
