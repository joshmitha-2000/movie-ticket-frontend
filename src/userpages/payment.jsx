import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSeats, totalPrice, showId, bookingId } = location.state || {};

  const [selectedMethod, setSelectedMethod] = useState("");

  const handlePay = () => {
    if (!selectedMethod) {
      alert("⚠️ Please select a payment method before proceeding.");
      return;
    }

    alert(`✅ Payment Successful using ${selectedMethod}!`);
    // Optionally: send confirmation to backend
    navigate("/user/home");
  };

  if (!selectedSeats || !totalPrice) {
    return (
      <p className="text-center mt-10 text-red-600 text-base sm:text-lg">
        Missing payment info.
      </p>
    );
  }

  const paymentMethods = [
    "PhonePe",
    "Google Pay",
    "Paytm",
    "Credit/Debit Card",
    "UPI",
  ];

  return (
    <div className="max-w-xl w-full mx-auto mt-10 p-6 sm:p-8 bg-white text-black shadow-lg rounded-lg">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">💳 Payment Page</h1>
      <p className="mb-2 text-sm sm:text-base">Show ID: {showId}</p>
      {bookingId && (
        <p className="mb-2 text-sm sm:text-base">Booking ID: {bookingId}</p>
      )}
      <p className="mb-6 font-semibold text-lg sm:text-xl">Total: ₹{totalPrice}</p>

      <h2 className="text-lg sm:text-xl font-medium mb-4">Choose Payment Method</h2>
      <div className="space-y-3 mb-8">
        {paymentMethods.map((method) => (
          <button
            key={method}
            onClick={() => setSelectedMethod(method)}
            className={`w-full py-3 px-5 rounded text-left transition-colors duration-200 ${
              selectedMethod === method
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {method}
          </button>
        ))}
      </div>

      <button
        onClick={handlePay}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-5 rounded-lg text-lg sm:text-xl font-semibold transition-colors duration-200"
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
