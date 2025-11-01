import React from 'react';
import { Home, ShoppingBag, Users, Package, BarChart2, LogOut, User, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/admin/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { path: "/admin/users", icon: <Users size={20} />, label: "User Management" },
    { path: "/admin/products", icon: <ShoppingBag size={20} />, label: "Product Management" },
    { path: "/admin/categories", icon: <ShoppingBag size={20} />, label: "Category Management" },
    { path: "/admin/orders", icon: <Package size={20} />, label: "Order Management" },
    { path: "/admin/reports", icon: <BarChart2 size={20} />, label: "Reports" },
  ];

  const accountPages = [
    { path: "/admin/profile", icon: <User size={20} />, label: "Profile" },
    { path: "/auth", icon: <LogIn size={20} />, label: "Sign In" },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg p-4 flex flex-col h-screen fixed top-0 left-0">
      <div className="mb-6 pb-4 border-b border-gray-200 text-center">
        <Link to="/admin/dashboard" className="text-xl font-bold text-gray-800 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" className="h-8 w-8 mr-2 text-blue-600">
            <path
              fill="currentColor"
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            />
          </svg>
          NexBuy
        </Link>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200
                  ${location.pathname === item.path ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Account Pages</h3>
          <ul>
            {accountPages.map((item) => (
              <li key={item.path} className="mb-2">
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200
                    ${location.pathname === item.path ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-200">
        <button className="flex items-center space-x-3 p-3 rounded-lg w-full text-red-500 hover:bg-red-50 transition-colors duration-200">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
