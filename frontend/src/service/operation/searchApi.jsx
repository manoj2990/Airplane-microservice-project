import { toast } from "react-hot-toast";
import { endpoints } from "../api";
import { apiConnector } from "../apiConnector";

import {
  setLoading,
  setFlights,
  setError,
  setErrorStatus,
} from "../../redux/slice/Flight-slice";
import { setuserSearch } from "../../redux/slice/user-search";

const { FLIGHT_SERACH_API } = endpoints;

export function searchFlight(trip, date, Travelers, classType, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    dispatch(setuserSearch({ trip, date, Travelers, classType }));

    const query = new URLSearchParams({
      trip,
      date,
      Travelers,
      classType,
    }).toString();

    try {
      // Validate inputs before making API call
      if (!trip || !date) {
        throw new Error("Please fill in all required fields");
      }

      const response = await apiConnector(
        "GET",
        FLIGHT_SERACH_API,
        null,
        null,
        { trip } // params as object
      );

      // Validate response structure
      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to load flights");
      }

      // Validate flights data
      const flightsData = response.data.data;
      if (!Array.isArray(flightsData)) {
        console.warn("Expected array of flights but received:", typeof flightsData);
        dispatch(setFlights([]));
      } else {
        dispatch(setFlights(flightsData));
        
      }

      // Clear error state on success
      dispatch(setError(false));
      
      navigate(`/travel/flights?${query}`);
      toast.success("Flights loaded successfully");
    } 
    
    catch (error) {
      const status = error.response?.status;
      const message =
      error.response?.data?.error?.explanation || error.response?.data?.message ||
        error.message ||
        (status === 429
          ? "Too many requests. Please wait a moment and try again."
          : status === 404
          ? "Flight service not found. Please try again later."
          : status === 500
          ? "Server error. Please try again later."
          : "Could not load flights. Please try again later.");

      if (status === 429) {
        toast.error("Too many requests. Please wait a few seconds.");
      } else {
        toast.error(message);
      }

      console.error("searchFlight error -->", status, message);

      // Store error status and message for specific handling
      dispatch(setErrorStatus({
        status: status || null,
        message: message
      }));
      // Ensure flights array is empty on error
      dispatch(setFlights([]));
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}
