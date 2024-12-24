import axios from 'axios';

// Create an Axios instance with a base URL
const API = axios.create({ baseURL: 'http://localhost:5000' });

// Interceptor to add Authorization header to each request if a token exists in localStorage
API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }
  return req;
});

// API endpoints
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPostsBySearch=(searchQuery)=>API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`)
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const comment = (value,id) => API.post(`/posts/${id}/commentPost`,{value});//here 2 nd param should be object
export const deleteComment = (postId, comment) => API.delete(`/posts/${postId}/comment`, { data: { comment } });

// User authentication endpoints
export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);