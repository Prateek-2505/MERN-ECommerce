import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/orderApi";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Your cart is empty</p>
      </div>
    );
  }

  const placeOrderHandler = async () => {
    try {
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        image: item.image,
      }));

      await createOrder(orderItems, token);

      clearCart();
      alert("Order placed successfully");
      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to place order"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between border-b py-3"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">
                ₹ {item.price} × {item.qty}
              </p>
            </div>

            <p className="font-semibold">
              ₹ {item.price * item.qty}
            </p>
          </div>
        ))}

        <div className="mt-6 flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>₹ {total}</span>
        </div>

        <button
          onClick={placeOrderHandler}
          className="mt-6 w-full bg-black text-white py-3 rounded"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
