import { toast } from "react-hot-toast"
import {endpoints} from "../api"
import { apiConnector } from "../apiConnector"
import { setError,setLoading,setUser } from "../../redux/slice/Authuser-slice";

const {SINGH_UP_API,LOGIN_API} = endpoints;


export function signup(sinupdata){

  return async (dispatch) => {

    const toastId = toast.loading("Loding....");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "POST",
        SINGH_UP_API,
        sinupdata
      );

     

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed create user");
      }

      
    //   localStorage.setItem("userId",response.data.data.id)
      dispatch( setUser(response.data.data ))
    
      toast.success("successfully create user...");

    } catch (error) {
      console.error("Failed create user", error);
      toast.error("Failed create user");
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };

}



export function login(logindata,flightId,navigate){

  return async (dispatch) => {

    const toastId = toast.loading("Loding....");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "POST",
        LOGIN_API,
        logindata
      );

    

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed Auth user");
      }



     localStorage.setItem("token",response.data.data.jwt_token)
     dispatch( setUser(response.data.data.user))
    
      toast.success("successfully Auth user...");

  
      navigate(`/travel/flights/${flightId}/seat`);
    } catch (error) {
      console.error("Error in Booking", error);
      toast.error("Failed Auth user");
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };

}