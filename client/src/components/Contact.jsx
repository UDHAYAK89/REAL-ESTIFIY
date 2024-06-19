import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function Contact({listing}) {
  const [landlord , setLandlord] = useState(null)
  const [message  , setMessage] = useState('')

  useEffect(()=>
    {
      const Landlord = async ()=>
        {
          try {
            const res = await fetch(`/api/user/${listing.userRef}`);
            const data = await res.json();
            setLandlord(data)

          } catch (error) {
            console.log(error);
            
          }
        };
        Landlord();
    },[listing.userRef]);

    const onChange = (e)=>
      {
        setMessage(e.target.value);

      }
  return (
    <>
    {landlord && (
      <div className="flex flex-col gap-2" >
        <p>Contact <span className="font-semibold">{landlord.userName}</span> for 
        <span className="font-semibold">{listing.name.toLowerCase()}</span></p>
        <textarea name="message" id="message" rows={2} className="w-full border p-3 rounded-lg" value={message} onChange={onChange} placeholder="Enter Your Message here..." ></textarea>
        <Link  to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} className="bg-slate-800 text-white text-center p-3 uppercase rounded-lg hover:opacity-95">
        send Message
        </Link>
    </div>
  )
  }
    </>
   
  )
}