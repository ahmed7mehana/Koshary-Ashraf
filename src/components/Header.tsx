import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { state } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'الرئيسية', nameAr: 'الرئيسية', href: '/' },
    { name: 'القائمة', nameAr: 'القائمة', href: '/menu' },
    { name: 'طلباتي', nameAr: 'طلباتي', href: '/orders' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header 
      className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Always visible */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-primary to-red-600 rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <img src="./image/logo.jpg" alt="logo" className="w-12 h-12 rounded-full" />
              </motion.div>
              <div className="arabic-font">
                <h1 className="text-xl font-bold text-primary" > كشري اشرف </h1>
                </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
            {navigation.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  className={`relative text-sm font-medium transition-all duration-300 hover:text-primary arabic-font group ${
                    isActive(item.href) ? 'text-primary' : 'text-gray-600'
                  }`}
                >
                  {item.nameAr}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"
                    initial={false}
                    animate={{ width: isActive(item.href) ? '100%' : '0%' }}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* User Profile - Only visible on large screens */}
            {user && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:flex items-center space-x-2 rtl:space-x-reverse"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse bg-gray-50 px-3 py-1.5 rounded-full">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 arabic-font">{user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* Cart - Always visible */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/cart" className="relative">
                <Button variant="outline" size="sm" className="relative shadow-sm">
                  <ShoppingCart className="h-4 w-4" />
                  <AnimatePresence>
                    {state.items.length > 0 && (
                      <motion.span 
                        className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </Link>
            </motion.div>

            {/* Mobile menu button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="shadow-sm"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isMenuOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t bg-white/95 backdrop-blur-md"
            >
              <motion.div 
                className="py-6 space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      className={`block py-3 px-4 text-lg font-medium transition-all duration-300 rounded-lg mx-2 arabic-font ${
                        isActive(item.href) 
                          ? 'text-primary bg-primary/10 border-l-4 border-primary' 
                          : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.nameAr}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile User Actions */}
                <motion.div 
                  className="border-t pt-4 px-4 space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {user ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 arabic-font">أهلاً {user.name}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full arabic-font"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        تسجيل الخروج
                      </Button>
                    </div>
                  ) : null}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </motion.header>
  );
};

export default Header;
