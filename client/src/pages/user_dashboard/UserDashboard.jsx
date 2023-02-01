import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import OrderIcon from '../../static/svg/OrderIcon';
import UserIcon from '../../static/svg/UserIcon';
import PlusIcon from '../../static/svg/PlusIcon';
import { logout_user } from '../../service/userApi';
import './userdashboard.css'
import BasketIcon from '../../static/svg/BasketIcon';
import LogoutIcon from '../../static/svg/LogoutIcon';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import UserProfile from '../../components/user_dashboard/UserProfile';
import UserCart from '../../components/user_dashboard/UserCart';
import UserOrders from '../../components/user_dashboard/UserOrders';

export default function UserDashboard(props) {

    const { tabs } = useParams();
    const {dispatch} = useContext(AppContext)
    const [activeItem, setActiveItem] = useState(tabs)
    const navigate = useNavigate();

    useEffect(() => {
        const subpage = ["profile", "cart", "orders"];
        if (subpage.includes(tabs)) {
            setActiveItem(tabs)
        }else{
            setActiveItem("profile")
            navigate(`/user/dashboard/profile`)
        }
    }, [tabs])

    const handleItemChange = (e) => {
        e.preventDefault();
        setActiveItem(e.target.id)
        navigate(`/user/dashboard/${e.target.id}`)
    }

    const userLogoutHandler = async () => {
        const res = await logout_user()
        if (res) {
            localStorage.removeItem("userAuthToken")
            dispatch({ type: "EMPTY_STATE" });
            navigate("/")
        }
    }

    const switchComponent = () => {
        switch (tabs) {
            case 'profile':
                return <UserProfile/>
            case 'cart':
                return <UserCart/>
            case 'orders':
                return <UserOrders/>
            default:
                return (
                    <div className="notFoundDiv">
                        <h2>Sorry, Page Not Found!</h2>
                    </div>
                )
        }
    }

    return (
        <div className='adminDashboard'>
            <div className="adminDashboardWrapper">
                <div className="adDashLeft">
                    <ul>
                        <li id="profile" className={activeItem == "profile" ? "activeList" : null} onClick={handleItemChange}><UserIcon /> Profile</li>
                        <li id="cart" className={activeItem == "cart" ? "activeList" : null} onClick={handleItemChange}><BasketIcon/> Cart</li>
                        <li id="orders" className={activeItem == "orders" ? "activeList" : null} onClick={handleItemChange}><OrderIcon /> Orders</li>
                        <li id="logout" onClick={userLogoutHandler}><LogoutIcon/> Logout</li>
                    </ul>
                </div>
                <div className="adDashRight">
                    {
                        switchComponent()
                    }
                </div>
            </div>
        </div>
    )
}