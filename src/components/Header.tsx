import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bell, ChevronDown } from 'lucide-react';
import Logo from './Logo';

export default function Header() {
  const { user } = useAuth();

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
          <Link to="/">
            <Logo />
          </Link>

          <div className="flex items-center space-x-4">
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
      </div>
    </header>
  );
} 