import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { useAuthStore } from '../store/authStore';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button 
              onClick={handleLogoClick}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TeacherMate</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => setAuthModal('login')}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Login
              </button>
              <button 
                onClick={() => setAuthModal('signup')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => {
                  setAuthModal('login');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-indigo-600 hover:text-indigo-800"
              >
                Login
              </button>
              <button 
                onClick={() => {
                  setAuthModal('signup');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </nav>

      <AuthModal 
        isOpen={authModal !== null}
        onClose={() => setAuthModal(null)}
        type={authModal || 'login'}
      />
    </>
  );
}