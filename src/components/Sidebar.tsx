import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart, Users, Package, DollarSign, PlusCircle, X, Menu, List } from 'lucide-react';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { path: '/filled-carts', icon: ShoppingCart, label: 'Filled Carts' },
    { path: '/users', icon: Users, label: 'Users List' },
    { path: '/orders', icon: List, label: 'Orders List' },
    { path: '/transactions', icon: DollarSign, label: 'Transactions' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/products/add', icon: PlusCircle, label: 'Add Product' },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Header with Hamburger */}
      {isMobile && (
        <div className="mobile-header">
          <h1>Admin Panel</h1>
          <button
            onClick={toggleMobileMenu}
            className="hamburger-btn"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Admin Panel</h1>
        </div>
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }: { isActive: boolean }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Drawer */}
      {isMobile && (
        <>
          {/* Backdrop */}
          {isMobileMenuOpen && (
            <div
              className="drawer-backdrop"
              onClick={closeMobileMenu}
            />
          )}

          {/* Mobile Sidebar */}
          <aside className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
            <nav className="sidebar-nav">
              <ul className="sidebar-menu">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={({ isActive }: { isActive: boolean }) =>
                        `sidebar-link ${isActive ? 'active' : ''}`
                      }
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
