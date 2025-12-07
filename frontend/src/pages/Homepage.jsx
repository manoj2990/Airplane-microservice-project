import React from 'react'
import airplaneImage from "../assets/image/airplane.jpg";
import { FlightSearchForm  } from "../components/core/FlightSearchForm";

export const Homepage = ()=> {
  return (
    <div className="page-shell pb-20">
       <section className="relative w-full mx-auto overflow-hidden rounded-2xl">
        {/* Hero Image Container */}
        <div className="relative h-[500px] md:h-[600px] w-full">
          <img
            src={airplaneImage}
            alt="Airplane taking off over clouds"
            className="w-full h-full object-cover"
          />
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--color-primary-dark))/0.4] via-transparent to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto pt-20">
            <div className="max-w-2xl space-y-6 animate-fade-in">
              <span className="pill-tag glass-panel border-white/20 text-white backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
                #1 Travel Platform
              </span>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight drop-shadow-2xl">
                Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-200">World</span> <br/>
                One Flight at a Time.
              </h1>
              
              <p className="text-lg md:text-xl text-gray-200 max-w-lg font-light leading-relaxed drop-shadow-md">
                Experience seamless booking with exclusive deals and premium support. Your journey begins here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Search Form Section */}
      <div className="relative z-30 px-4 md:px-0 -mt-24 mb-10">
        <FlightSearchForm />
      </div>
    </div>
  )
}
