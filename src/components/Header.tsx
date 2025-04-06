import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bell, ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Find Bikes', href: '/map' },
  { name: 'Ride History', href: '/rides' },
  { name: 'Pricing', href: '/pricing' }
];

export default function Header() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
              <Link to="/">
                <Logo />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-error text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                {user?.name ? getInitials(user.name) : 'U'}
              </div>
              <span className="text-gray-700">{user?.name || 'User'}</span>
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronDown className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center space-x-2 px-4 py-2">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {user?.name ? getInitials(user.name) : 'U'}
                </div>
                <span className="text-gray-700">{user?.name || 'User'}</span>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 