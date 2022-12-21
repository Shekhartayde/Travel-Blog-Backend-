import mongoose, { mongo } from "mongoose"
import Post from "../models/Post"
import User from "../models/User"

export const getAllPosts=async(req,res)=>{
    let posts
    try{
        posts=await Post.find()
    }catch(err){
        return console.log(err)
    }
    if(!posts){
        return res.status(500).json({message:"Unexpected error occured"})
    }
    return res.status(200).json({posts})
}

export const addPost=async(req,res)=>{
    const {title,description,location,date,image,user}=req.body
    if(!title && title.trim()==="" && !description && description.trim()==="" && !location && location.trim()==="" && !date && !user && !image && image.trim()===""){
        return res.status(422).json({message:"Invalid data"})
    }
    let existingUser
    try{
        existingUser=await User.findById(user)
    }catch(err){
        return console.log(err)
    }
    if(!existingUser){
        return res.status(404).json({message:"User not found"})
    }
    let post
    try{
        post=new Post({title,description,location,date:new Date(`${date}`),image,user})
        const session=await mongoose.startSession()

        session.startTransaction()
        existingUser.posts.push(post)
        await existingUser.save({session})
        post=await post.save({session});
        session.commitTransaction()
    }catch(err){
        return console.log(err)
    }
    if(!post){
        return res.status(500).json({message:"Unexpected Error Occured"})
    }
    return res.status(201).json({post})
}

export const getPostById=async(req,res)=>{
    const userId=req.params.id
    let post
    try{
        post=await Post.findById(userId)
    }catch(err){
        return console.log(err)
    }
    if(!post){
        return res.status(422).json({message:"Post not found"})
    }
    return res.status(201).json({post})
}

export const updatePost=async(req,res)=>{
    const userId=req.params.id
    const {title,description,location,date,image}=req.body
    if(!title && title.trim()==="" && !description && description.trim()==="" && !location && location.trim()==="" && !date && !image && image.trim()===""){
        return res.status(422).json({message:"Invalid data"})
    }
    let post
    try{
        post=await Post.findByIdAndUpdate(userId,{
            title,description,image,date:new Date(`${date}`),location
        })
        
    }catch(err){
        return console.log(err)
    }
    if(!post){
        return res.status(500).json({message:"Unable to update"})
    }

    return res.status(200).json({message:'Updated Succesfully'})
}

export const deletePost=async(req,res)=>{
    const postId=req.params.id
    let post
    try{
        const session=await mongoose.startSession()
        session.startTransaction()
        post=await Post.findById(postId).populate('user')
        post.user.posts.pull(post)
        await post.user.save({session})
        post=await Post.findByIdAndRemove(postId)
        session.commitTransaction()
    }catch(err){
        return console.log(err)
    }
    if(!post){
        return res.status(400).json({message:"No post found"})
    }
    return res.status(200).json({message:"Post deleted"})
}