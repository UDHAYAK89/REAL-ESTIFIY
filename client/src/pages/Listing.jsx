import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore  from 'swiper';
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle';
import {FaBath, FaChair, FaMapMarkedAlt, FaParking, FaShare , FaBed} from 'react-icons/fa';
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

export default function Listing() {
    SwiperCore.use([Navigation]);
    const [loading, setLoading] = useState(true);
    const [listing, setListing] = useState(null);
    const [copied , setcopied] = useState(false)
    const [error, setError] = useState(false);
    const [contact , setConatct] = useState(false);
    const params = useParams();
    const {currentUser} = useSelector((state)=> state.user);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingid}`);
                const data = await res.json();
                console.log('Fetched data:', data);

                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                console.log('Image URLs:', data.imageUrls);
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                console.error('Fetch error:', error);
                setError(true);
                setLoading(false);
            }
        };

        fetchListing();
    }, [params.listingid]);

    return (
        <main>
            {loading && <p className="text-center my-7">Loading...</p>}
            {error && <p className="text-center my-7 text-2xl text-red-800">Something Went Wrong</p>}
            {listing && !loading && !error && (
                <div>
                    <Swiper navigation>
                        {listing.imageUrls.map((url, index) => (
                            <SwiperSlide key={index}>
                                <img 
                                    src={url}
                                    alt={`Listing ${index}`}
                                    className="h-[500px] w-full object-cover"
                                    id="image"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-200 cursor-pointer shadow-lg">
                      <FaShare className="text-slate-500" onClick={()=>
                        {
                          navigator.clipboard.writeText(window.location.href);
                          setcopied(true);
                          setTimeout(() => {
                            setcopied(false)
                          }, 2000);
                          
                        }}
                        ></FaShare>
                        </div>
                        {copied &&(<p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-300 p-2">Link Copied!</p>)}
                        <div className="flex flex-col max-w-4xl mx-auto p-3 my-4 gap-4">
                          <p className="text-2xl font-semibold">
                            {listing.name} - ${' '}
                            {listing.offer ? listing.discountPrice.toLocaleString('en-US')
                            : listing.regularPrice.toLocaleString('en-US')}
                            {listing.type === "rent" && '/ month'}
                            </p>
                            <p className="flex items-center mt-6 gap-2 text-slate-700 text-sm">
                              <FaMapMarkedAlt className="text-green-700"> </FaMapMarkedAlt>
                                {listing.address}
                            </p>
                            <div className="flex gap-4">
                              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-2 rounded-md">
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                              </p>
                              {listing.offer &&(<p className="bg-green-900 w-full max-w-[200px] text-white text-center p-2 rounded-md"> 
                                ${+listing.regularPrice - +listing.discountPrice} OFF
                              </p>)}
                            </div>
                            <p className="text-slate-800">
                              <span className="font-semibold text-black">Description - </span>
                              {listing.description}
                            </p>
                            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                              <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaBed className="text-lg"></FaBed>{listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                              </li>
                              <li className="flex items-center gap-1 whitespace-nowrap">
                              <FaBath className="text-lg"></FaBath>{listing.bathrooms > 1 ? `${listing.bathrooms} bath` : `${listing.bathrooms} bath`}
                              </li>
                              <li className="flex items-center gap-1 whitespace-nowrap">
                              <FaParking className="text-lg"></FaParking>{listing.parking ? 'Parking spot' : 'No Parking'}
                              </li>
                              <li className="flex items-center gap-1 whitespace-nowrap">
                              <FaChair className="text-lg"></FaChair>{listing.furnished ? 'Furnished' : 'UnFrnished'}
                              </li>
                            </ul>
                            {currentUser && listing.userRef !== currentUser._id && !contact &&(
                           <button onClick={()=>
                           {
                            setConatct(true)
                           }} className="bg-slate-700 text-white rounded-lg uppercase hover: opacity-95 p-3 ">Contact landlord</button>)}
                           {contact && <Contact listing={listing}/>}
                        </div>
                </div>
            )}
        </main>
    );
}
