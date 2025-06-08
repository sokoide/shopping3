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

      if (isSuccess) {
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

        // Log the order (in a real app, this would be sent to a backend database)
        console.log("--- ORDER PLACED ---");
        console.log("User:", orderLogEntry.userEmail);
        console.log("Order ID:", orderLogEntry.orderId);
        console.log("Timestamp:", orderLogEntry.timestamp);
        console.log("Total Amount: $", orderLogEntry.totalAmount.toFixed(2));
        console.log("Items:");
        orderLogEntry.items.forEach(item => {
          console.log(`  - ${item.name} (ID: ${item.id}), Qty: ${item.quantity}, Price: $${item.price.toFixed(2)}`);
        });
        console.log("--------------------");

        resolve({
          success: true,
          message: 'Your order has been placed successfully!',
          orderId: orderId,
        });
      } else {
        // Simulate different potential error messages
        const errorMessages = [
          "Payment processing failed. Please check your payment details and try again.",
          "One or more items in your cart are out of stock.",
          "Unable to connect to the payment gateway. Please try again later.",
          "An unexpected error occurred. Please contact support.",
        ];
        const randomErrorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        console.error("--- CHECKOUT FAILED ---");
        console.error("User:", userEmail);
        console.error("Reason:", randomErrorMessage);
        console.error("-----------------------");
        resolve({
          success: false,
          message: randomErrorMessage,
        });
      }
    }, 1500 + Math.random() * 1000); // Simulate 1.5 to 2.5 seconds delay
  });
};
