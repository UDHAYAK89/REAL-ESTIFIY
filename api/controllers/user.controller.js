import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";

export const  test = (req , res)=>
    {
       res.json({message  : "UDHAYAKUMAR got job"})
    };
export const updateUser =async  (req , res , next)=>
   {
      if(req.user.id !== req.params.id) return next(errorHandler(401 , 'You Can update your own account'))
         try
      {
         if(req.body.password)
            {
               req.body.password = bcryptjs.hashSync(req.body.password , 10)

            }
            const updateUser  = await User.findByIdAndUpdate(req.params.id,
               {
                  $set:
                  {
                     userName : req.body.userName,
                     email: req.body.email,
                     password : req.body.password,
                     avatar : req.body.avatar,
                  },
               } , {new : true});
            const {password , ...rest} = updateUser._doc

            res.status(200).json(rest);
      }
      catch(error)
      {
         console.log(error);
      }
   }

   export const deleteUser = async (req, res , next)=>
      {
         if(req.user.id !== req.params.id)
            return next(errorHandler(401 , 'You Can Only Delete Your Own Account!'));
         try
         {
            await User.findByIdAndDelete(req.params.id);
            res.clearCookie('Access_Token')
            res.status(200).json('User has been Deleted!')
         }
         catch(err)
         {
            console.log(err);
         }
      }
   export const getUserListing = async (req , res ,next)=>
      {
         if(req.user.id === req.params.id)
            {
               try {
                  const listings = await Listing.find({ userRef : req.params.id })
                  res.status(200).json(listings);
               } 
               catch (error)  
               {
                  next(error);
               }
            }
         else
         {
            return next(errorHandler(401 , "You can View Your Own listing "))
         }
      }
export const getUser = async (req , res , next)=>
   {
      try {
         const user = await User.findById(req.params.id);
         if(!user) return next(errorHandler(404 , 'User Not Found'))
         const {password: pass , ...rest}  = user._doc;
         res.status(200).json(rest)
         
      } catch (error) {
         next(error)
         
      }
      

   }