import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SigninStart, SigninSuccess, signinFailure } from "../redux/user/userSlice";
import Oauth from "../components/Oauth.jsx";

export default function Signin() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData); // Debugging

    try {
      dispatch(SigninStart());
      const url = '/api/auth/signin';
      console.log('URL:', url); // Debugging

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log('Response Data:', data); // Debugging

      if (data.success === false) {
        dispatch(signinFailure(data.message));
        return;
      }
      dispatch(SigninSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signinFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id='email'
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id='password'
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounde-lg uppercase hover:opacity-95 disabled:opacity-80 rounded-lg"
        >
          {loading ? 'Loading...' : 'Sign IN'}
        </button>
        <Oauth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an Account? </p>
        <Link to='/signup'>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
