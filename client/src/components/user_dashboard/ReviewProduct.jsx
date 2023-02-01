import React, { useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from '../../axios';
import './user_dashboard.css'
import { useEffect } from 'react';
import { updateProduct } from '../../service/adminApi';

export default function ReviewProduct(props) {

    const [open, setOpen] = React.useState(false);
    const [review, setReview] = useState(props.review)

    const handleChange = (e) => {
        e.preventDefault();
        setReview(e.target.value)
    }
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("userAuthToken")}`
                },
            }
            await axios.post("/api/user/product/writereview", {"order_id": props.order_id, "review": review} ,config).then((response)=>{
                handleClose();
                alert("Review Added Successfully")
            }).catch((error)=>{
                console.log("failed to add review, try again later")
            })
        } catch (e) {
            console.log("failed to load cart item")
        }
    }

    const handleClose = async () => {
        setOpen(false);
    };

    return (

        <div>
            {
                props.signal ?
                    <>
                        <button className="reviewBtn" onClick={handleClickOpen}>Write a Review</button>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">{props.product_name} ✍️</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="review"
                                    name="review"
                                    onChange={handleChange}
                                    value={review}
                                    label="Your Message"
                                    type="text"
                                    multiline
                                    maxRows={8}
                                    fullWidth />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} color="primary">
                                    Save
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                    : null
            }

        </div>
    );
}
