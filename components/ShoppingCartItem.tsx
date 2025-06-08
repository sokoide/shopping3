import React from 'react';
import { CartItem } from '../types';
import Button from './Button';

interface ShoppingCartItemProps {
  item: CartItem;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const ShoppingCartItem: React.FC<ShoppingCartItemProps> = ({
  item,
  onRemoveFromCart,
  onUpdateQuantity,
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-3">
        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
        <div>
          <h4 className="font-semibold text-gray-700">{item.name}</h4>
          <p className="text-sm text-gray-500">${item.price.toFixed(2)} x {item.quantity}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-l-md focus:outline-none"
            aria-label="Decrease quantity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
          </button>
          <span className="px-2 text-sm font-medium text-gray-700">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-r-md focus:outline-none"
            aria-label="Increase quantity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
        <Button
            onClick={() => onRemoveFromCart(item.id)}
            variant="danger"
            size="icon"
            aria-label="Remove item"
        >
          <svg xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 18M9 9v6m6-6v6M10 4h4m-4 0a1 1 0 00-1 1v1h6V5a1 1 0 00-1-1m-4 0h4M4 7h16l-1 12a2 2 0 01-2 2H7a2 2 0 01-2-2L4 7z" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default ShoppingCartItem;
