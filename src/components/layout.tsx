import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../hooks/use-auth';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/stores', label: 'Stores' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="sidebar" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-200 lg:hidden">
          <label htmlFor="sidebar" className="btn btn-square btn-ghost drawer-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <span className="text-lg font-bold ml-2">GT Backoffice</span>
        </div>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      <div className="drawer-side">
        <label htmlFor="sidebar" aria-label="close sidebar" className="drawer-overlay" />
        <aside className="bg-base-200 w-64 min-h-full flex flex-col">
          <div className="p-4 text-xl font-bold">GT Backoffice</div>
          <ul className="menu flex-1 px-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  end={item.to === '/'}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {user && (
            <div className="border-t border-base-300 p-4">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-9 rounded-full">
                    <img src={user.picture} alt={user.name} referrerPolicy="no-referrer" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm w-full mt-2"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
