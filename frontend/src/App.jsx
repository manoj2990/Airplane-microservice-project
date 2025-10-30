import { Route, Routes, useNavigate } from "react-router-dom"

import { Navbar } from "./components/common/Navbar";
import {Homepage} from "./pages/Homepage"
import {Searchflightpage} from "./pages/Searchflightpage"
import { SeatMatrixPage } from "./pages/Seatmatrixpage";
import {AuthPage} from "./pages/AuthPage"
import {ConfirmationPage} from './pages/confirmationpage'

function App() {
  return (
    <div className="min-h-screen flex flex-col  mx-20 relative  ">
  
      <Navbar />

      <Routes>
        <Route path="/" element={ <Homepage/>}/>
        <Route path="/travel/flights" element={ <Searchflightpage/> }/>

     
         <Route path="/travel/flights/:id/seat" element= {<SeatMatrixPage/>} />
        <Route path="/travel/flight/confirm" element={ <ConfirmationPage/>} />
       
        <Route path="/auth" element={ <AuthPage/>} />
      </Routes>
    
    
    </div>
  );
}

export default App;
