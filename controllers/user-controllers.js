import { compareSync, hashSync } from "bcryptjs"
import { json } from "express"
import User from "../models/User"

export const getAllUsers=async(req,res)=>{
    let users
    try{
        users=await User.find()
    }catch(err){
        return console.log(err)
    }
    if(!users){
        return res.status(500).json({message:"Unexpected error occured"})
    }
    return res.status(200).json({users})
}

export const signup=async(req,res,next)=>{
    const {name,email,password}=req.body
    if(!name && name.trim()==="" && !email && email.trim()==="" && !password && password.length<6){
        return res.status(422).json({message:"Invalid data"})
    }

    const hashedPassword=hashSync(password)

    let user
    try{
        user=new User({
            name,
            email,
            password:hashedPassword
        })
        await user.save()
    }catch(err){
        return console.log(err)
    }
    if(!user){
        return res.status(500).json({message:"Unaccepted error occured"})
    }

    return res.status(201).json({user})
}

export const login=async(req,res,next)=>{
    const {email,password}=req.body
    if(!email && email.trim()==="" && !password && password.length<6){
        return res.status(422).json({message:"Invalid data"})
    }

    let existingUser
    try{
        existingUser=await User.findOne({email})
    }catch(err){
        return console.log(err)
    }
    if(!existingUser){
        return res.status(404).json({message:"No user found"})
    }
    const isPasswordCorrect=compareSync(password,existingUser.password)
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Incorrect password"})
    }

    return res.status(200).json({id:existingUser._id,message:"Login successful"}) 
}