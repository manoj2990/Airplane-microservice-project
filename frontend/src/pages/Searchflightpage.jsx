
import React, { useEffect, useState } from 'react'
import {Sidebar} from "../components/core/Sidebar"
import { useSelector, useDispatch } from "react-redux";
import { FlightCard } from '../components/core/FlightCard';
import { useNavigate, useLocation } from "react-router-dom";
import { searchFlight } from "../service/operation/searchApi";
import { setError } from "../redux/slice/Flight-slice";

export const Searchflightpage = ()=> {
const [flightData,setFlightData] = useState([])
const [lowestPrice, setlowestPrice] = useState(true)
const [retryCountdown, setRetryCountdown] = useState(0);
const {flights,loading,error,errorStatus,errorMessage} = useSelector( (state) => state.flight )
const {userSearch} = useSelector( (state) => state.userSearch || {});
const dispatch = useDispatch();
const navigate = useNavigate();
const location = useLocation();


useEffect( ()=>{
  try {
    // Validate flights data before setting
    if (flights && Array.isArray(flights)) {
      setFlightData(flights);
    } else {
      console.warn("Invalid flights data:", flights);
      setFlightData([]);
    }
  } catch (error) {
    console.error("Error setting flight data:", error);
    setFlightData([]);
  }
},[flights])

function sortPrice(){
  try {
    setlowestPrice( (lowestPrice)=> !lowestPrice);

    // Validate flights array before sorting
    if (!flights || !Array.isArray(flights) || flights.length === 0) {
      console.warn("Cannot sort: invalid or empty flights array");
      return;
    }

    let sortedProducts;
    if (lowestPrice) {
      sortedProducts = [...flights].sort((a, b) => {
        // Handle missing or invalid price values
        const priceA = a?.price ?? 0;
        const priceB = b?.price ?? 0;
        return priceA - priceB;
      });
    } else {
      sortedProducts = [...flights].sort((a, b) => {
        const priceA = a?.price ?? 0;
        const priceB = b?.price ?? 0;
        return priceB - priceA;
      });
    }

    setFlightData(sortedProducts);
  } catch (error) {
    console.error("Error sorting flights:", error);
    // Fallback to unsorted data
    setFlightData(Array.isArray(flights) ? flights : []);
  }
}

// Handle 429 error with retry countdown timer
useEffect(() => {
  if (errorStatus === 429 && retryCountdown === 0 && error) {
    // Start 30 second countdown timer for rate limit errors
    setRetryCountdown(30);
    
    const timer = setInterval(() => {
      setRetryCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount or when error clears
    return () => {
      clearInterval(timer);
    };
  } else if (errorStatus !== 429 || !error) {
    // Reset countdown if error is cleared or different error
    setRetryCountdown(0);
  }
}, [errorStatus, error]);

// Clear flight data on error
useEffect(() => {
  if (error) {
    setFlightData([]);
  }
}, [error]); 



// Handle retry for 429 errors
const handleRetry = () => {
  if (retryCountdown > 0) {
    return; // Don't allow retry if countdown is still active
  }

  try {
    // Get search parameters from Redux state or URL
    let trip, date, Travelers, classType;
    
    if (userSearch && userSearch.trip && userSearch.date) {
      // Use Redux state if available
      trip = userSearch.trip;
      date = userSearch.date;
      Travelers = userSearch.Travelers || "1";
      classType = userSearch.classType || "Economy";
    } else {
      // Fallback to URL parameters
      const searchParams = new URLSearchParams(location.search);
      trip = searchParams.get('trip');
      date = searchParams.get('date');
      Travelers = searchParams.get('Travelers') || "1";
      classType = searchParams.get('classType') || "Economy";
    }

    if (trip && date) {
      // Clear error state and reset countdown
      dispatch(setError(false));
      setRetryCountdown(0);
      
      // Retry the search
      dispatch(searchFlight(trip, date, Travelers, classType, navigate));
    } else {
      console.error("Cannot retry: Missing search parameters");
    }
  } catch (error) {
    console.error("Error during retry:", error);
  }
};

// Determine if it's a rate limit error
const isRateLimitError = errorStatus === 429;


  return (
   <div className='bg-gray-100 mt-30'>
   {/* Sort by section - only show if no error */}
   {!error && (
     <div className=' p-4 text-right'>
      <p>Sortby:
        <span 
        onClick={ () => sortPrice()}
        className=' cursor-pointer font-semibold'>{ `${lowestPrice ? " Lowest" : " Highest"}` }</span> 
        </p>
     </div>
   )}
   
   <div className=' mt-2 flex  h-lvh'>
    {/* Sidebar - ALWAYS visible to maintain layout */}
    <Sidebar />
   
    <div className=' w-full '>
    {
      // Handle 429 Rate Limit Error with special UI
      isRateLimitError ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100">
                <svg
                  className="h-8 w-8 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Too Many Requests
            </h2>
            <p className="text-gray-600 mb-2">
              {errorMessage || "You have made too many requests. Please wait a moment before trying again."}
            </p>

            {/* Countdown Timer */}
            {retryCountdown > 0 && (
              <div className="mb-6 mt-4">
                <div className="inline-flex items-center justify-center space-x-2 bg-gray-100 rounded-lg px-4 py-2">
                  <svg
                    className="animate-spin h-5 w-5 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">
                    Please wait {retryCountdown} seconds before retrying
                  </span>
                </div>
              </div>
            )}

            {/* Retry Button */}
            <button
              onClick={handleRetry}
              disabled={retryCountdown > 0 || loading}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                retryCountdown > 0 || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#009688] text-white hover:bg-[#00796b]"
              }`}
            >
              {loading ? "Retrying..." : retryCountdown > 0 ? `Retry in ${retryCountdown}s` : "Retry Search"}
            </button>

            {/* Additional Help Text */}
            <p className="text-sm text-gray-500 mt-6">
              If the problem persists, please try again after a few minutes or use the sidebar to perform a new search.
            </p>
          </div>
        </div>
      ) : error && !isRateLimitError ? (
        // Handle other errors (keep sidebar visible)
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              {errorStatus === 404 ? "Not Found" : 
               errorStatus === 500 ? "Server Error" : 
               "Something Went Wrong"}
            </h2>
            <p className="text-gray-600 mb-6">
              {errorMessage || "We encountered an error while loading flights. Please try again later."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#009688] text-white rounded-lg font-semibold hover:bg-[#00796b] transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => dispatch(setError(false))}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Dismiss
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              You can also use the sidebar to perform a new search.
            </p>
          </div>
        </div>
      ) : loading ? (
        // Loading state
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#009688] mb-4"></div>
            <p className="text-lg text-gray-600">Loading the flights...</p>
          </div>
        </div>
      ) : (flightData && Array.isArray(flightData) && flightData.length > 0) ? (
        // Flight results
        flightData.map( (flight) => {
          // Validate flight object before rendering
          if (!flight || !flight.id) {
            console.warn("Invalid flight data:", flight);
            return null;
          }
          return (
            <FlightCard flight={flight} key={flight.id} />
          );
        })
      ) : (
        // No flights found (empty state)
        <div className="text-center mt-10 px-4">
          <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <p className="text-lg text-gray-600 mb-2">
              No flights found
            </p>
            <p className="text-sm text-gray-500">
              Please try a different search using the sidebar.
            </p>
          </div>
        </div>
      )
    }
    </div>
   </div>
   </div>
  )
}


