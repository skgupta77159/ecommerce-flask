import React from 'react'
import { useState } from 'react'
import OrderIcon from '../../static/svg/OrderIcon';
import UserIcon from '../../static/svg/UserIcon';
import PlusIcon from '../../static/svg/PlusIcon';
import { useParams, useNavigate } from "react-router-dom";
import './dashboard.css'
import { useEffect } from 'react';
import AddProducts from '../../components/admin_dashboard/AddProducts';
import AdminProfile from '../../components/admin_dashboard/AdminProfile';
import AdminOrders from '../../components/admin_dashboard/AdminOrders';

export default function AdminDashboard(props) {

    const { tabs } = useParams();
    const [activeItem, setActiveItem] = useState(tabs);
    const navigate = useNavigate();

    useEffect(() => {
        const subpage = ["profile", "addProduct", "orders"];
        if (subpage.includes(tabs)) {
            setActiveItem(tabs)
        }else{
            setActiveItem("profile")
            navigate(`/admin/dashboard/profile`)
        }
    }, [tabs])

    const handleItemChange = (e) => {
        e.preventDefault();
        setActiveItem(e.target.id)
        navigate(`/admin/dashboard/${e.target.id}`)
    }

    const switchComponent = () => {
        switch (tabs) {
            case 'profile':
                return <AdminProfile/>
            case 'addProduct':
                return <AddProducts/>
            case 'orders':
                return <AdminOrders/>
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
                        <li id="profile" className={activeItem == "profile" ? "activeList" : null} onClick={(e) => handleItemChange(e)}><UserIcon /> Profile</li>
                        <li id="addProduct" className={activeItem == "addProduct" ? "activeList" : null} onClick={(e) => handleItemChange(e)}><PlusIcon /> Add Products</li>
                        <li id="orders" className={activeItem == "orders" ? "activeList" : null} onClick={(e) => handleItemChange(e)}><OrderIcon /> Orders</li>
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