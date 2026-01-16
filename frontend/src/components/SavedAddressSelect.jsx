import { useEffect, useState } from "react";

const SavedAddressSelect = ({
  theme,
  addresses,
  onSelect,
}) => {
  const isDark = theme === "dark";
  const [selectedId, setSelectedId] = useState("");

  // 🔹 Auto-select default address
  useEffect(() => {
    const defaultAddress = addresses.find(
      (a) => a.isDefault
    );
    if (defaultAddress) {
      setSelectedId(defaultAddress._id);
      onSelect(defaultAddress);
    }
  }, [addresses, onSelect]);

  if (!addresses.length) return null;

  return (
    <div
      className={`mb-6 p-4 rounded-lg border ${
        isDark
          ? "border-slate-700 bg-slate-900"
          : "border-slate-200 bg-white"
      }`}
    >
      <h2 className="font-semibold mb-3">
        Saved Addresses
      </h2>

      <select
        value={selectedId}
        onChange={(e) => {
          const selected =
            addresses.find(
              (a) => a._id === e.target.value
            );
          setSelectedId(e.target.value);
          if (selected) onSelect(selected);
        }}
        className={`w-full px-4 py-2 rounded border ${
          isDark
            ? "bg-slate-700 border-slate-500 text-slate-100"
            : "bg-white border-slate-300 text-black"
        }`}
      >
        <option value="">
          Select an address
        </option>

        {addresses.map((addr) => (
          <option key={addr._id} value={addr._id}>
            {addr.isDefault ? "⭐ " : ""}
            {addr.addressLine1}, {addr.city}
            {addr.isDefault ? " (Default)" : ""}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SavedAddressSelect;
