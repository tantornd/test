import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Package, LogOut, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Navigation() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Package className="size-6" />
            <span>Inventory System</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/products" className="hover:opacity-80 transition-opacity">
              Products
            </Link>

            {role === 'staff' && (
              <Link to="/my-requests" className="hover:opacity-80 transition-opacity">
                My Requests
              </Link>
            )}

            {role === 'admin' && (
              <>
                <Link to="/products" className="hover:opacity-80 transition-opacity">
                  Product Management
                </Link>
                <Link to="/all-requests" className="hover:opacity-80 transition-opacity">
                  All Requests
                </Link>
              </>
            )}

            {/* Auth Buttons */}
            {role === 'guest' ? (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-blue-700"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-blue-700 flex items-center gap-2">
                    {user?.name}
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
