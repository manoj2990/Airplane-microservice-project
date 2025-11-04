import { useState, useEffect } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineLocalPhone } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slice/Authuser-slice";
import { toast } from "react-hot-toast";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userDetails } = useSelector((state) => state.auth || {});

  // Check authentication status from localStorage token and userDetails
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const hasUserDetails = userDetails && Object.keys(userDetails).length > 0;
        setIsAuthenticated(!!token && hasUserDetails);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // Listen for storage changes (logout from other tabs/windows)
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [userDetails]);

  const handleLogout = () => {
    try {
      dispatch(logout());
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  const handleNavigateToAuth = (isSignUp = false) => {
    navigate("/auth", { state: { isSignUp } });
  };

  // Get user name from userDetails
  const userName = userDetails?.name || userDetails?.email || "User";

  return (
    <>
      <nav className="flex justify-between items-center px-10 py-10 fixed z-50 bg-white  border-white rounded-xl shadow-gray-300 shadow-sm w-[90%] mx-1 ">
        <h1 className="text-3xl font-bold text-[#009688] cursor-pointer" onClick={() => navigate("/")}>
          SkyPlan
        </h1>

        <div className="flex items-center gap-8 text-gray-700 font-medium ">
          <button className="flex items-center gap-2 hover:text-[#009688]">
            <FaRegUser />
            {isAuthenticated ? userName : "Demo user"}
          </button>
          <button className="flex items-center gap-2 hover:text-[#009688]">
            <MdOutlineLocalPhone />
            Connect
          </button>
        </div>

        {/* Conditional rendering based on authentication status */}
        {isAuthenticated ? (
          // Show logout button when user is logged in
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="rounded-md border border-red-300 px-5 py-2 text-red-600 hover:bg-red-50 transition-colors"
            >
              Log Out
            </button>
          </div>
        ) : (
          // Show Sign Up/Login buttons when user is not logged in
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavigateToAuth(true)}
              className="rounded-md border border-gray-300 px-5 py-2 hover:bg-gray-100 transition-colors"
            >
              Sign Up
            </button>
            <button
              onClick={() => handleNavigateToAuth(false)}
              className="rounded-md bg-black text-white px-5 py-2 hover:bg-gray-800 transition-colors"
            >
              Log In
            </button>
          </div>
        )}
      </nav>
    </>
  );
};
