
import React from 'react';
import { Product } from '../types';
import Button from './Button';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl">
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Category:</span> {product.category}</p>
        <p className="text-sm text-gray-600 mb-4 flex-grow">{product.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
          <Button 
            onClick={() => onAddToCart(product)}
            variant="primary"
            size="sm"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
