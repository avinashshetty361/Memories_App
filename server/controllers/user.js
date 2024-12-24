import bcryt from 'bcryptjs'
import jwt from 'jsonwebtoken'//to store info of user for some period of time(user can stay log in for 5 day or 1 week)

import User from '../models/user.js'

export const signin = async (req, res) => {
    const { email, password } = req.body;//whenever there is 'post' method get it by req.body
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(404).json('User doesn`t exist');
        const isPasswordCorrect = await bcryt.compare(password, existingUser.password);// wee cant simply compare string we need to use this
        if (!isPasswordCorrect) {
            return res.status(400).json('Invalid Credentials');
        }
        const token = jwt.sign({
            email: existingUser.email,
            id: existingUser._id
        }, 'test', { expiresIn: "1h" });//here test is secret
        res.status(200).json({result:existingUser,token});
    } catch (error) {
        res.status(500).json({message:'Something went wrong'});

    }
}

export const signup = async (req, res) => {
   const {email,password,confirmPassword,firstName,lastName}=req.body;
   try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return  res.status(400).json('User already exist');
    if(password!==confirmPassword)  return  res.status(400).json('Password doesn`t match');

    const hashedPassword=await bcryt.hash(password,12);//12 is salt
    const result=await User.create({email,password:hashedPassword,name:`${firstName} ${lastName}`});
    const token = jwt.sign({
        email: result.email,
        id: result._id
    }, 'test', { expiresIn: "1h" });
    res.status(200).json({result,token});
    
   } catch (error) {
    res.status(500).json({message:'Something went wrong'});
    console.log(error);

   }
}