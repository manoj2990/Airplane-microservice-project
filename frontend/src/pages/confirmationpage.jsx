import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdCheckCircle, MdFlightTakeoff, MdHome } from "react-icons/md";
import { getAddress, formatTime, formatDate } from "../utils/Helperfunction";

export const ConfirmationPage = () => {
    const navigate = useNavigate();
    const { booking } = useSelector((state) => state.booking);
    const { userSearch } = useSelector((state) => state.userSearch || {});

    // Fallback if booking data is missing (e.g. page refresh)
    if (!booking) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <p className="text-gray-600 mb-4">No booking details found.</p>
                <button 
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Return Home
                </button>
            </div>
        );
    }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-lg"
      >
        {/* Success Header */}
        <div className="text-center mb-8">
            {/* <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4"
            >
                <MdCheckCircle className="text-6xl text-green-500" />
            </motion.div> */}
            <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
            <p className="text-gray-500 mt-2">Your flight is all set. Pack your bags! ✈️</p>
        </div>

        {/* Boarding Pass Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {/* Blue Header */}
            <div className="bg-blue-600 p-6 flex justify-between items-center text-white">
                <div>
                    <p className="text-blue-100 text-xs uppercase tracking-wider font-semibold">Flight</p>
                    <p className="font-bold text-xl">{booking.flightNumber || "N/A"}</p>
                </div>
                <div className="text-right">
                    <p className="text-blue-100 text-xs uppercase tracking-wider font-semibold">Class</p>
                    <p className="font-bold text-xl">{userSearch?.classType || "Economy"}</p>
                </div>
            </div>

            {/* Flight Route */}
            <div className="p-6 relative">
                 {/* Dotted Line */}
                 <div className="absolute top-1/2 left-8 right-8 h-0 border-t-2 border-dashed border-gray-200 -z-10"></div>
                 
                <div className="flex justify-between items-center">
                    {/* Departure */}
                    <div className="text-center bg-white px-2">
                        <p className="text-3xl font-bold text-gray-800">{booking.departureAirport?.code}</p>
                        <p className="text-xs text-gray-500 mt-1 uppercase max-w-[100px] truncate mx-auto">
                            {booking.departureAirport?.name}
                        </p>
                        <p className="font-semibold text-blue-600 mt-1">{formatTime(booking.departureTime)}</p>
                    </div>

                    {/* Plane Icon */}
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                        <MdFlightTakeoff size={20} />
                    </div>

                    {/* Arrival */}
                    <div className="text-center bg-white px-2">
                         <p className="text-3xl font-bold text-gray-800">{booking.arrivalAirport?.code}</p>
                        <p className="text-xs text-gray-500 mt-1 uppercase max-w-[100px] truncate mx-auto">
                            {booking.arrivalAirport?.name}
                        </p>
                        <p className="font-semibold text-blue-600 mt-1">{formatTime(booking.arrivalTime)}</p>
                    </div>
                </div>

                {/* Additional Details */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl text-center">
                        <p className="text-xs text-gray-500 uppercase">Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(booking.departureTime)}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl text-center">
                         <p className="text-xs text-gray-500 uppercase">Travelers</p>
                        <p className="font-semibold text-gray-900">{userSearch?.Travelers || 1} Person(s)</p>
                    </div>
                </div>
            </div>

            {/* Ticket Cutout Effect */}
            <div className="relative h-6 bg-gray-50 border-t border-dashed border-gray-300">
                <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-gray-50 border border-gray-100"></div>
                <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-gray-50 border border-gray-100"></div>
            </div>
            
             {/* Bottom Section */}
             <div className="bg-gray-50 p-6 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase">Total Fare Paid</span>
                    <span className="text-xl font-bold text-green-600">₹{booking.price ? booking.price.toLocaleString() : "0"}</span>
                </div>
                <div className="h-10 w-24 bg-white border border-gray-200 rounded flex items-center justify-center">
                    {/* Barcode Mockup */}
                    <div className="flex gap-0.5 h-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className={`w-1 bg-gray-800 ${i % 3 === 0 ? 'h-full' : 'h-4 self-center'}`}></div>
                        ))}
                    </div>
                </div>
             </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
            <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
                <MdHome size={20} />
                Back to Home
            </button>
        </div>

      </motion.div>
    </div>
  );
};
