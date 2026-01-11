import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  if (cartItems.length === 0) {
    return <p className="p-6">Your cart is empty</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

      {cartItems.map((item) => (
        <div
          key={item._id}
          className="flex justify-between items-center border-b py-4"
        >
          <div>
            <h2 className="font-semibold">{item.name}</h2>
            <p>₹ {item.price} × {item.qty}</p>
          </div>

          <button
            onClick={() => removeFromCart(item._id)}
            className="text-red-600"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="mt-6 space-y-3">
        <h2 className="text-xl font-bold">Total: ₹ {total}</h2>

        <button
          onClick={() => navigate("/checkout")}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Proceed to Checkout
        </button>

        <button
          onClick={clearCart}
          className="bg-gray-300 px-6 py-2 rounded"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;
