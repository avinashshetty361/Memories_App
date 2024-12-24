import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js"

export const getPosts = async (req, res) => {
  const {page}=req.query;

  try {
    const LIMIT=6;
    //get startIndex of enery page
    const startIndex=(Number(page)-1)*LIMIT;//since page we are sending from frontend is number since it accept from req.query it is now  a string so convert to Number
    const total=await PostMessage.countDocuments({});
    const posts = await PostMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex); //get newest post first

    res.status(200).json({data:posts,currentPage:Number(page),numberOfPages:Math.ceil(total/LIMIT)});
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getPost = async (req, res) => { 
  const { id } = req.params;

  try {
      const post = await PostMessage.findById(id);
      
      res.status(200).json(post);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
}


//QUERY -> /posts/page=1 --> here page=1
//PARAMS -> /posts/:id -->here id=any id given in url

export const getPostsBySearch=async(req,res)=>{
  const {searchQuery,tags}=req.query;
  try {
    const title=new RegExp(searchQuery,'i')//i means ignoore  that means idnore like Test,test, TEST all are same 
    const posts=await PostMessage.find({$or:[{title},{tags:{$in:tags.split(',')}}]})//$or means either title or tags matches  $in inside tag string whether tags is  there present
    res.json({data:posts});
  } catch (error) {
    res.status(404).json({message:error.message});
  }
}


export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new PostMessage({...post,creator:req.userId,createdAt:new Date().toISOString()});

  try {
    await newPost.save();
    res.status(201).json(newPost);

  } catch (error) {
    res.status(409).json({ message: error.message });
    console.log(error)
  }
};

//post/123;
export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) res.status(404).send('No post with this id');
  const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });
  res.json(updatedPost)

}

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) res.status(404).send('No post with this id');
  await PostMessage.findByIdAndDelete(_id);
  res.json({ message: 'Deleted sucessfully' }).status(200);

}

export const likePost = async(req, res) => {
  const { id } = req.params;

  if(!req.userId) return res.json({message:"Unauthenticated"});
  if (!mongoose.Types.ObjectId.isValid(id)) res.status(404).send('No post with this id');
  const post=await PostMessage.findById(id);
  const index=post.likes.findIndex((id)=>id===String(req.userId))
  if(index===-1){
    //like the post
    post.likes.push(req.userId);
  }else{
    //dislike a post
    post.likes=post.likes.filter((id)=>id!==String(req.userId));

  }
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
  res.json(updatedPost);
}

export const commentPost=async(req,res)=>{
  const {id}=req.params;
  const {value}=req.body;

  const post=await PostMessage.findById(id);
  post.comments.push(value);
  const updatedPost=await PostMessage.findByIdAndUpdate(id,post,{new:true});
  res.json(updatedPost);
}

export const deleteComment = async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;

  try {
      const post = await PostMessage.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      post.comments = post.comments.filter(c => c !== comment);
      const updatedPost = await PostMessage.findByIdAndUpdate(postId, post, { new: true });

      res.status(200).json(updatedPost);
  } catch (error) {
      res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};