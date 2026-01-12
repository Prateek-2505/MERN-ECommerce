const STATUSES = [
  "Order Placed",
  "Payment Completed",
  "Processing",
  "Shipped",
  "Delivered",
];

const OrderTimeline = ({ currentStatus, isPaid }) => {
  const getCurrentIndex = () => {
    if (!isPaid) return 0;

    switch (currentStatus) {
      case "Pending":
        return 1;
      case "Processing":
        return 2;
      case "Shipped":
        return 3;
      case "Delivered":
        return 4;
      default:
        return 0;
    }
  };

  const currentIndex = getCurrentIndex();

  return (
    <div className="flex justify-between items-center my-6">
      {STATUSES.map((status, index) => {
        const isCompleted = index <= currentIndex;

        return (
          <div
            key={status}
            className="flex-1 flex flex-col items-center"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                isCompleted
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {isCompleted ? "✓" : index + 1}
            </div>

            <p
              className={`mt-2 text-sm text-center ${
                isCompleted
                  ? "text-green-700"
                  : "text-gray-500"
              }`}
            >
              {status}
            </p>

            {index !== STATUSES.length - 1 && (
              <div
                className={`h-1 w-full mt-2 ${
                  isCompleted
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
