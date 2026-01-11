const PaymentStatusBadge = ({ isPaid }) => {
  return (
    <span
      className={`px-3 py-1 rounded text-sm font-semibold ${
        isPaid
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {isPaid ? "PAID" : "UNPAID"}
    </span>
  );
};

export default PaymentStatusBadge;
