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
      <nav className="fixed left-1/2 top-6 z-50 flex w-[90%] max-w-7xl -translate-x-1/2 items-center justify-between glass-panel px-6 py-4 shadow-lg md:px-10 transition-all duration-300">
        <h1 
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-secondary))] bg-clip-text text-transparent cursor-pointer tracking-tight" 
          onClick={() => navigate("/")}
        >
          SkyPlan
        </h1>

        <div className="hidden md:flex items-center gap-8 font-medium text-[hsl(var(--color-text-muted))]">
          <button className="flex items-center gap-2 transition-colors hover:text-[hsl(var(--color-primary))]">
            <FaRegUser className="text-lg" />
            {isAuthenticated ? userName : "Demo user"}
          </button>
          <button className="flex items-center gap-2 transition-colors hover:text-[hsl(var(--color-primary))]">
            <MdOutlineLocalPhone className="text-lg" />
            Connect
          </button>
        </div>

        {/* Conditional rendering based on authentication status */}
        {isAuthenticated ? (
          // Show logout button when user is logged in
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="rounded-full border border-red-200 bg-red-50 px-6 py-2.5 text-red-600 font-medium hover:bg-red-100 hover:border-red-300 transition-all duration-200"
            >
              Log Out
            </button>
          </div>
        ) : (
          // Show Sign Up/Login buttons when user is not logged in
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavigateToAuth(true)}
              className="hidden md:block text-sm font-semibold text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--color-primary))] transition-colors"
            >
              Sign Up
            </button>
            <button
              onClick={() => handleNavigateToAuth(false)}
              className="btn-primary rounded-full px-6 py-2.5 text-sm font-bold shadow-lg shadow-[hsl(var(--color-primary)/0.3)]"
            >
              Log In
            </button>
          </div>
        )}
      </nav>
    </>
  );
};
