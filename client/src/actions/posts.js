import * as api from '../api/index.js'
import {FETCH_POST,FETCH_ALL,CREATE,UPDATE,DELETE,LIKE,FETCH_BY_SEARCH,START_LOADING,END_LOADING,COMMENT,DELETE_COMMENT} from '../../src/constants/actionTypes.js'
//action-creators 



export const getPost = (id) => async (dispatch) => {
  try {
    dispatch({type:START_LOADING});
    const { data } = await api.fetchPost(id);
    dispatch({ type: FETCH_POST, payload: { post:data} });
    dispatch({type:END_LOADING})
  } catch (error) {
    console.log(error);
  }
};


export const getPosts = (page) => async (dispatch) => {
  try {
    dispatch({type:START_LOADING});
    const { data: { data, currentPage, numberOfPages }  } = await api.fetchPosts(page);
    console.log(data);
    dispatch({ type: FETCH_ALL, payload: { data, currentPage, numberOfPages} });
    dispatch({type:END_LOADING})
  } catch (error) {
    console.log(error);
  }
};

export const getPostBySearch=(searchQuery)=>async(dispatch)=>{
  try {
    dispatch({type:START_LOADING});
    const {data:{data}}=await api.fetchPostsBySearch(searchQuery);
    dispatch({ type: FETCH_BY_SEARCH, payload: data });
    dispatch({type:END_LOADING})
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

export const createPost = (post,history) => async (dispatch) => {
  try {
    dispatch({type:START_LOADING});

    const { data } = await api.createPost(post);
     history.push(`/posts/${data._id}`);
    dispatch({ type: CREATE, payload: data });
    dispatch({type:END_LOADING});

  } catch (error) {
    console.log(error);
  }
};

export const updatePost=(id,post)=>async(dispatch)=>{
  try{
   const {data} =await api.updatePost(id,post);
   dispatch({type:UPDATE,payload:data})
  }catch(error){
    console.log(error)
  }
}

export const deletePost=(id)=>async(dispatch)=>{
  try{
    await api.deletePost(id);
    dispatch({type:DELETE,payload:id})
  }catch(error){
    console.log(error);
  }
}

export const likePost=(id)=>async(dispatch)=>{
  try{
    const {data} =await api.likePost(id);
    dispatch({type:LIKE,payload:data})
  }catch(error){
    console.log(error)
  }
}
 

export const commentPost =(value,id)=>async(dispatch)=>{
  try {
    const{data}= await api.comment(value,id);
    dispatch({type:COMMENT,payload:data});
    return data.comments;
  } catch (error) {
    console.log(error);
  }
}
export const deleteComment = (postId, commentToDelete) => async (dispatch) => {
  try {
      const { data } = await api.deleteComment(postId, commentToDelete); // Implement this API call
      dispatch({ type: DELETE_COMMENT, payload: data });
      return data.comments; // Return updated comments
  } catch (error) {
      console.log(error);
  }
};