import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAddress} from "../utils/Helperfunction";
import { useSelector } from "react-redux";

export const ConfirmationPage = ({ from = "Delhi", to = "Bangalore" }) => {
    const navigate = useNavigate();
    const { booking } = useSelector((state) => state.booking);

    
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  from-amber-100 to-yellow-50 px-4 mt-10">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className=" p-8 w-full max-w-md text-center"
      >
        <h2 className="text-3xl font-semibold text-green-600 mb-4">
          🎉 Trip Confirmed!
        </h2>
        <p className="text-gray-700 text-lg mb-6">
          Your trip has been successfully booked.  
          Get ready to fly with us ✈️
        </p>

        <div className="bg-amber-50 p-4 rounded-xl shadow-inner mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Trip Details
          </h3>
          <div className="flex items-center justify-center gap-3 text-gray-700 text-lg font-medium">
            <span className="text-teal-700">To {getAddress(booking.arrivalAirport.address)}</span>
            <span className="text-gray-500">→</span>
            <span className="text-pink-700">To {getAddress(booking.departureAirport.address)}</span>
          </div>
        </div>

        {/* <motion.img
          src="https://tenor.com/view/verify-gif-6541938380636448321"
          alt="Trip confirmed"
          className="w-48 h-48 mx-auto rounded-md"
          initial={{ rotate: -5 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.4 }}
        /> */}

        <p className="mt-6 text-gray-600">
          Safe travels and have an amazing journey! 🌍
        </p>
        <span
        onClick={ ()=>( navigate('/'))}
        className=" text-blue-500 font-semibold cursor-pointer"
        >Home page</span>
      </motion.div>
    </div>
  );
};
