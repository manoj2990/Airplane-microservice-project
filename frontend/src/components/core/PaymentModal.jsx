import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { processPayment } from "../../service/operation/flightApi"; 
import { useNavigate } from "react-router-dom";
import { MdPayment, MdClose } from "react-icons/md";

export const PaymentModal = ({ totalFare, onClose }) => {
  const [loading, setLoading] = useState(false);
  const ticketInfo = useSelector((state) => state.ticket);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: any side effects when loading changes
  }, [loading]);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      await dispatch(
        processPayment(
          {
            userId: ticketInfo.ticketinfo.userId,
            flightId: ticketInfo?.ticketinfo?.flightId,
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      {loading ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full"
        >
          <img
            src="https://c.tenor.com/LMz_TrIOxV8AAAAd/tenor.gif"
            alt="Processing payment..."
            className="w-48 h-48 mb-4 object-contain"
          />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Processing Payment</h3>
          <p className="text-gray-500 text-center text-sm animate-pulse">
            Please wait while we secure your booking...
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center relative">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-full transition-colors cursor-pointer"
            >
              <MdClose size={24} />
            </button>
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <MdPayment size={32} />
            </div>
            <h2 className="text-2xl font-bold">Confirm Payment</h2>
            <p className="text-blue-100 text-sm mt-1">Complete your booking securely</p>
          </div>

          {/* Body */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-gray-600 font-medium">Total Amount</span>
              <span className="text-3xl font-bold text-slate-800">
                ₹{totalFare.toLocaleString()}
              </span>
            </div>

            <div className="space-y-4">
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transform transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Pay Securely</span>
                <MdPayment size={20} />
              </button>

              <button
                onClick={onClose}
                disabled={loading}
                className="w-full py-3 text-gray-500 font-semibold hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
              >
                Cancel Transaction
              </button>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">🔒 SSL Encrypted Payment</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
