import React, { useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import './user_dashboard.css'
import { remove_from_cart } from '../../service/userApi';
import { AppContext } from '../../context/AppContext';

export default function RemoveCart(props) {

    const [open, setOpen] = React.useState(false);
    const {setContext} = useContext(AppContext)
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleSubmit = async () => {
        const res = await remove_from_cart(props.product_id)
        if (res) {
            handleClose();
            alert("Product Removed Successfully")
            props.getProduct()
            setContext()
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
                        <button className="removeProduct" onClick={handleClickOpen}>Remove</button>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Confirm Remove Product</DialogTitle>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} color="primary">
                                    Remove
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                    : null
            }

        </div>
    );
}
