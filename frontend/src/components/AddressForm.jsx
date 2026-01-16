const AddressForm = ({
  theme,
  address,
  setAddress,
  saveAddress,
  setSaveAddress,
}) => {
  const isDark = theme === "dark";

  const inputClass = `w-full px-4 py-2 rounded border outline-none ${
    isDark
      ? "bg-slate-700 border-slate-500 text-slate-100 placeholder-slate-400"
      : "bg-white border-slate-300 text-black"
  }`;

  return (
    <div
      className={`mb-6 p-4 rounded-lg border ${
        isDark
          ? "border-slate-700 bg-slate-900"
          : "border-slate-200 bg-white"
      }`}
    >
      <h2 className="font-semibold mb-4">
        Shipping Address
      </h2>

      <div className="space-y-3">
        <input
          className={inputClass}
          placeholder="Full Name"
          value={address.fullName}
          onChange={(e) =>
            setAddress({
              ...address,
              fullName: e.target.value,
            })
          }
        />

        <input
          className={inputClass}
          placeholder="Phone"
          value={address.phone}
          onChange={(e) =>
            setAddress({
              ...address,
              phone: e.target.value,
            })
          }
        />

        <input
          className={inputClass}
          placeholder="Address Line 1"
          value={address.addressLine1}
          onChange={(e) =>
            setAddress({
              ...address,
              addressLine1: e.target.value,
            })
          }
        />

        <input
          className={inputClass}
          placeholder="Address Line 2 (optional)"
          value={address.addressLine2}
          onChange={(e) =>
            setAddress({
              ...address,
              addressLine2: e.target.value,
            })
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            className={inputClass}
            placeholder="City"
            value={address.city}
            onChange={(e) =>
              setAddress({
                ...address,
                city: e.target.value,
              })
            }
          />

          <input
            className={inputClass}
            placeholder="State"
            value={address.state}
            onChange={(e) =>
              setAddress({
                ...address,
                state: e.target.value,
              })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            className={inputClass}
            placeholder="Postal Code"
            value={address.postalCode}
            onChange={(e) =>
              setAddress({
                ...address,
                postalCode: e.target.value,
              })
            }
          />

          <input
            className={inputClass}
            placeholder="Country"
            value={address.country}
            onChange={(e) =>
              setAddress({
                ...address,
                country: e.target.value,
              })
            }
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={saveAddress}
            onChange={(e) =>
              setSaveAddress(e.target.checked)
            }
          />
          Save this address
        </label>
      </div>
    </div>
  );
};

export default AddressForm;
