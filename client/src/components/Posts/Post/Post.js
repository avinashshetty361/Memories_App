import React, { useState } from "react";
import useStyles from './styles';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import { useHistory } from "react-router-dom/";
import { deletePost, likePost } from "../../../actions/posts";

const Post = ({ post, setCurrentId }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem('profile'));
  const [likes, setLikes] = useState(post?.likes);

  const hasLikedPost = likes.find((like) => like === (user?.result?.sub || user?.result?._id));
  const userId = user?.result.sub || user?.result._id;

  const handleLike = async () => {
    dispatch(likePost(post._id));
    if (hasLikedPost) {
      setLikes(likes.filter((id) => id !== userId)); // already liked, so dislike
    } else {
      setLikes([...post.likes, userId]);
    }
  };

  const Likes = () => {
    if (likes.length > 0) {
      return likes.find((like) => like === userId) ? (
        <>
          <ThumbUpAltIcon fontSize="small" />
          &nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}`}
        </>
      ) : (
        <>
          <ThumbUpAltOutlined fontSize="small" />
          &nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
        </>
      );
    }

    return (
      <>
        <ThumbUpAltOutlined fontSize="small" />
        &nbsp;Like
      </>
    );
  };

  const openPost = () => {
    history.push(`/posts/${post._id}`);
  };

  // Limit message length
  const messageLimit = 150;
  const displayMessage = post.message.length > messageLimit ? `${post.message.substring(0, messageLimit)}... ` : post.message;

  return (
    <Card className={classes.card} raised elevation={8} style={{ height: '500px' }}> {/* Set a fixed height */}
      <div className={classes.cardAction} onClick={openPost}>
      <CardMedia
  className={classes.media}
  image={post.selectedFile || 'https://via.placeholder.com/150'}
  title={post.title}
/>

        <div className={classes.overlay}>
          <Typography variant="h6">{post.name}</Typography>
          <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
        </div>
        {(user?.result?.sub === post?.creator || user?.result?._id === post?.creator) && (
          <div className={classes.overlay2}>
            <Button style={{ color: "white" }} size="small" onClick={(e) => { e.stopPropagation(); setCurrentId(post._id); }}>
              <MoreHorizIcon fontSize="medium" />
            </Button>
          </div>
        )}
        <div className={classes.details}>
          <Typography variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
        </div>
        <Typography className={classes.title} variant="h5" gutterBottom>{post.title}</Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p" gutterBottom>
            {displayMessage}
            {post.message.length > messageLimit && (
              <Button size="small" color="primary" onClick={openPost}>Read more</Button>
            )}
          </Typography>
        </CardContent>
      </div>
      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
          <Likes />
        </Button>
        {(user?.result?.sub === post?.creator || user?.result?._id === post?.creator) && (
          <Button color="secondary" size="small" onClick={() => dispatch(deletePost(post._id))}>
            <DeleteIcon fontSize="small" /> Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;