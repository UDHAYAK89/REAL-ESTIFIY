
import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';


export const signup = async (req , res  , next)=>
    {
       const {userName , email , password } = req.body;
       const hasheadPassword = bcryptjs.hashSync(password , 10);
       const newUsesr = new User({userName , email , password : hasheadPassword});
       try {
        await newUsesr.save();
       res.status(201).json("User Created Succusefully");
       }
       catch (error)
       {
         next(error);

       }
       
    }

export const signin = async (req , res , next)=>
  {
    const {email , password} = req.body;
    try {
      const validUser = await User.findOne({email})
      if(!validUser)  return next(errorHandler(404 , 'User Not Found'));
      const validPaasword = bcryptjs.compareSync(password , validUser.password);
      if(!validPaasword) return next(errorHandler(401, 'Wrong Credentials! '));
      const token = jwt.sign({id : validUser._id}, process.env.JWT_SECRET)
      const {password: hasheadPassword, ...rest} = validUser._doc
      res.cookie('Access_Token',token , { httpOnly: true})
      .status(200)
      .json(rest);
    }
    catch(error)
    {
      next(error)

    }
  }


  export const google = async (req , res , next)=>{
      try
      {
        const user = await User.findOne({email : req.body.email})
        if(user)
          {
            const token = jwt.sign({id : user._id} , process.env.JWT_SECRET);
            const {password : pass , ...rest} = user._doc;
            res.cookie('Access_Token', token , {httpOnly: true})
            .status(200)
            .json(rest);
          }
          else
          {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hasheadPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({userName: req.body.name.split(" ").join(" ").toLowerCase() + Math.random().toString(36).slice(-4) , email: req.body.email, password: hasheadPassword , avatar: req.body.photo});
            await newUser.save();
            const token = jwt.sign({id : newUser._id} , process.env.JWT_SECRET);
            const {password : pass , ...rest} = newUser._doc;
            res.cookie('Access_Token', token , {httpOnly: true})
            .status(200)
            .json(rest);
          }

      }catch(error){
        next(error);

      }
    }
  

export const signOut = async (req , res , next)=>
  {
    try {

      res.clearCookie('Access_Token');
      res.status(200).json('User has been logged Out!')
      
      
    } catch (error) {
      next(error); 
    }
  }
    