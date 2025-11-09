import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { processPayment } from "../../service/operation/flightApi"; 
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export const PaymentModal = ({ totalFare, onClose }) => {
  const [loading, setLoading] = useState(false);
  const ticketInfo = useSelector( (state)=> state.ticket)

  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {

}, [loading]);


  const handlePayment = async () => {
  setLoading(true);
  
  try {
    await dispatch(
      processPayment(
        {
          userId: ticketInfo.ticketinfo.userId,
          flightId:ticketInfo?.ticketinfo?.flightId,
          payment: ticketInfo.ticketinfo.totalCost,
          bookingId: ticketInfo.ticketinfo.id,
          seatIds: ticketInfo.ticketinfo.seats
        },
        onClose,
        navigate
      )
    );

  } catch (error) {
    console.error("Payment failed:", error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {loading ? (
        <div className="flex flex-col items-center">
          <img
            src="https://c.tenor.com/LMz_TrIOxV8AAAAd/tenor.gif"
            alt="Processing payment..."
            className="w-80 h-80 mb-4 rounded-sm"
          />
          <p className="text-black text-lg font-semibold animate-pulse">
            Processing your payment...
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-[400px]"
        >
          <h2 className="text-2xl font-semibold text-center mb-6">
            Payment Summary
          </h2>

          <div className="flex justify-between mb-6 text-lg font-medium">
            <span>Total Fare:</span>
            <span className="text-teal-600 font-bold">
              ₹{totalFare.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold transition-all"
          >
            Pay Now
          </button>

          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-2 text-gray-600 mt-3 text-sm underline hover:text-gray-800"
          >
            Cancel
          </button>
        </motion.div>
      )}
    </div>
  );
};
