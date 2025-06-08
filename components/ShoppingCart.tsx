import React from 'react';
import { CartItem } from '../types';
import ShoppingCartItem from './ShoppingCartItem';
import Button from './Button';

interface ShoppingCartProps {
  cartItems: CartItem[];
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  cartTotal: number;
  onNavigateToCheckout: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  cartItems,
  onRemoveFromCart,
  onUpdateQuantity,
  cartTotal,
  onNavigateToCheckout,
}) => {
  return (
    <aside className="bg-white p-6 rounded-lg shadow-lg sticky top-28"> {/* sticky top adjusted for header height */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 mr-2 text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
        Your Cart
      </h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Your cart is empty.</p>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2"> {/* Scrollable cart items */}
          {cartItems.map((item) => (
            <ShoppingCartItem
              key={item.id}
              item={item}
              onRemoveFromCart={onRemoveFromCart}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </div>
      )}
      {cartItems.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center text-xl font-semibold text-gray-800">
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <Button 
            onClick={onNavigateToCheckout}
            variant="secondary"
            className="w-full mt-4"
            size="lg"
            aria-label="Proceed to checkout"
          >
            Proceed to Checkout
          </Button>
        </div>
      )}
    </aside>
  );
};

export default ShoppingCart;
