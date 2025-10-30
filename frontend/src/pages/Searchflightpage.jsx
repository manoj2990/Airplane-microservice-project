
import React, { useEffect, useState } from 'react'
import {Sidebar} from "../components/core/Sidebar"
import { useSelector, useDispatch } from "react-redux";
import { FlightCard } from '../components/core/FlightCard';

export const Searchflightpage = ()=> {
const [flightData,setFlightData] = useState([])
const [lowestPrice, setlowestPrice] = useState(true)
const {flights,loading,error} = useSelector( (state) => state.flight )


useEffect( ()=>{setFlightData(flights)},[flights])

function sortPrice(){
  setlowestPrice( (lowestPrice)=> !lowestPrice)

let sortedProducts;
lowestPrice ? sortedProducts = [...flights].sort((a, b) => a.price - b.price) :  sortedProducts = [...flights].sort((a, b) => b.price - a.price);


 setFlightData(sortedProducts)
}


if(error){
  return(
    <div className=' text-2xl text-red-600 font-bold text-center'>
      error aa gyiii
    </div>
  )
}

  return (
   <div className='bg-gray-100 mt-30'>
   <div className=' p-4 text-right'>
    <p>Sortby:
      <span 
      onClick={ () => sortPrice()}
      className=' cursor-pointer font-semibold'>{ `${lowestPrice ? " Lowest" : " Highest"}` }</span> 
      </p>
   </div>
   <div className=' mt-2 flex  h-lvh'>

    <Sidebar />
   
    <div className=' w-full '>
    {
      loading ? "loading " : 
      flightData.map( (flight) =>(
       <FlightCard flight = {flight} key={flight.id}/>
      ))
    }
    </div>
   </div>
   </div>
  )
}


