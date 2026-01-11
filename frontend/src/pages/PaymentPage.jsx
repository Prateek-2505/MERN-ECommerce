import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../api/paymentApi";
import { getMyOrderById } from "../api/orderApi";

const PaymentPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getMyOrderById(id, token);
      setOrder(data.order);
    };
    fetch();
  }, [id, token]);

  const payNow = async () => {
    const data = await createRazorpayOrder(order._id, token);

    const options = {
      key: data.key,
      amount: data.amount,
      currency: "INR",
      name: "MERN Store",
      order_id: data.razorpay_order_id,
      handler: async function (response) {
        await verifyRazorpayPayment(
          {
            orderId: order._id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          },
          token
        );
        navigate(`/my-orders/${order._id}`);
      },
    };

    new window.Razorpay(options).open();
  };

  if (!order) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Pay ₹{order.totalPrice}</h1>
      <button
        onClick={payNow}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
