import express from 'express'
import {createListing , deletelisting , updatelisting , getlisting, getListings} from '../controllers/listing.controller.js'
import { verifyToken } from '../utils/verifyuser.js';

const router = express.Router();


router.post('/create', verifyToken , createListing)
router.delete('/delete/:id' , verifyToken , deletelisting);
router.post('/update/:id' , verifyToken , updatelisting);
router.get('/get/:id' , getlisting  );
router.get('/get' , getListings)


export default router
