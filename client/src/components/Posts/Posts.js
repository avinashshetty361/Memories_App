import React from 'react';
import { Grid, CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/';
import Post from './Post/Post';
import useStyles from './styles';

const Posts=({setCurrentId})=>{
  const {posts,isLoading}=useSelector((state)=> state.posts);
  const classes=useStyles();
  const history=useHistory();
  // if(!posts.length) return 'No posts'
  if(!posts.length && !isLoading) history.push('/')
    return( 
       isLoading ? <CircularProgress/>:(//if there is no posts then circle sign or lese :
        <Grid className={classes.mainContainer} container alignItems="stretch" spacing={4}>
            {
              posts.map((post)=>(
                <Grid key={post._id} item xs={12} sm={12} md={6} lg={4}>
                  <Post post={post} setCurrentId={setCurrentId}/>
                </Grid>
              ))
            }
        </Grid>
       )
      
    );
}
export default Posts;