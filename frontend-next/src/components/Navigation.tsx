'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/store/authSlice';
import { Button } from './ui/button';
import { Package, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Navigation() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const role = user?.role || 'guest';

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push('/login');
    setMobileMenuOpen(false);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md w-full">
      <div className="container mx-auto px-4 max-w-full">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0" onClick={handleNavClick}>
            <Package className="size-6 shrink-0" />
            <span className="font-semibold text-sm sm:text-base">Inventory System</span>
          </Link>

          <div className="inline-flex items-center gap-2 shrink-0">
            {/* Desktop Navigation Links - Only rendered on desktop (≥768px) */}
            {isDesktop && (
              <nav className="inline-flex items-center gap-2">
                {/* Show Products link only for non-admin users */}
                {role !== 'admin' && (
                  <Link href="/products" className="hover:opacity-80 transition-opacity whitespace-nowrap text-sm">
                    Products
                  </Link>
                )}

                {role === 'staff' && (
                  <Link href="/my-requests" className="hover:opacity-80 transition-opacity whitespace-nowrap text-sm">
                    My Requests
                  </Link>
                )}

                {role === 'admin' && (
                  <>
                    <Link href="/products" className="hover:opacity-80 transition-opacity whitespace-nowrap text-sm">
                      Products
                    </Link>
                    <span className="text-blue-300">|</span>
                    <Link href="/all-requests" className="hover:opacity-80 transition-opacity whitespace-nowrap text-sm">
                      Requests
                    </Link>
                  </>
                )}
              </nav>
            )}

            {/* Auth Buttons - Always visible */}
            {role === 'guest' ? (
              <>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-blue-700 text-sm whitespace-nowrap"
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
                <Button 
                  variant="secondary"
                  className="text-sm whitespace-nowrap hidden sm:inline-flex"
                  onClick={() => router.push('/register')}
                >
                  Register
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-blue-700 inline-flex items-center gap-1 text-sm whitespace-nowrap shrink-0">
                    <span className="max-w-[100px] truncate">{user?.name}</span>
                    <ChevronDown className="size-3 shrink-0" />
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

            {/* Mobile Menu Button - Inside same container */}
            {!isDesktop && (
              <button
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors shrink-0"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="size-6" />
                ) : (
                  <Menu className="size-6" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {!isDesktop && mobileMenuOpen && (
          <div className="border-t border-blue-500 py-4 space-y-3">
            {role !== 'admin' && (
              <Link 
                href="/products" 
                className="block px-4 py-2 hover:bg-blue-700 rounded transition-colors"
                onClick={handleNavClick}
              >
                Products
              </Link>
            )}

            {role === 'staff' && (
              <Link 
                href="/my-requests" 
                className="block px-4 py-2 hover:bg-blue-700 rounded transition-colors"
                onClick={handleNavClick}
              >
                My Requests
              </Link>
            )}

            {role === 'admin' && (
              <>
                <Link 
                  href="/products" 
                  className="block px-4 py-2 hover:bg-blue-700 rounded transition-colors"
                  onClick={handleNavClick}
                >
                  Product Management
                </Link>
                <Link 
                  href="/all-requests" 
                  className="block px-4 py-2 hover:bg-blue-700 rounded transition-colors"
                  onClick={handleNavClick}
                >
                  All Requests
                </Link>
              </>
            )}

            {role === 'guest' && (
              <div className="space-y-2 px-4">
                <Button 
                  variant="ghost" 
                  className="w-full text-white hover:bg-blue-700"
                  onClick={() => { router.push('/login'); handleNavClick(); }}
                >
                  Login
                </Button>
                <Button 
                  variant="secondary"
                  className="w-full"
                  onClick={() => { router.push('/register'); handleNavClick(); }}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

