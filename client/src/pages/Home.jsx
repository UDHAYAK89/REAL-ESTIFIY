import { useEffect, useState } from 'react';
import {Link } from 'react-router-dom';
import {Swiper , SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules'
import SwiperCore from 'swiper'
import 'swiper/css/bundle';
import ListingItems from '../components/ListingItems';
export default function Home() {
  SwiperCore.use([Navigation])
  const [offerListings , setOfferListings] = useState([]);
  // const [listing, setListing] = useState([]);
  const [SaleListings , setSaleListings] = useState([]);
  const [RentListings , setRentListings] = useState([]);
  console.log(SaleListings);

  useEffect(()=>
    {
      const fetchOfferListings = async ()=>
        {
          try {
            const res = await fetch('/api/listing/get?offer=true&limit=4');
            const data = await res.json()
            setOfferListings(data)
            fetchRentListings();
            
          } catch (error) 
          {
            console.log(error);
            
          }

        }
        const fetchRentListings = async ()=>
      {
        try {
          const res = await fetch('/api/listing/get?type=rent&limit=4');
            const data = await res.json()
            setRentListings(data)
          
            fetchSaleListings();
          
        } catch (error) {
          console.log(error);
          
        }
      }
        const fetchSaleListings = async ()=>
      {
        try {
          const res = await fetch('/api/listing/get?type=sale&limit=4');
            const data = await res.json()
            setSaleListings(data)
          
        } catch (error) {
          console.log(error);
          
        }
      }
      fetchOfferListings();

    }
      , [])

  return (
    <div >
      {/* top */} 
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
            <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
                <span className="text-indigo-600">Discover</span> your next <br/> <span className="text-indigo-600">ideal</span> place with <br/> <span className="text-indigo-600">effortless</span> ease
            </h1>
            <div className='text-gray-400 text-xs sm:text-sm'>
                Realestify is the <span className="text-indigo-600">premier</span> destination to find your next <span className="text-indigo-600">perfect</span> place to live <br/> We have an <span className="text-indigo-600">extensive selection</span> of properties for you to choose from.
            </div>
            <Link to={'/search'} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
        Let's get start</Link>
        </div>
      

     
      {/* {swiper} */}
      {offerListings && offerListings.length > 0 ? (
        <Swiper navigation>
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div className='h-[500px] w-full flex items-center justify-center'>
                <img
                  src={listing.imageUrls[0]}
                  alt={`Listing ${listing._id}`}
                  className='h-full w-full object-cover'
                  onLoad={() => console.log(`Image loaded: ${listing.imageUrls[0]}`)}
                  onError={() => console.log(`Failed to load image: ${listing.imageUrls[0]}`)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>):(<p className='text-center my-7'>NO listings Availabel</p>)}
      
      


      {/* {lsiting results for offer ,  sale and rent} */}
      {/* {top} */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        { offerListings && offerListings.length > 0 && 
        (

            <div className='my-3'>
              <div className='text-2xl font-semibold text-black '>
                <h2>
                  Recent Offers
                </h2>
                <Link className=' text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show More Offers</Link>
              </div>
              <div className='flex flex-wrap gap-14'>
                {
                  offerListings.map((listing)=>
                    (
                      <ListingItems listing={listing} key={listing._id} />
                  ))}
                  </div>
            </div>
        )
        
        }
        { RentListings && RentListings.length > 0 && 
        (
            <div className='my-3'>
              <div className='text-2xl font-semibold text-black'>
                <h2>
                  Recent places for Rent
                </h2>
                <span><Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show More Offers</Link></span>
              </div>
              <div className='flex flex-wrap gap-14'>
                {
                  RentListings.map((listing)=>
                    (
                      <ListingItems listing={listing} key={listing._id} />
                  ))}
                  </div>
            </div>
        )
        
        }
        { SaleListings && SaleListings.length > 0 && 
        (
            <div className='my-3'>
              <div className='text-2xl font-semibold  text-black'>
                <h2>
                  Recent places for Sale
                </h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show More Offers</Link>
              </div>
              <div className='flex flex-wrap gap-14'>
                {
                  SaleListings.map((listing)=>
                    (
                      <ListingItems listing={listing} key={listing._id} />
                  ))}
                  </div>
            </div>
        )
        
        }
      </div>
      </div>
  );
}