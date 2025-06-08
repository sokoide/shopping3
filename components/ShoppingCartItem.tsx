
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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.03 3.22.077m3.22-.077L10.88 5.79m5.235 0c-.381.264-.756.55-1.106.862M9.69 5.79L9.076 3.53a.75.75 0 01.428-.871l1.06-.353a.75.75 0 01.87.428l.223.67N19.5 9.75l1.586-1.586a.75.75 0 00-1.06-1.06L18.44 8.69m.61 1.06l-1.06-1.06M15 9.75L16.06 8.69m-4.568 1.06L9.372 8.69m5.096 1.06l-1.586-1.586a.75.75 0 00-1.06 1.06L13.44 9.75m-4.06 0L7.8 8.172a.75.75 0 00-1.06 1.06L8.328 9.75m3.832-3.832a.75.75 0 00-1.06-1.06L10.5 6.338m2.732 0l-.612-.612a.75.75 0 00-1.06 1.061l.612.612M9 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zm3 0a.75.75 0 110-1.5.75.75 0 010 1.5zm3 0a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default ShoppingCartItem;
