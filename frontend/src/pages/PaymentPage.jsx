import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../api/paymentApi";
import { getMyOrderById } from "../api/orderApi";

const PaymentPage = ({ theme }) => {
  const isDark = theme === "dark";

  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getMyOrderById(id, token);
        setOrder(data.order);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  /* ================= PAY NOW ================= */
  const payNow = async () => {
    if (!order) return;

    try {
      setPaying(true);

      const data = await createRazorpayOrder(
        order._id,
        token
      );

      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "MERN Store",
        description: "Order Payment",
        order_id: data.razorpay_order_id,
        handler: async function (response) {
          await verifyRazorpayPayment(
            {
              orderId: order._id,
              razorpay_order_id:
                response.razorpay_order_id,
              razorpay_payment_id:
                response.razorpay_payment_id,
              razorpay_signature:
                response.razorpay_signature,
            },
            token
          );

          navigate(`/my-orders/${order._id}`);
        },
        theme: {
          color: isDark ? "#0f172a" : "#020617",
        },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Payment initiation failed"
      );
      setPaying(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className={isDark ? "text-slate-300" : "text-slate-700"}>
          Loading payment…
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500 font-medium">
          Order not found
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div
        className={`rounded-xl border p-6 shadow-sm
          ${
            isDark
              ? "bg-slate-900 border-slate-700 text-slate-100"
              : "bg-white border-slate-200 text-slate-900"
          }`}
      >
        <h1 className="text-xl font-bold mb-4">
          Complete Payment
        </h1>

        <p
          className={`mb-6 ${
            isDark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          You are about to pay for your order.
        </p>

        <div
          className={`mb-6 flex justify-between font-semibold text-lg ${
            isDark ? "text-slate-200" : "text-slate-800"
          }`}
        >
          <span>Total</span>
          <span>₹ {order.totalPrice}</span>
        </div>

        <button
          onClick={payNow}
          disabled={paying}
          className={`w-full py-3 rounded-lg font-semibold transition
            ${
              paying
                ? "bg-gray-400 cursor-not-allowed text-white"
                : isDark
                ? "bg-white text-black hover:opacity-90"
                : "bg-green-600 text-white hover:opacity-90"
            }`}
        >
          {paying ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
