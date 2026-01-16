import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/orderApi";
import { getProduct } from "../api/productApi";
import {
  getMyAddresses,
} from "../api/addressApi";
import AddressForm from "../components/AddressForm";
import SavedAddressSelect from "../components/SavedAddressSelect";

const Checkout = ({ theme }) => {
  const isDark = theme === "dark";
  const { cartItems, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [saveAddress, setSaveAddress] = useState(false);
  const [isUsingSaved, setIsUsingSaved] =
    useState(false);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  useEffect(() => {
    if (!token) return;
    getMyAddresses(token)
      .then((res) => setAddresses(res.addresses))
      .catch(() => {});
  }, [token]);

  const placeOrderHandler = async () => {
  if (!token) {
    alert("Session expired. Please login again.");
    return;
  }

  try {
    const orderItems = cartItems.map((item) => ({
      product: item._id,
      name: item.name,
      price: item.price,
      qty: item.qty,
      image: item.image,
    }));

    const res = await createOrder(
      orderItems,
      address,
      saveAddress,
      token
    );

    clearCart();
    navigate(`/my-orders/${res.order._id}`);
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Failed to place order"
    );
  }
};


  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SavedAddressSelect
        theme={theme}
        addresses={addresses}
        onSelect={(addr) => {
          setIsUsingSaved(true);
          setSaveAddress(false);
          setAddress({
            fullName: addr.fullName,
            phone: addr.phone,
            addressLine1: addr.addressLine1,
            addressLine2: addr.addressLine2 || "",
            city: addr.city,
            state: addr.state,
            postalCode: addr.postalCode,
            country: addr.country,
          });
        }}
      />

      <AddressForm
        theme={theme}
        address={address}
        setAddress={(a) => {
          setIsUsingSaved(false);
          setAddress(a);
        }}
        saveAddress={saveAddress}
        setSaveAddress={setSaveAddress}
      />

      <button
        onClick={placeOrderHandler}
        className={`w-full py-3 rounded-lg font-semibold ${
          isDark
            ? "bg-white text-black"
            : "bg-black text-white"
        }`}
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
