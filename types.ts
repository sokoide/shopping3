export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface GeminiSuggestion {
  title: string;
  suggestion: string;
}

export interface User {
  email: string;
}

export interface OrderLogEntry {
  userEmail: string;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
  totalAmount: number;
  timestamp: string;
  orderId: string;
}

export type CurrentPage = 'login' | 'products' | 'checkout';
