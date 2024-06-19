import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import ListingItems from "../components/ListingItems.jsx";
export default function Search() {

    const [sidebardata , setsitebarData] = useState({
        searchTerm:'',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'created_at',
        order:'desc',
    });
    const navigate = useNavigate();
    const [loading , setloading] = useState(false);
    const [listings , setlistings] = useState([]);
    const [showMore , setShowMore] = useState(false)

    useEffect(()=>
        {
            const urlParams = new URLSearchParams(location.search)
            const searchfromurl = urlParams.get('searchTerm');
            const typefrmourl = urlParams.get('type');
            const parkingfrmourl = urlParams.get('parking');
            const furnishedfrmourl = urlParams.get('furnished');
            const offerfrmourl = urlParams.get( 'offer');
            const sortfrmourl = urlParams.get('sort');
            const orderfrmourl = urlParams.get( 'order');
            if(searchfromurl || typefrmourl || parkingfrmourl || furnishedfrmourl || orderfrmourl || sortfrmourl || offerfrmourl  )
                {
                    setsitebarData(
                        {
                            searchTerm: searchfromurl || '',
                            type: typefrmourl || 'all',
                            parking: parkingfrmourl === 'true' ? true : false,
                            furnished: furnishedfrmourl === 'true' ? true : false,
                            offer: offerfrmourl === 'true' ? true : false,
                            sort: sortfrmourl || 'created_at',
                            order: orderfrmourl || 'desc',
                        });
                    
                }
        const fetchListing = async ()=>{
        setloading(true);
        const SearchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${SearchQuery}`)
        const data  = await res.json();
        if(data.length > 8)
            {
                setShowMore(true)
            }
        else
        {
            setShowMore(false)
        }
        setlistings(data)
        setloading(false)
    };
    fetchListing();
        }, [location.search]);
    


    const handleChange = (e)=>
        {
            if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale')
                {
                    setsitebarData({
                        ...sidebardata , type: e.target.id
                    })
                }
            if(e.target.id === 'searchTerm')
                {
                    setsitebarData({
                        ...sidebardata , searchTerm: e.target.value
                    })
                }
            if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer')
                {
                    setsitebarData(
                        {
                            ...sidebardata, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false,
                        })
                }
            if(e.target.id === 'sort_order')
                {
                    const sort = e.target.value.split('_')[0] || 'created_at';
                    const order = e.target.value.split('_')[1] || 'desc';
                    setsitebarData(
                        {
                            ...sidebardata, sort , order
                        })
                }


        }
        const handleSubmit = (e)=>
            {
                e.preventDefault();
                const urlParams = new URLSearchParams()
                urlParams.set('searchTerm' ,  sidebardata.searchTerm)
                urlParams.set('type' ,  sidebardata.type)
                urlParams.set('parking' ,  sidebardata.parking)
                urlParams.set('furnished' ,  sidebardata.furnished)
                urlParams.set('offer' ,  sidebardata.offer)
                urlParams.set('sort' ,  sidebardata.sort)
                urlParams.set('order' ,  sidebardata.order)
                const SearchQuery = urlParams.toString();
                navigate(`/search?${SearchQuery}`)
            }
        const onShowMore = async ()=>
            {
                const numberoflsiting  = listings.length;
                const startIndex = numberoflsiting
                const urlParams = new URLSearchParams(location.search)
                urlParams.set('startIndex', startIndex);
                const SearchQuery = urlParams.toString();
                const res = await fetch(`/api/listing/get?${SearchQuery}`)
                const data = await res.json();
                if(data.length < 9)
                    {
                        setShowMore(false);
                    }
                    setlistings(data)
                    setShowMore(false)
                
                    setlistings([...listings, ...data])
            };
  return (
    <div className='flex flex-col md:flex-row '>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen lg:w-1/3'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
                <label className="font-semibold whitespace-nowrap">SearchTerm:</label>
                <input type="text"
                id="searchTerm"
                placeholder="Search.."
                className="border rounded-lg p-3 w-full"
                value={sidebardata.searchTerm}
                onChange={handleChange}>
                </input>
            </div>
            <div className="flex gap-3 flex-wrap items-center">
                <label className="font-semibold ">Type:</label>
                <div className="flex gap-2 ">
                    <input type="checkbox" id="all" className="w-5" onChange={handleChange} checked={sidebardata.type ==='all'}/>
                    <span>Rent & sale</span>
                </div>
                <div className="flex gap-2 ">
                    <input type="checkbox" id="rent" className="w-5" onChange={handleChange}  checked={sidebardata.type ==='rent'}/>
                    <span>Rent</span>
                </div>
                <div className="flex gap-2 ">
                    <input type="checkbox" id="sale" className="w-5" onChange={handleChange}  checked={sidebardata.type ==='sale'}/>
                    <span>Sale</span>
                </div>
                <div className="flex gap-2 ">
                    <input type="checkbox" id="offer" className="w-5" onChange={handleChange} checked={sidebardata.offer}/>
                    <span>Offer</span>
                </div>
            <div className="flex gap-3 flex-wrap items-center">
                <label className="font-semibold">Amenities:</label>
                <div className="flex gap-2 ">
                    <input type="checkbox" id="parking" className="w-5" onChange={handleChange}  checked={sidebardata.parking}/>
                    <span>Parking</span>
                </div>
                <div className="flex gap-2 ">
                    <input type="checkbox" id="furnished" className="w-5"onChange={handleChange}  checked={sidebardata.furnished}/>
                    <span>Furnished</span>
                </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <label className="font-semibold">
                        Sort:
                    </label>
                    <select
                    onChange={handleChange} 
                    defaultChecked={'created_at_desc'}                    
                    id="sort_order" className="border rounded-lg p-3">
                        <option value={'regularPrice_desc'}>Price high to Low</option>
                        <option value={'regularPrice_asc'}>Price low to high</option>
                        <option value={'created_at_desc'} >Latest</option>
                        <option value={'created_at_asc'}>Oldest</option>    
                    </select>
                </div>

            </div>
            <button className="text-white bg-slate-800 uppercase p-3 rounded-lg hover:opacity-95">Search</button>
        </form>

    </div>
    <div className="flex-1">
        <h1  className="text-3xl font-semibold border-b  text-slate-800 mt-5 p-3">Listing results:
        </h1>
        <div className="p-7 flex flex-row gap-24 flex-wrap">{!loading && listings.length === 0 &&  (
            <p className="text-xl text-slate-600">No Listing Found!</p>
        )}
        {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
            Loading...
        </p>
        )}

        {!loading && listings && listings.map((listing)=>
            <ListingItems key={listing._id} listing={listing}/>
        )}

        {showMore &&(
            <button className="text-green-700 hover:underline p-7 w-full text-center" onClick={onShowMore}>
                Show More
            </button>
        )}
        
        
        </div>
        
    </div>

    </div>
  )
}