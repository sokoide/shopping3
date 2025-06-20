import { CartItem, OrderLogEntry } from '../types';

// Simulate a backend API call for checkout
export const processCheckout = (
  userEmail: string,
  cartItems: CartItem[],
  cartTotal: number
): Promise<{ success: boolean; message: string; orderId?: string }> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Simulate random success/failure (e.g., 80% success rate)
      const isSuccess = Math.random() < 0.8;

      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const timestamp = new Date().toISOString();
      const orderLogEntry: OrderLogEntry = {
        orderId,
        userEmail,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cartTotal,
        timestamp,
      };

      if (isSuccess) {

        // Log the order (in a real app, this would be sent to a backend database)
        var items = "";
        orderLogEntry.items.forEach(item => {
          items += (`${item.name} (ID: ${item.id}), Qty: ${item.quantity}, Price: $${item.price.toFixed(2)},`);
        });
        if (items.length > 0) {
          items = items.slice(0, -1); // Remove the last ',' if present
        }
        console.log(`Order placed. User:${orderLogEntry.userEmail}, ID:${orderLogEntry.orderId}, Timestamp:${orderLogEntry.timestamp}, Items:${orderLogEntry.totalAmount.toFixed(2)}, ${items}`);

        resolve({
          success: true,
          message: 'Your order has been placed successfully!',
          orderId: orderId,
        });
      } else {
        // Simulate different potential error messages
        const errorMessages = [
          "Credit card service is down. Please try again later.",
          "Unable to connect to the payment gateway. Please try again later.",
          "An unexpected error occurred. Please contact support.",
        ];
        const randomErrorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        console.error(`Checkout failed: User:${orderLogEntry.userEmail}, ID:${orderLogEntry.orderId}, Reason: ${randomErrorMessage}`);
        resolve({
          success: false,
          message: randomErrorMessage,
        });
      }
    }, 1500 + Math.random() * 1000); // Simulate 1.5 to 2.5 seconds delay
  });
};
