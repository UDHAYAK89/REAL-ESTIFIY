import {  useState } from "react"
import { app } from "../firebase";
import { getDownloadURL , getStorage , ref , uploadBytesResumable} from 'firebase/storage'
import { useSelector} from 'react-redux';
import { useNavigate , useParams } from "react-router-dom";
import { useEffect } from "react";

export default function UpdateListing() {

    const {currentUser} = useSelector((state)=> state.user)
    const [files , setfiles] = useState([]);
    const navigate = useNavigate();
    const params = useParams();
    const [uploading , setuploading] = useState(false);
    const [formData , setformData]  = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,

    });
    const [error ,seterror]  = useState(false)
    const [loading , setloading] = useState(false)
    const [imageUploadError , setImageUploadError]= useState(false)
    useEffect(()=>
        {
            const fetchListing = async () =>
                {
                    const listingid = params.listingid;
                    const res = await fetch(`/api/listing/get/${listingid}`);
                    const data = await res.json();
                    if (data.success === false)
                        {
                            console.log(data.message)
                            return;
                        }
                    setformData(data);
                }

                fetchListing();

        } , [])

    const handleImageSubmit = (e)=>
        {
           if(files.length > 0 && files.length + formData.imageUrls.length <7 )
            {
                setuploading(true);
                setImageUploadError(false)
                const promises = []
                

                for(let i=0; i<files.length; i++)
                    {
                        promises.push(storeImage(files[i]));
                    }
                    Promise.all(promises).then((urls) => {
                        setformData({ ...formData, imageUrls: formData.imageUrls.concat(urls) }); 
                        setImageUploadError(false);
                        setuploading(false)
                    }).catch ((err)=>{
                        setImageUploadError('Image upload failed (2 mb mex per image )')
                        setuploading(false)
                    }

                    );
                    

            }else
            {
                setImageUploadError('You can Only Upload 6 Images per listing');
            }

        }
        const storeImage  = async (file) =>
            {
                return new Promise((resolve , reject)=>
                    {
                        const storage =  getStorage(app);
                        const filename = new Date().getTime + file.name
                        const storageRef = ref(storage , filename)
                        const uploadTask = uploadBytesResumable(storageRef , file);
                        uploadTask.on
                        (
                            "state_changed",
                            (snapshot)=>
                                {
                                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
                                    console.log(`Upload is ${progress} done`);

                                },
                            (error)=>
                            {
                                reject(error)

                            },
                            ()=>
                                [
                                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                                        resolve(downloadURL)

                                    })
                                ]

                    )


                    })


        };
        const handleRemoveImage = (index)=>
            {
                setformData(
                    {
                        ...formData,
                        imageUrls: formData.imageUrls.filter((_, i) => i !== index),
                    });
            };

        const HandleChange = (e)=>
            {
                if(e.target.id ==="sale" || e.target.id === "rent")
                    {
                        setformData(
                            {
                                ...formData , 
                                type: e.target.id
                            })
                    } 
                if(e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer")
                    {
                        setformData(
                            {
                                ...formData,
                                [e.target.id]: e.target.checked
                            })
                    }
                if(e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea")
                    {
                        setformData(
                            {
                                ...formData,
                                [e.target.id]:e.target.value

                            })
                    }
               

            };
            const handleSubmit = async (e)=>
                {
                    e.preventDefault()
                    try {
                        if(formData.imageUrls.length < 1)
                            return seterror('You Must Upload At Least one image')
                        if(+formData.regularPrice > +formData.discountPrice) 
                            return seterror('Discount price must be lower than regular Price');
                        setloading(true)
                        seterror(false)
                        const res = await fetch(`/api/listing/update/${params.listingid}` ,
                        {
                            method:'POST',
                            headers:
                            {
                                'Content-Type':'application/json',
                            },
                            body: JSON.stringify(
                                {
                                    ...formData,
                                    userRef : currentUser._id

                                }),
                        })
                        const data = await res.json()
                        setloading(false);
                        if(data.success === false)
                            {
                                seterror(data.message)
                            }
                        navigate(`/listing/${data._id}`)
                    } catch (error) {
                        seterror(error.message)
                        setloading(false)
                        
                    }

                }
  return (
<main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
            <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={HandleChange}
            value={formData.name}
          />
          <textarea 
            placeholder="Description" 
            className="border p-3 rounded-lg" 
            id="description" 
            type="text"
            onChange={HandleChange}
            value={formData.description}
            required
          />
          <input 
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"  
            required
            onChange={HandleChange}
            value={formData.address}
          />
            <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={HandleChange}
                checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={HandleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={HandleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={HandleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={HandleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
        <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
                <input 
                type="number" 
                id="bedrooms" 
                min='1' 
                max='10'  
                required
                className="p-3 boreder border-gray-300 rounded-lg" 
                onChange={HandleChange}
                value={formData.bedrooms}
                />
                <p>Beds</p>
            </div>
                <input 
                type="number" 
                id="bathrooms" 
                min='1' 
                max='10'  
                required
                className="p-3 boreder border-gray-300 rounded-lg" 
                onChange={HandleChange}
                value={formData.bathrooms}/>
                <p>Baths</p>
                <input 
                type="number" 
                id="regularPrice" 
                min='50'
                max='1000000'  
                required
                className="p-3 boreder border-gray-300 rounded-lg" 
                onChange={HandleChange}
                value={formData.regularPrice}/>
                <div 
                className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">$/month</span>
        </div>
                {formData.offer && ( 
                <div className="flex items-center gap-2">
                <input 
                type="number" 
                id="discountPrice" 
                min='0' 
                max='1000000'  
                required
                className="p-3 boreder border-gray-300 rounded-lg"
                onChange={HandleChange}
                value={formData.discountPrice}
                />
                <div className="flex flex-col items-center"> 
                <p>Discounted Price</p>
                <span className="text-xs">$/month</span>
                </div>
                </div>
                )}
</div>
    </div>
    <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
                <div className="flex gap-4">
                    <input onChange={(e)=>setfiles(e.target.files)} className="p-3 border border-gray-300 rounded w-full" type="file" id="image" accept="image/*"  multiple />
                    <button onClick={handleImageSubmit} className="p-3 text-green-600 border border-green-800 rounded uppercase hover:shadow-lg disabled:opacity-85 " disabled={uploading}>{ uploading ? 'uploading...' : 'upload'}
                    </button>
                </div>
                    <p className="text-red-700">{imageUploadError && imageUploadError}</p> 
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                        <div
                         key={url}
                          className="flex justify-between p-3 border items-center"
                         >
                            <img 
                            src={url} 
                            alt="listing image" 
                            className= "w-20 h-20 object-cover rounded-lg"
                             />
                            <button 
                            type="button" 
                            onClick={ () => handleRemoveImage(index)} className="text-red-500 rounded-lg uppercase opacity-85 disabled:opacity-90"
                            >
                                Delete
                            </button>

                        </div>
                    ))}
                    <button 
                    disabled={loading || uploading} 
                    className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80" 
                    >
                        {loading ? 'Updating...' : 'Update listing'}
                    </button>
                    {error && <p className="text-red-700 text-sm">{error }</p>}
            </div>
        </form>
    </main>
  )
}