import { toast } from "react-hot-toast";
import { endpoints } from "../api";
import { apiConnector } from "../apiConnector";
import {
  setBooking,
  setError,
  setLoading,
  setBookedSeats,
  setFrozenSeats,
} from "../../redux/slice/booking-slice";

import {
  setticketinfo,
  setticketLoading
} from "../../redux/slice/ticketinfo-slice";
import { v4 as uuidv4 } from 'uuid';
const { FLIGHT_BY_ID_SERACH_API,PAYMENT_API,CREATE_BOOKING_API } = endpoints;


export function getFlightbyId(flightId, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading flight...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "GET",
        `${FLIGHT_BY_ID_SERACH_API}/${flightId}`
      );



      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to load flight details"
        );
      }

      const flightData = response.data.data;

      // ✅ Save flight data
      dispatch(setBooking(flightData));
      dispatch(setBookedSeats(flightData.bookedSeats));
      dispatch(setFrozenSeats(flightData.frozenSeats));

      toast.success("Flight loaded successfully");

      // ✅ Navigate after successful data fetch
      navigate(`/travel/flights/${flightId}/seat`);
    } catch (error) {
      console.error("Error in getFlightById:", error);
      toast.error(`Could not load flight: ${error.message || "Unknown error"}`);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function createbooking(bookingData, navigate, handlepaymentmodel) {
  return async (dispatch) => {
    const toastId = toast.loading("loading....");
    dispatch(setticketLoading(true));


       const storedToken = localStorage.getItem("token");

    let token = null;
    try {
      token = JSON.parse(storedToken)?.token ;
    } catch (err) {
      token = storedToken; 
    }

    try {
      const response = await apiConnector(
        "POST",
        CREATE_BOOKING_API,
        bookingData,
         {
          "Content-Type": "application/json",
          "x-access-token": token
         
        },
        null
      );

  

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to load flight details"
        );
      }

     dispatch(setticketinfo({...response.data.data,seats:bookingData.seatIds}))

      toast.success("successfully create booking...");
      handlepaymentmodel();
    
    
    } catch (error) {

     
      toast.error(error.response.data.error.message || error.message);
      dispatch(setError(error.message));
    } finally {
      dispatch(setticketLoading(false));
      toast.dismiss(toastId);
    }
  };
}




export function processPayment(paymentData, onSuccess, navigate) {
  return async (dispatch) => {

    const toastId = toast.loading("Processing payment...");
    dispatch(setLoading(true));
   
    const storedToken = localStorage.getItem("token");

    let token = null;
    try {
      token = JSON.parse(storedToken)?.token ;
    } catch (err) {
      token = storedToken; 
    }



const key = uuidv4();

    try {
    
      const response = await apiConnector(
        "POST",
        PAYMENT_API,
        paymentData,
        {
          "Content-Type": "application/json",
          "x-access-token": token,
          "x-idempotency-key": key
        },
        null
      );

      
      await new Promise((resolve) => setTimeout(resolve, 5000));

      if (!response.data.success) {
        throw new Error(response.data.message || "Payment failed");
      }

      
      toast.success("Payment Successful!");
      if (response.data.success){ 
        onSuccess(); 
        navigate('/travel/flight/confirm')
      }

    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      console.error("Payment Error:", error?.response?.data || error.message);
      toast.error(error.response.data.error.message || error.message);
      dispatch(setError(error.message));
    } finally {
      // onSuccess()
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}


