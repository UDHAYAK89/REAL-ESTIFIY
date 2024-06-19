import React  , { useRef , useState , useEffect } from "react"
import { useSelector  , useDispatch} from "react-redux"
import { updateUserSuccess , updateUserFailure , updateUserStart , deleteUserSuccess , deleteUserFailure , deleteUserStart, signOutUserStart, signOutUserFailure, signUserSuccess } from "../redux/user/userSlice.js";
import { Link } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase.js";


export default function Profile() {

  const {currentUser , loading , error} = useSelector((state)=> state.user);
  const fileref = useRef(null)
  const [file , setfile] = useState(undefined)
  const [formData , setformData] = useState({});
  const [updateSucess , setupdateSucess ] = useState(false);
  const [filePerc , setfilePerc] = useState(0)
  const [fileUploadError , setfileUploadError] = useState(false);
  const [showListinsgerror , setshowListingsError] = useState(false);
  const [userListings , setuserListings] = useState([])
  const dispatch = useDispatch();

  
  //firebase storage
  // allow read;
  //     allow write: if 
  //     request.resource.size <2*1024 *1024 && 
  //     request.resource.contentType.matches('image/.*')
  


  useEffect(()=>
    {
      if(file)
        {
          handleFileUpload(file)
        }
    }, [file]);
  const handleFileUpload = (file)=>
    {
      const storage = getStorage(app);
      const filename = new Date().getTime() +  file.name;
      const storageRef = ref(storage , filename)
      const uploadTask  = uploadBytesResumable(storageRef , file);

      uploadTask.on('state_changed',
      (snapshot)=>{
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setfilePerc(Math.round(progress))
      },
      (error)=>{
          setfileUploadError(true)
      },
      ()=>  {
            getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL)=> setformData({...formData , avatar: downloadURL}) );
          }
        );
        };
  const handleChange = (e)=>
    {
      setformData({...formData, [e.target.id]: e.target.value})
     
    }
    const handleSubmit = async (e)=>
      {
        e.preventDefault();
        try {
          dispatch(updateUserStart());
          const res = await fetch(`/api/user/update/${currentUser._id}`, {
            method : 'POST' , 
            headers:
            {
              'Content-Type' : 'application/json',
            },
            body : JSON.stringify(formData),
          });
          const data = await res.json()
          if(data.success === false)
          {
          dispatch(updateUserFailure(data.message))
          return;
          }
          dispatch(updateUserSuccess(data))
          setupdateSucess(true)
        } catch (error) {
        dispatch(updateUserFailure(error.message))
          
        }
      
      };

    const handleDlete = async ()=>
      {
        try {
          dispatch(deleteUserStart())
          const res = await fetch(`/api/user/delete/${currentUser._id}`,
          {
            method: 'DELETE',
            
          });
          const data = await res.json();
          if(data.success === false)
            {
              dispatch(deleteUserFailure(data.message))
              return;
            }
            dispatch(deleteUserSuccess(data))

          
        } catch (error) {
          dispatch(deleteUserFailure(error.message))
        }

      }

    const handleSignOut = async ()=>
      {
        try {
          dispatch(signOutUserStart())
          const res = await fetch('/api/auth/signout');
          const data = await res.json();
          if(data.success === false)
            {
              dispatch(signOutUserFailure(data.message))
              return;
            }
        dispatch(deleteUserSuccess(data))
          
        } catch (error) {
          dispatch(deleteUserSuccess(error.message))
        }
      };

      const handleShowListings = async ()=>
        {
          try {
            setshowListingsError(false);
            const res  = await fetch(`/api/user/listings/${currentUser._id}`);
            const data = await res.json();
            if( data.success === false )
              {
                setshowListingsError(true)
                true;
              }
              setuserListings(data);

          }
           catch (error) {
            setshowListingsError(true)

            
          }

        };
      const handleListingDelete = async (ListingId)=>
        {
          try
          {
            const res = await fetch(`/api/listing/delete/${ListingId}`,
            {
              method:'DELETE' , 
            });
            const data = await res.json();
            if(data.success === false)
              {
                console.log(data.message);
                return;
                
              }
              setuserListings((prev) => 
                prev.filter((listing) =>  listing._id !==  ListingId ))
          }catch(err)
          {
            console.log(err.message);

          }

        }
      return (
    <div className="p-3 max-w-lg mx-auto">
    <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
    <form  onSubmit={handleSubmit} className="flex flex-col gap-5">
      <input 
      onChange={(e)=>setfile(e.target.files[0])}
      type="file" 
      ref={fileref} 
      hidden 
      accept="image/*"
      />
      <img 
      onClick={()=>fileref.current.click()} 
      src={formData.avatar ||currentUser.avatar} 
      alt="profile" 
      className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" 
      />
      <p className="text-sm self-center"> 
        { fileUploadError ? 
        (<span className="text-red-700">Error Image upload (image must be less than 2MB)</span>)
        :
        filePerc > 0 && filePerc < 100 ? (
      <span className="text-slate-700">{`Uploading ${filePerc}% `}</span>
    ) : 
    filePerc === 100 ? (<span className="text-green-400">Image Upload Successfully!</span>) : null
    }

      </p>
      <input 
      type="text" 
      placeholder="userName" 
      id="userName"  
      className="border-4  border-b-slate-900 ... p-4 rounded-lg" 
      defaultValue={currentUser.userName}
      onChange={handleChange}
      />
      <input 
      type="email" 
      placeholder="email" 
      id="email" 
      className="border-4  border-b-slate-900 ... p-4 rounded-lg" 
      defaultValue={currentUser.email}
      onChange={handleChange}
      />
      <input 
      type="password" 
      placeholder="password" 
      id="password"  
      className="border-4  border-b-slate-900 ... p-4 rounded-lg" 
      onChange={handleChange}
      />
      <button  disabled={loading}
      className="bg-slate-800 text-white rounded-lg p-4 mt-10 uppercase hover:opacity-95 disabled:opacity-80"
      >
        {loading ? 'Loading...' : 'Update'}
        </button>
      <Link to={'/create-listing'} className="bg-green-600 text-white rounded-lg p-4 uppercase hover:opacity-95 disabled:opacity-80 text-center" >
        Create Listing
        </Link> 

    </form>
    <div className="flex justify-between mt-8">
      <span onClick={handleDlete} className="text-red-700 cursor-pointer">
        Delete Account
      </span>
      <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
        Sign Out
      </span>
    </div>
    <p className="text-red-700 mt-5">{error ? error : ''}</p>
    <p className="text-green-700 mt-5">{updateSucess  ? ' User is updated Successfully' : ' ' }</p>
    <button onClick={handleShowListings}  className=' bg-blue-500 shadow-lg shadow-blue-500/50 text-white w-full text-center uppercase p-3 rounded-lg  hover:opacity-85  disabled:opacity-90' >
        Show Listings
      </button>
      <p className='text-red-700 mt-5'>
        {showListinsgerror ? 'Error showing listings' : ''}
      </p>

      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}