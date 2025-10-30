import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getAddress, formatDate, formatTime } from "../utils/Helperfunction";
import { LuCalendarDays } from "react-icons/lu";
import { GiAirplaneDeparture } from "react-icons/gi";
import { FiMapPin } from "react-icons/fi";
import { fareDetails } from "../constant/price";
import { motion, AnimatePresence } from "framer-motion";

import {
  mapBackendToFrontend,
  mapFrontendToBackend,
} from "../utils/SeatMapper";
import { createbooking } from "../service/operation/flightApi";
import { useNavigate } from "react-router-dom";
import { PaymentModal } from "../components/core/PaymentModal";

export const SeatMatrixPage = ({ flightId }) => {
  const [bookedSeats, setBookedSeats] = useState([]); // permanently booked
  const [selectedSeats, setSelectedSeats] = useState([]); // user selected
  const [frozenSeats, setFrozenSeats] = useState([]); // temporarily held by others
  const [showFareDetails, setShowFareDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openpayment, setopenpayment] = useState(false)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { booking } = useSelector((state) => state.booking);
  const seatData = useSelector((state) => state.booking);
  console.log("booking--->",booking)
   console.log("seatData--->",seatData)
  const { userSearch } = useSelector((state) => state.userSearch);

  const authuser = useSelector((state) => state.auth);

  // Fetch flight seat data when page loads
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        //===>Booked seats
        const backend_baookedSeats = seatData.bookedSeats;
        const frontend_bookedSeats = mapBackendToFrontend(
          backend_baookedSeats,
          seatLayout
        );
        setBookedSeats(frontend_bookedSeats);

        //===>frozen seats
        const backend_frozenSeats = seatData.frozenSeats;
        const frontend_frozenSeats = mapBackendToFrontend(
          backend_frozenSeats,
          seatLayout
        );
        setFrozenSeats(frontend_frozenSeats);
        //  setFrozenSeats(["A-1", "B-7"]);
      } catch (err) {
        console.error("Error fetching seat data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, []);

  // Toggle seat selection
  const toggleSeat = async (seatId, seatNo) => {
    if (bookedSeats.includes(seatId) || frozenSeats.includes(seatId)) return;

    // Check if user is trying to select a new seat beyond limit
    const isAlreadySelected = selectedSeats.includes(seatId);
    if (!isAlreadySelected && selectedSeats.length >= userSearch.Travelers) {
      alert(`You can select only ${userSearch.Travelers} seat(s).`);
      return;
    }

    // Toggle seat (select or unselect)

    setSelectedSeats((prev) =>
      isAlreadySelected ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  // Color logic for each seat
  const getSeatColor = (seatId) => {
    if (bookedSeats.includes(seatId)) return "#FF4B4B"; // red - booked
    if (frozenSeats.includes(seatId)) return "#999999"; // gray - frozen by others
    if (selectedSeats.includes(seatId)) return "#35C759"; // green - user selected
    return "#64B5F6"; // blue - available
  };

  // Seat Layout — from your original code
  const seatLayout = {
    leftSide: [
      // Row A
      { id: "A-1", seatid: 1, x: 620, y: 450 },
      { id: "A-2", seatid: 2, x: 620, y: 530 },
      { id: "A-3", seatid: 3, x: 620, y: 610 },
      { id: "A-4", seatid: 4, x: 620, y: 690 },
      { id: "A-5", seatid: 5, x: 620, y: 770 },
      { id: "A-6", seatid: 6, x: 620, y: 850 },
      { id: "A-7", seatid: 7, x: 620, y: 930 },
      { id: "A-8", seatid: 8, x: 620, y: 1010 },
      { id: "A-9", seatid: 9, x: 620, y: 1090 },

      // Row B
      { id: "B-1", seatid: 10, x: 720, y: 450 },
      { id: "B-2", seatid: 11, x: 720, y: 530 },
      { id: "B-3", seatid: 12, x: 720, y: 610 },
      { id: "B-4", seatid: 13, x: 720, y: 690 },
      { id: "B-5", seatid: 14, x: 720, y: 770 },
      { id: "B-6", seatid: 15, x: 720, y: 850 },
      { id: "B-7", seatid: 16, x: 720, y: 930 },
      { id: "B-8", seatid: 17, x: 720, y: 1010 },
      { id: "B-9", seatid: 18, x: 720, y: 1090 },
    ],

    rightSide: [
      // Row C
      { id: "C-1", seatid: 19, x: 820, y: 450 },
      { id: "C-2", seatid: 20, x: 820, y: 530 },
      { id: "C-3", seatid: 21, x: 820, y: 610 },
      { id: "C-4", seatid: 22, x: 820, y: 690 },
      { id: "C-5", seatid: 23, x: 820, y: 770 },
      { id: "C-6", seatid: 24, x: 820, y: 850 },
      { id: "C-7", seatid: 25, x: 820, y: 930 },
      { id: "C-8", seatid: 26, x: 820, y: 1010 },
      { id: "C-9", seatid: 27, x: 820, y: 1090 },

      // Row D
      { id: "D-1", seatid: 28, x: 920, y: 450 },
      { id: "D-2", seatid: 29, x: 920, y: 530 },
      { id: "D-3", seatid: 30, x: 920, y: 610 },
      { id: "D-4", seatid: 31, x: 920, y: 690 },
      { id: "D-5", seatid: 32, x: 920, y: 770 },
      { id: "D-6", seatid: 33, x: 920, y: 850 },
      { id: "D-7", seatid: 34, x: 920, y: 930 },
      { id: "D-8", seatid: 35, x: 920, y: 1010 },
      { id: "D-9", seatid: 36, x: 920, y: 1090 },
    ],
  };

  // Handle seat click
  const handleSeatClick = (seatId, seatNo) => {
    toggleSeat(seatId, seatNo);
  };

  // Render each seat box
  const renderSeat = (seat) => (
    <g
      key={seat.id}
      onClick={() => handleSeatClick(seat.id, seat.seatid)}
      className="cursor-pointer"
    >
      <rect
        x={seat.x}
        y={seat.y}
        width={70}
        height={60}
        rx={10}
        fill={getSeatColor(seat.id)}
        stroke="#1f2937"
        strokeWidth="2"
        className="transition-all hover:opacity-80"
      />
      <text
        x={seat.x + 35}
        y={seat.y + 35}
        textAnchor="middle"
        fontSize="20"
        fontWeight="600"
        fill="white"
        pointerEvents="none"
      >
        {seat.id}
      </text>
    </g>
  );

   function handlepaymentmodel(){
    console.log("settig up paymen model--------------------")
    setopenpayment(true)
  }

  const handleBookingConfirm = async (selectedSeats) => {
    console.log("entring into handleBookingConfirm----->");

   const token = localStorage.getItem('token')
    console.log("entring into token----->",token);
    if(!token){
      alert("not auth")
      localStorage.setItem("flightId",booking.id)
      navigate("/auth")
      return
    }

    if(selectedSeats.length == 0){
      alert("select The seat Brooo")
      return
    }

    const seats = mapFrontendToBackend(selectedSeats, seatLayout);
    console.log("seats --->", seats)
    console.log("booking.id ===========", booking.id)
    dispatch(
      createbooking(
        {
          flightId: booking.id,
          userId: localStorage.getItem('userId') || null,
          noOfSeats: userSearch.Travelers,
          seatIds: seats,
        },
        navigate,
        handlepaymentmodel
      )
    );
  };

  const totalFare = userSearch.Travelers * booking.price + fareDetails.taxes;

  if (loading) return <p className="p-10 text-gray-600">Loading seat map...</p>;

 


  return (
    <div className="flex p-4 mt-24">
      {/* Left Section - Seat SVG */}
      <div className=" bg-gray-200 ">
        <div className="flex gap-6 mt-6 text-sm p-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>{" "}
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-300 rounded"></div>{" "}
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>{" "}
            <span>Selected</span>
          </div>
        </div>

        <svg
          width="800"
          viewBox="0 0 1612 1250"
          xmlns="http://www.w3.org/2000/svg"
          className="cursor-pointer"
        >
          {/* Plane Head */}
          <path
            d="M1015.54 579.01H596.263V1841H1015.54L1015.54 579.01Z"
            fill="#F1F5FB"
          />
          <path
            d="M596.453 612.92C596.453 612.92 582.028 1.00025 804.403 1C1026.78 0.999753 1015.44 612.92 1015.44 612.92H596.453Z"
            fill="#F1F5FB"
          />

          {/* Render seats */}
          {seatLayout.leftSide.map(renderSeat)}
          {seatLayout.rightSide.map(renderSeat)}
        </svg>
      </div>

      {/* Right Section - Seat Info */}
      <div className="ml-10 p-5">
        <h2 className="text-xl font-semibold mb-6">Flight Details</h2>

        {/* Flight Info */}
        {[booking].map((flight, i) => (
          <div key={i} className="bg-gray-50 p-5 rounded-lg mb-4">
            <h3 className="font-medium text-base mb-6">
              To {getAddress(flight.arrivalAirport.address)}
            </h3>

            <div className="relative">
              <div className="absolute left-[52px] top-8 bottom-8 w-px bg-gray-300"></div>

              {/* Date */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12"></div>
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded p-1 z-10">
                    <LuCalendarDays className="w-4 h-4 text-gray-700" />
                  </div>
                  <p className="text-sm text-gray-800">
                    {formatDate(flight.departureTime)}
                  </p>
                </div>
              </div>

              {/* Departure & Arrival */}
              <div className="flex items-start gap-4 mb-5">
                <p className="font-semibold text-sm w-12 text-left pt-0.5">
                  {formatTime(flight.departureTime)}
                </p>
                <div className="flex items-start gap-3">
                  <FiMapPin />
                  <p className="text-sm text-gray-900 -ml-0.5 pt-0.5">
                    {flight.departureAirport.name}{" "}
                    <span className="text-gray-600">
                      ({flight.departureAirport.code})
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <p className="font-semibold text-sm w-12 text-left pt-0.5">
                  {formatTime(flight.arrivalTime)}
                </p>
                <div className="flex items-start gap-3">
                  <FiMapPin />
                  <p className="text-sm text-gray-900 -ml-0.5 pt-0.5">
                    {flight.arrivalAirport.name}{" "}
                    <span className="text-gray-600">
                      ({flight.arrivalAirport.code})
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Selected Seats Section */}
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">Selected Seats</h3>
          {selectedSeats.length > 0 ? (
            <div className="flex flex-wrap gap-3 mb-4">
              {selectedSeats.map((seat) => (
                <div
                  key={seat}
                  className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg shadow-sm border border-green-400"
                >
                  {seat}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No seats selected yet.</p>
          )}

          {/* Total Fare */}
          <div
            className="flex justify-between items-center cursor-pointer mt-2 py-2 border-t"
            onClick={() => setShowFareDetails((prev) => !prev)}
          >
            <span className="font-semibold text-base">Total Fare</span>
            <span className="font-semibold text-base text-teal-600">
              ₹{totalFare.toLocaleString()}
            </span>
          </div>

          {/* Collapsible Fare Details */}
          <AnimatePresence>
            {showFareDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 text-sm mt-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Base Fare × {userSearch.Travelers}</span>
                    <span>
                      ₹{(booking.price * userSearch.Travelers).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Taxes & Fees</span>
                    <span>
                      ₹
                      {(
                        fareDetails.taxes * userSearch.Travelers
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <button
              className=" w-full border rounded-md cursor-pointer p-2 mt-10 flex justify-center bg-[#009688] text-xl font-bold text-white"
              onClick={() => handleBookingConfirm(selectedSeats)}
            >
             { seatData.loading ? "loading..." : "Confirm & Pay"}
            </button>
          </div>
        </div>
      </div>


        {openpayment && (
        <PaymentModal
        totalFare={totalFare}
        onClose={() => setopenpayment(false)}
      />
    )}

    </div>

  );
};
