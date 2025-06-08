
import { Product } from './types';

// These INITIAL_PRODUCTS serve as the base data.
// The imageUrls provided here are placeholders/fallbacks.
// App.tsx will attempt to generate dynamic images using Gemini
// and replace these imageUrls upon successful generation.
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Organic Apples',
    price: 3.99,
    imageUrl: 'static/organicapples.jpeg',
    description: 'Crisp and juicy organic apples, perfect for snacking.',
    category: 'Fruits',
  },
  {
    id: '2',
    name: 'Whole Wheat Bread',
    price: 2.49,
    imageUrl: 'static/wholewheatbread.jpeg',
    description: 'Freshly baked whole wheat bread, rich in fiber.',
    category: 'Bakery',
  },
  {
    id: '3',
    name: 'Free-Range Eggs',
    price: 4.99,
    imageUrl: 'static/freerangeeggs.jpeg',
    description: 'A dozen large free-range eggs from happy chickens.',
    category: 'Dairy & Eggs',
  },
  {
    id: '4',
    name: 'Almond Milk',
    price: 3.79,
    imageUrl: 'static/almondmilk.jpeg',
    description: 'Unsweetened almond milk, a great dairy alternative.',
    category: 'Beverages',
  },
  {
    id: '5',
    name: 'Spinach Bunch',
    price: 1.99,
    imageUrl: 'static/spinatchbunch.jpeg',
    description: 'Fresh organic spinach, packed with nutrients.',
    category: 'Vegetables',
  },
  {
    id: '6',
    name: 'Chicken Breast',
    price: 8.99,
    imageUrl: 'static/chickenbreast.jpeg',
    description: 'Boneless, skinless chicken breast, lean and versatile.',
    category: 'Meat & Poultry',
  },
  {
    id: '7',
    name: 'Avocado',
    price: 1.79,
    imageUrl: 'static/avocado.jpeg',
    description: 'Creamy Hass avocado, great for salads and toast.',
    category: 'Fruits',
  },
  {
    id: '8',
    name: 'Greek Yogurt',
    price: 4.29,
    imageUrl: 'static/greekyogurt.jpeg',
    description: 'Plain Greek yogurt, high in protein.',
    category: 'Dairy & Eggs',
  },
];
