import { BrowserRouter , Routes , Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";


export default function App() {
  return (
    <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/signin" element={<Signin/>}></Route>
          <Route path="/signup" element={<Signup/>}></Route>
          <Route path="/about" element={<About/>}></Route> 
          <Route path="/search" element={<Search/>}></Route>
          <Route path="/listing/:listingid" element={<Listing/>}/>
          <Route element={<PrivateRoute/>}>
              <Route path="/profile" element={<Profile/>}></Route>
              <Route path="/create-listing" element={<CreateListing/>}></Route>
              <Route path="/update-listing/:listingid" element={<UpdateListing/>}>
              </Route>
          </Route>
        
          
        </Routes>
    </BrowserRouter>
  )
}