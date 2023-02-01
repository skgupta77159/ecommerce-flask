import "./user_dashboard.css"
import { useEffect } from "react"
import axios from "../../axios"
import { useState } from "react"
import CancelOrder from "./CancelOrder"
import ReviewProduct from "./ReviewProduct"
import { CircularProgress } from '@material-ui/core'

export default function UserOrders() {

    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const getOrders = async () => {
        try {
            setIsLoading(true)
            const config = {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("userAuthToken")}`
                },
            }
            const { data } = await axios.get("/api/user/product/getorders", config).catch((error) => {
                console.log("failed to load cart item")
            })
            if (data) {
                setOrders(data.data)
            }
            setIsLoading(false)
        } catch (e) {
            console.log("failed to load cart item")
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getOrders()
    }, [])

    function OrderCard(props) {
        return (
            <div className="cartitem">
                <div className="cartitemWrapper">
                    <div className="uchleft">
                        <img className="cartHeaderImg" src={props.value.product_image} alt="product image" />
                        <div className="headerText">
                            <h4>{props.value.product_name}</h4>
                            <span className="delAddr">Ordered on {props.value.createdAt}</span>
                            <span className="delAddr">Deliver to {props.value.delivery_address}</span>
                            <span className="delAddr">( {props.value.payment_mode} )</span>

                        </div>
                    </div>
                    <div className="usecDiv">
                        <div className="uchmid">
                            <div className="uquanHandler">
                                <div>
                                    <span>Status</span>
                                    <p className={`${props.value.status === "Delivered" ? "markGreen" : null}`}>{props.value.status === "Delivered" ? "Order Delivered ✔️" : props.value.status}</p>
                                </div>
                                {
                                    props.value.status == "Delivered" ?
                                        <ReviewProduct signal={true} order_id={props.value._id} product_name={props.value.product_name} review={props.value.review} />
                                        :
                                        <CancelOrder signal={true} order_id={props.value._id} getOrders={getOrders} />
                                }
                            </div>
                        </div>
                        <div className="uchright">
                            <div className="chrightAttr">
                                <span>Price :</span>
                                <span>Quantity :</span>
                                <hr />
                                <span>Total :</span>
                            </div>
                            <div className="chrightValue">
                                <span>${props.value.product_price}/-</span>
                                <span>{props.value.quantity}</span>
                                <hr />
                                <span>${props.value.total_price}/-</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {
                orders ? <>
                    <div className="userDashRightTop">
                        <h2>My Orders</h2>
                    </div>
                    {
                        isLoading ? <CircularProgress/> :
                        orders.length > 0 ?
                            <>
                                <div className="userCartDiv">
                                    {
                                        orders.map((item, key) => {
                                            return (
                                                <OrderCard key={key} value={item} />
                                            )
                                        })
                                    }
                                </div>
                                <div className="footer">
                                    {/* <hr></hr>
                                    <b>
                                        <span className="gt">Grand Total : </span>
                                        <span>${}/-</span>
                                    </b> */}
                                    {/* <Orderconfirm signal={true} value={cartItem} getProduct={getProduct} /> */}
                                </div>
                            </> : <h2>Oops! No order found</h2>
                    }
                </> : null
            }
        </>
    )
}