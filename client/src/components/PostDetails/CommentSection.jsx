import React, { useState, useRef } from "react";
import { Typography, TextField, Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import useStyles from "./styles";
import { commentPost, deleteComment } from '../../actions/posts';

const CommentSection = ({ post }) => {
    const classes = useStyles();
    const [comments, setComments] = useState(post?.comments || []);
    const [comment, setComment] = useState("");
    const dispatch = useDispatch();
    const commentsRef = useRef();
    const user = JSON.parse(localStorage.getItem('profile'));

    const handleClick = async () => {
        const finalComment = `${user.result.name}:${comment}`;
        
        // Optimistically update the comments state
        const updatedComments = [...comments, finalComment];
        setComments(updatedComments);

        setComment('');
        commentsRef.current.scrollIntoView({ behavior: 'smooth' });

        try {
            // Dispatch the action to add the comment
            await dispatch(commentPost(finalComment, post._id));
        } catch (error) {
            // If there's an error, revert the state update
            setComments(comments);
        }
    };

    const handleDelete = async (commentToDelete) => {
        // Optimistically update the comments state
        const updatedComments = comments.filter(c => c !== commentToDelete);
        setComments(updatedComments);

        try {
            // Dispatch the action to delete the comment
            await dispatch(deleteComment(post._id, commentToDelete));
        } catch (error) {
            // If there's an error, revert the state update
            setComments(comments);
        }
    };

    return (
        <div >
            <div className={classes.commentOuterContainer}>
                <div className={classes.commentInnerContainer}>
                    <Typography gutterBottom variant="h6">Comments</Typography>
                    {comments?.map((c, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography gutterBottom variant="subtitle1">
                                <strong>{c.split(':')[0]}:</strong>
                                <div style={{ paddingLeft: "20px" }}>{c.split(':')[1]}</div>
                            </Typography>
                            {user?.result?.name === c.split(':')[0] && (
                                <Button size="small" color="secondary" onClick={() => handleDelete(c)}>
                                    Delete
                                </Button>
                            )}
                        </div>
                    ))}
                    <div ref={commentsRef} />
                </div>
                {user?.result?.name && (
                    <div style={{ width: '70%' }}>
                        <Typography gutterBottom variant="h6">Write a Comment</Typography>
                        <TextField
                            fullWidth
                            minRows={4}
                            variant="outlined"
                            label="Comment"
                            multiline
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button style={{ marginTop: '10px' }} fullWidth disabled={!comment} variant="contained" onClick={handleClick} color="primary">
                            Comment
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;