import React from 'react'
import airplaneImage from "../assets/image/airplane.jpg";
import { FlightSearchForm  } from "../components/core/FlightSearchForm";

export const Homepage = ()=> {
  return (
    <>
       <section className=" w-full  mx-auto mt-38 overflow-hidden  ">
   
        <img
          src={airplaneImage}
          alt="Airplane"
          className="w-full h-[500px] object-cover rounded-2xl"
        />

       
        <div className="absolute inset-0 flex top-40 left-90 m-auto">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            Best deals are waiting for you
          </h1>
        </div>


      </section>
      
      <FlightSearchForm />
    </>
  )
}
