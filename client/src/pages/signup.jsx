import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Oauth from "../components/Oauth.jsx";

export default function signup() {
  const [formData , setformData] = useState({})
  const [error , seterror]  = useState(null)
  const [loading , setloading] = useState(false)
  const navigate = useNavigate();
  const handelChange = (e)=>
    {
      setformData
      ({
        ...formData,
        [e.target.id]: e.target.value,

      })
    };
    const handleSubmit = async (e)=> 
      {
        e.preventDefault();
          try  
           {
              setloading(true);
              const res = await fetch('/api/auth/signup' , 
              {
                method: 'POST',
                headers: 
                {
                  'Content-Type' : 'application/json',
                },
                  body: JSON.stringify(formData),
              });
                const data = await res.json();
                console.log(data);
                  if(data.success === false)
                  {
                    setloading(false);
                    seterror(data.message);
                    return;
                  }
                    setloading(false)
                    seterror(null);  
                    navigate('/signin')
              }catch(error)
                {
                  setloading(false)
                  seterror(error.message);

                }
      }
      return (
        <div className="p-3 max-w-lg mx-auto">
          <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <input
              type="text" placeholder="userName"
              className="border p-3 rounded-lg"
              id="userName"
              value={formData.userName}
              onChange={handelChange}
            />
            <input
              type="email" placeholder="email"
              className="border p-3 rounded-lg"
              id="email"
              value={formData.email}
              onChange={handelChange}
            />
            <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password"
              value={formData.password}
              onChange={handelChange} >

            </input>
            <button
              className="bg-slate-700 text-white p-3 rounde-lg uppercase hover:opacity-95 disabled:opacity-80"
              type="submit"
            >
              Sign Up
            </button>
            <Oauth/>
          </form>
          <div className="flex gap-2 mt-5">
            <p>Have an Account?</p>
            <Link to="/Signin">
              <span className="text-blue-700">Sign In</span>
            </Link>
          </div>
          {error && <div className="text-red-500 mt-3">{error}</div>}
          {loading && <div className="mt-3">Loading...</div>}
        </div>
      )};
