
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Product, CartItem, User, CurrentPage } from './types';
import { INITIAL_PRODUCTS } from './constants';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import ShoppingCart from './components/ShoppingCart';
import GeminiAssistant from './components/GeminiAssistant';
import LoginPage from './components/LoginPage';
import CheckoutPage from './components/CheckoutPage';
import { processCheckout } from './services/checkoutService';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<CurrentPage>('login');
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageGenError, setImageGenError] = useState<string | null>(null);


  useEffect(() => {
    const generateProductImages = async () => {
      if (!process.env.API_KEY) {
        console.warn("API_KEY not found in environment variables. Skipping dynamic product image generation. Using placeholder images.");
        setImageGenError("Gemini API Key (API_KEY environment variable) is not configured. Product images will be placeholders.");
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        console.log("Generating product images dynamically...");

        const updatedProductsPromises = INITIAL_PRODUCTS.map(async (product) => {
          try {
            // console.log(`Attempting to generate image for: ${product.name}`);
            const imageResponse = await ai.models.generateImages({
              model: 'imagen-3.0-generate-002',
              prompt: `A clear, vibrant, high-quality studio photograph of "${product.name}", on a clean white background, suitable for an e-commerce product listing. Ensure the product is the main focus.`,
              config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
            });

            if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0 && imageResponse.generatedImages[0].image.imageBytes) {
              const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
              console.log(`Successfully generated image for ${product.name}`);
              return { ...product, imageUrl: `data:image/jpeg;base64,${base64ImageBytes}` };
            } else {
              console.warn(`No image bytes returned from API for ${product.name}. Keeping placeholder.`);
              return product; 
            }
          } catch (e: any) {
            console.error(`Error generating image for ${product.name}: ${e.message}. Keeping placeholder.`, e);
            setImageGenError(prev => prev ? `${prev}\nFailed to generate image for ${product.name}.` : `Failed to generate image for ${product.name}.`);
            return product; 
          }
        });

        const newProducts = await Promise.all(updatedProductsPromises);
        setProducts(newProducts);
        console.log("Dynamic product image generation process completed.");

      } catch (error: any) {
        console.error('Failed to initialize GoogleGenAI or process product images:', error.message, error);
        setImageGenError("Failed to generate product images due to an initialization error. Using placeholders.");
        // Products state will remain INITIAL_PRODUCTS if this top-level try fails
      }
    };

    if (currentUser) { // Only generate images if user is logged in or it suits the app flow
        generateProductImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]); // Re-run if currentUser changes, or on initial load if currentUser is already set (e.g. from localStorage in a more complex app)


  useEffect(() => {
    if (currentUser) {
      setCurrentPage('products');
    } else {
      setCurrentPage('login');
      setProducts(INITIAL_PRODUCTS); // Reset to initial products with placeholders on logout
    }
  }, [currentUser]);

  const handleLogin = useCallback((email: string) => {
    setCurrentUser({ email });
    // Image generation will be triggered by the useEffect watching currentUser
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setCartItems([]); 
    setCurrentPage('login');
    setProducts(INITIAL_PRODUCTS); // Reset products to placeholders
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0)
    );
  }, []);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const navigateToCheckout = useCallback(() => {
    if (cartItems.length > 0 && currentUser) {
      setCurrentPage('checkout');
      setCheckoutStatus('idle');
      setCheckoutMessage(null);
    }
  }, [cartItems.length, currentUser]);

  const navigateToProducts = useCallback(() => {
    setCurrentPage('products');
  }, []);

  const handleConfirmCheckout = async () => {
    if (!currentUser || cartItems.length === 0) return;

    setCheckoutStatus('loading');
    setCheckoutMessage(null);
    try {
      const result = await processCheckout(currentUser.email, cartItems, cartTotal);
      if (result.success) {
        setCheckoutStatus('success');
        setCheckoutMessage(result.message + (result.orderId ? ` Order ID: ${result.orderId}` : ''));
        setCartItems([]); 
      } else {
        setCheckoutStatus('error');
        setCheckoutMessage(result.message);
      }
    } catch (error: any) {
      setCheckoutStatus('error');
      setCheckoutMessage(error.message || 'An unexpected error occurred during checkout.');
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {currentUser && (
        <Header
          cartItemCount={cartItemCount}
          onOpenGeminiAssistant={() => setIsGeminiModalOpen(true)}
          onNavigateToCheckout={navigateToCheckout}
          userEmail={currentUser.email}
          onLogout={handleLogout}
          isCartEmpty={cartItems.length === 0}
        />
      )}
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
        
        {currentPage === 'products' && currentUser && (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              {/* Pass the 'products' state which may contain generated images */}
              <ProductList products={products} onAddToCart={addToCart} />
            </div>
            <div className="lg:w-1/3">
              <ShoppingCart
                cartItems={cartItems}
                onRemoveFromCart={removeFromCart}
                onUpdateQuantity={updateQuantity}
                cartTotal={cartTotal}
                onNavigateToCheckout={navigateToCheckout}
              />
            </div>
          </div>
        )}

        {currentPage === 'checkout' && currentUser && (
          <CheckoutPage
            cartItems={cartItems}
            cartTotal={cartTotal}
            onConfirmCheckout={handleConfirmCheckout}
            onNavigateBack={navigateToProducts}
            checkoutStatus={checkoutStatus}
            checkoutMessage={checkoutMessage}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
          />
        )}
      </main>
      <Footer />
      {isGeminiModalOpen && currentUser && (
        <GeminiAssistant
          cartItems={cartItems}
          onClose={() => setIsGeminiModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
