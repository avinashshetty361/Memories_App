import React, { useEffect } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Divider,
  Button,
} from "@material-ui/core/";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useParams, useHistory } from "react-router-dom";
import CommentSection from "./CommentSection";
import { getPost, getPostBySearch } from "../../actions/posts";
import useStyles from "./styles";

const Post = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const { id } = useParams();

  // Fetch the current post details
  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);

  // Fetch recommended posts based on tags
  useEffect(() => {
    if (post?.tags?.length) {
      console.log("Fetching recommendations for tags:", post.tags);
      dispatch(getPostBySearch({ search: "none", tags: post.tags.join(",") }));
    }
  }, [post]);

  const sharePost = () => {
    if (post) {
      const shareData = {
        title: post.title,
        text: post.message,
        url: window.location.href, // Current post URL
      };

      navigator
        .share(shareData)
        .then(() => console.log("Post shared successfully!"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert("No post to share.");
    }
  };

  // Redirect to another post's detail page
  const openPost = (_id) => history.push(`/posts/${_id}`);

  // Show a loading spinner while fetching data
  if (isLoading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  if (!post) return null;

  // Filter out the current post from recommendations
  const recommendedPosts = posts?.filter(({ _id }) => _id !== post._id) || [];

  return (
    <Paper
      style={{
        padding: "20px",
        borderRadius: "15px",
        backgroundColor: "#f5f5f5",
      }}
      elevation={6}
    >
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography
            variant="h3"
            component="h2"
            style={{ fontWeight: "bold", color: "#333" }}
          >
            {post.title}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            color="textSecondary"
            component="h2"
          >
            {post.tags.map((tag) => `#${tag} `)}
          </Typography>
          <Typography
            gutterBottom
            variant="body1"
            component="p"
            style={{ lineHeight: 1.6 }}
          >
            {post.message}
          </Typography>
          <Typography variant="h6" style={{ marginTop: "10px" }}>
            Created by: {post.name}
          </Typography>
          <Typography variant="body1" style={{ color: "#777" }}>
            {moment(post.createdAt).fromNow()}
          </Typography>
          <Divider style={{ margin: "20px 0" }} />
          <Typography variant="body1" style={{ fontStyle: "italic" }}>
            <strong>Realtime Chat - coming soon!</strong>
          </Typography>
          <Divider style={{ margin: "20px 0" }} />
          <CommentSection post={post} />
          <Divider style={{ margin: "20px 0" }} />
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
            onClick={sharePost}
          >
            Share This Post
          </Button>
        </div>
        <div className={classes.imageSection}>
          <img
            className={classes.media}
            src={post.selectedFile || ""}
            alt={post.title}
          />
        </div>
      </div>
      {!!recommendedPosts.length ? (
        <div className={classes.section}>
          <Typography gutterBottom variant="h5">
            You might also like:
          </Typography>
          <Divider />
          <div className={classes.recommendedPosts}>
            {recommendedPosts.map(
              ({ title, name, message, likes, selectedFile, _id }) => (
                <div
                  className={classes.recommendedPost}
                  onClick={() => openPost(_id)}
                  key={_id}
                  style={{ transition: "transform 0.2s", cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <Typography gutterBottom variant="h6">
                    {title}
                  </Typography>
                  <Typography gutterBottom variant="subtitle2">
                    {name}
                  </Typography>
                  <Typography gutterBottom variant="subtitle2">
                    {message.length > 100
                      ? `${message.substring(0, 100)}...`
                      : message}
                  </Typography>
                  <Typography gutterBottom variant="subtitle1">
                    Likes: {likes.length}
                  </Typography>
                  <img
                    src={selectedFile}
                    alt={title}
                    className={classes.image}
                  />
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        <Typography
          variant="body2"
          style={{ color: "#777", textAlign: "center" }}
        >
          No recommendations available.
        </Typography>
      )}
    </Paper>
  );
};

export default Post;
