import { useState } from "react";
import ClockIcon from "../../../static/svg/ClockIcon"
import { set_order_status } from "../../../service/adminApi";
import "../dashboardstyle.css"

export default function OrdersCard(props) {

    const [isLoading, setIsLoading] = useState(false)

    const setOrderStatus = async (status)=> {
        const res = await set_order_status({"status": status, "order_id": props.value._id});
        if(res){
            props.getAdminOrders()
            alert("Order status updated successfully")
        }
        setIsLoading(false)
    }
    const handleChange = (e) => {
        setIsLoading(true)
        e.preventDefault();
        setOrderStatus(e.target.value);
    };
    
    return (
        <div className="orderWrapper">
            <div className="orderCardLeft">
                <h3 className='productName'>{props.value.product_name}</h3>
                <p className='productCateg'>Product Id: {props.value.product_id}</p>
                <p className='productCateg'>Price: ${props.value.product_price}/-</p>
                <p className='productCateg'>Quantity: {props.value.quantity}</p>
                <hr />
                <p className='productCateg'>Total Price: ${props.value.total_price}</p>
            </div>
            <div className="customerDetail">
                <h3 className='productName'>{props.value.user_name}</h3>
                <p className='productCateg'>Delivery Address: {props.value.delivery_address}</p>
                <p className='productCateg'>Payment Mode: {props.value.payment_mode}</p>
                <p className='productCateg'><ClockIcon/> Ordered on: {props.value.createdAt.slice(0, props.value.createdAt.length-13)}</p>

                <div className="orderStatus">
                    <select disabled={isLoading} name="orderStatus" id="orderStatus" value={props.value.status} onChange={handleChange}>
                        <option value="Processing">Processing</option>
                        <option value="Shipping">Shipping</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div>
            </div>

            <div className="orderCardRight">
                <img src={props.value.product_image} alt="product image" />
            </div>
        </div>
    )
}