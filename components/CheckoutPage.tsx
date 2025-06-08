import React from 'react';
import { CartItem } from '../types';
import Button from './Button';
import ShoppingCartItem from './ShoppingCartItem';
import LoadingSpinner from './LoadingSpinner';

interface CheckoutPageProps {
  cartItems: CartItem[];
  cartTotal: number;
  onConfirmCheckout: () => Promise<void>;
  onNavigateBack: () => void;
  checkoutStatus: 'idle' | 'loading' | 'success' | 'error';
  checkoutMessage: string | null;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  cartTotal,
  onConfirmCheckout,
  onNavigateBack,
  checkoutStatus,
  checkoutMessage,
  onUpdateQuantity,
  onRemoveFromCart,
}) => {
  const handleConfirmCheckout = async () => {
    console.log('Proceed to checkout button clicked');
    await onConfirmCheckout();
  };

  if (cartItems.length === 0 && checkoutStatus !== 'success') {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">There are no items in your cart to checkout.</p>
        <Button onClick={onNavigateBack} variant="primary">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">Checkout Summary</h1>

      {checkoutStatus === 'loading' && (
        <div className="flex flex-col items-center justify-center my-10">
          <LoadingSpinner />
          <p className="mt-3 text-lg text-gray-600">Processing your order...</p>
        </div>
      )}

      {checkoutStatus === 'success' && checkoutMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-6 rounded-md my-6 shadow-md" role="alert">
          <h3 className="text-xl font-semibold mb-2">Order Successful!</h3>
          <p>{checkoutMessage}</p>
          <Button onClick={onNavigateBack} variant="secondary" className="mt-4">
            Back to Shopping
          </Button>
        </div>
      )}

      {checkoutStatus === 'error' && checkoutMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-md my-6 shadow-md" role="alert">
          <h3 className="text-xl font-semibold mb-2">Checkout Failed</h3>
          <p>{checkoutMessage}</p>
          <Button onClick={handleConfirmCheckout} variant="danger" className="mt-4 mr-2">
            Try Again
          </Button>
          <Button onClick={onNavigateBack} variant="outline" className="mt-4">
            Back to Shopping
          </Button>
        </div>
      )}

      {checkoutStatus !== 'loading' && checkoutStatus !== 'success' && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Items in your cart:</h2>
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <ShoppingCartItem
                    key={item.id}
                    item={item}
                    onRemoveFromCart={onRemoveFromCart}
                    onUpdateQuantity={onUpdateQuantity}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Your cart is currently empty.</p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-2xl font-bold text-gray-800 mb-6">
              <span>Order Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <Button onClick={onNavigateBack} variant="outline" size="lg">
                Back to Shopping
              </Button>
              <Button
                onClick={handleConfirmCheckout}
                variant="primary"
                size="lg"
                disabled={cartItems.length === 0}
                className="w-full sm:w-auto"
              >
                Confirm Purchase
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
