import {FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
export default function Header() {
    const {currentUser} =  useSelector(state => state.user)
    const [searchTerm , setsearchTerm] = useState('')
    const navigate = useNavigate()
    const handleSubmit = (e)=>

        {
            e.preventDefault();
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('searchTerm' , searchTerm);
            const searchQuery = urlParams.toString();
            navigate(`/search?${searchQuery}`)

        }
    useEffect(()=>
        {
            const urlParams = new URLSearchParams(location.search)
            const searchTermfromurl = urlParams.get('searchTerm');
            if(searchTermfromurl)
            {
                setsearchTerm(searchTermfromurl)
            }
        },[location.search])
  return (
    <header className="bg-slate-200 shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3 ">
            <Link to='/'>
            <h1  className=" font-bold text-sm sm:text-xl flex  flex-wrap gap-1">
                <span className="text-purple-600 hover: cursor-pointer ">REAL</span>
                <span className="text-rose-700 hover: cursor-pointer ">ESTIFY</span>
            </h1>
            </Link>
            <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center hover: cursor-pointer">
                <input type="text" placeholder="Search..." className="bg-transparent focus:outline-none w-24 sm:w-64"
                value={searchTerm}
                onChange={(e)=>
                {
                    setsearchTerm(e.target.value)
                }}
                />
                <button><FaSearch className='text-slate-800'/></button>
                
            </form>
            <ul className='flex flex-wrap gap-4 font-normal'>
                <Link to={'/home'}>
                <li className='hidden sm:inline text-slate-700  hover:cursor-pointer'>HOME</li>
                </Link>
                <Link to={'/about'}>
                <li className='hidden sm:inline text-slate-700  hover: cursor-pointer'>ABOUT</li>
                </Link>
                <Link to={'/profile'}>
                { currentUser ? (<img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='Profile'/>): (<li className=' text-slate-700 hover:underline hover:cursor-pointer'>SIGN IN</li>)}
                </Link>
                
            </ul>
        </div>
    </header>
  
)
}