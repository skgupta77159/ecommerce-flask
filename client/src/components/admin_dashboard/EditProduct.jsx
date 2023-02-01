import React, { useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from '../../axios';
import './dashboardstyle.css'
import { useEffect } from 'react';
import { updateProduct } from '../../service/adminApi';

export default function EditProduct(props) {

    const [open, setOpen] = React.useState(false);
    const [detail, setDetail] = useState(props.value)

    useEffect(()=>{
        setDetail(props.value)
    },[props.value])

    const handleChange = (e) => {
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
        setDetail({ ...detail, [name]: value })
    }
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleSubmit = async () => {
        const res = await updateProduct(detail);
        if (res) {
            handleClose();
            alert("Product Edited Successfully")
            props.getProd()
        }
    }

    const handleClose = async () => {
        setOpen(false);
    };

    const handleSelectChange = (e) => {
        e.preventDefault();
        setDetail({ ...detail, product_category: e.target.value })
    }

    return (

        <div>
            {
                props.signal ?
                    <>
                        <button className="editProduct" onClick={handleClickOpen}>Edit</button>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Edit Product</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="product_name"
                                    name="product_name"
                                    onChange={handleChange}
                                    value={detail.product_name}
                                    label="Product name"
                                    type="text"
                                    fullWidth />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="product_price"
                                    name="product_price"
                                    onChange={handleChange}
                                    value={detail.product_price}
                                    label="Product price"
                                    type="text"
                                    fullWidth />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="product_description"
                                    name="product_description"
                                    onChange={handleChange}
                                    value={detail.product_description}
                                    label="About product"
                                    type="text"
                                    fullWidth
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="product_image"
                                    name="product_image"
                                    onChange={handleChange}
                                    value={detail.product_image}
                                    label="Product image Url"
                                    type="text"
                                    fullWidth
                                />
                                <select className='editSelect' name="category" id="productCategory" onChange={e => handleSelectChange(e)} value={detail.product_category}>
                                    <option value="homedecoration">Home & Decorations</option>
                                    <option value="electronic">Electronic & Accessories</option>
                                    <option value="other">Other</option>
                                </select>

                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} color="primary">
                                    Save Changes
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                    : null
            }

        </div>
    );
}
