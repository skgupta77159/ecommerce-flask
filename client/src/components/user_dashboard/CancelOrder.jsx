import React, { useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import './user_dashboard.css'
import { cancel_order } from '../../service/userApi';
import { AppContext } from '../../context/AppContext';

export default function CancelOrder(props) {

    const [open, setOpen] = React.useState(false);
    const {setContext} = useContext(AppContext)
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleSubmit = async () => {
        const res = await cancel_order(props.order_id)
        if (res) {
            handleClose();
            alert("Order Cancelled Successfully")
            props.getOrders()
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
                        <button className="removeProduct" onClick={handleClickOpen}>Cancel order</button>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Are you sure to cancel this order ☹️</DialogTitle>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    No
                                </Button>
                                <Button onClick={handleSubmit} color="primary">
                                    Yes
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                    : null
            }

        </div>
    );
}
