import { useEffect } from "react"
import "./dashboardstyle.css"
import OrdersCard from "./product_card/OrdersCard"
import { get_admin_orders } from "../../service/adminApi"
import { useState } from "react"
import { CircularProgress } from '@material-ui/core'

export default function AdminOrders() {

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getAdminOrders = async () => {
        setIsLoading(true)
        const res = await get_admin_orders();
        if (res) {
            setOrders(res.data)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        getAdminOrders()
    }, [])

    return (
        <>
            <div className="adDashRightTop">
                <h2>Orders</h2>
            </div>
            {
                isLoading ? <CircularProgress /> :
                    <div className="adminOrdersDiv">
                        <h3 className="ordHeading">Pending Orders</h3>
                        {
                            orders && orders.map((item, key) => {
                                return (
                                    item.status != "Delivered" ? <OrdersCard key={key} value={item} getAdminOrders={getAdminOrders} /> : null
                                )
                            })
                        }
                        <h3 className="ordHeading">Delivered</h3>
                        {
                            orders && orders.map((item, key) => {
                                return (
                                    item.status === "Delivered" ? <OrdersCard key={key} value={item} getAdminOrders={getAdminOrders} /> : null
                                )
                            })
                        }
                    </div>
            }
        </>
    )
}