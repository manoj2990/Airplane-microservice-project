import { FaRegUser } from "react-icons/fa";
import { MdOutlineLocalPhone } from "react-icons/md";

export const Navbar = () => {
  return (
    <>
      <nav className="flex justify-between items-center px-10 py-10 fixed z-50 bg-white  border-white rounded-xl shadow-gray-300 shadow-sm w-[90%] mx-1 ">
    
      <h1 className="text-3xl font-bold text-[#009688]">SkyPlan</h1>

   
      <div className="flex items-center gap-8 text-gray-700 font-medium ">
        <button className="flex items-center gap-2 hover:text-[#009688]">
          <FaRegUser />
          Demo user
        </button>
        <button className="flex items-center gap-2 hover:text-[#009688]">
        <MdOutlineLocalPhone />
         Connect
        </button>
      </div>

 
      <div className="flex items-center gap-4">
        <button className="rounded-md border border-gray-300 px-5 py-2 hover:bg-gray-100">
          Sign Up
        </button>
        <button className="rounded-md bg-black text-white px-5 py-2 hover:bg-gray-800 ">
          Log In
        </button>
      </div>
    </nav>
    </>
  
  );
};
