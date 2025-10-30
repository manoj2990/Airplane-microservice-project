

import { toast } from "react-hot-toast"
import {endpoints} from "../api"
import { apiConnector } from "../apiConnector"

import { setLoading,setFlights } from "../../redux/slice/Flight-slice";
import {setuserSearch} from "../../redux/slice/user-search"

const {FLIGHT_SERACH_API} = endpoints;

export function searchFlight(trip, date, Travelers, classType,navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    dispatch(setuserSearch({trip, date, Travelers, classType}));
    
    const query = new URLSearchParams({
      trip,
      date,
      Travelers,
     classType,
    }).toString();

    try {
      const response = await apiConnector(
        "GET",
        FLIGHT_SERACH_API,
        null,
        null,
        { trip} // params as object
      );
    
     
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
       
      dispatch(setFlights(response.data.data));
      navigate(`/travel/flights?${query}`)
      toast.success("Flights loaded successfully");

    } catch (error) {
      
      dispatch( setError(true))

      toast.error("Could not load flights");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}
