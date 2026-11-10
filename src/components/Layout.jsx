import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app">
      <a className="skip-link" href="#main">Skip to content</a>
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
      <main id="main" className="page">
        <Outlet />
      </main>
    </div>
  );
}
