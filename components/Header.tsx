import React from 'react';
import Button from './Button';

interface HeaderProps {
  cartItemCount: number;
  onOpenGeminiAssistant: () => void;
  onNavigateToCheckout: () => void;
  userEmail: string | null;
  onLogout: () => void;
  isCartEmpty: boolean;
}

const Header: React.FC<HeaderProps> = ({
  cartItemCount,
  onOpenGeminiAssistant,
  onNavigateToCheckout,
  userEmail,
  onLogout,
  isCartEmpty
}) => {
  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-2 text-secondary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight">sokoide.com shopping</h1>
        </div>
        <div className="flex items-center space-x-4">
          {userEmail && (
            <span className="text-sm hidden sm:block">Welcome, {userEmail}!</span>
          )}
          <button
            onClick={onNavigateToCheckout}
            className="relative p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="View shopping cart and proceed to checkout"
            disabled={isCartEmpty}
            title={isCartEmpty ? "Your cart is empty" : "View Cart & Checkout"}
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
          {userEmail && (
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
