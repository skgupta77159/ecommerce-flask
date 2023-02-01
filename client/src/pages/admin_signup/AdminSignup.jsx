import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../../axios"
import './signup.css'
import CreateStoreMap from '../../components/maps/CreateStoreMap';
import { AddContext } from '../../context/AddContext';
import { AppContext } from '../../context/AppContext';

export default function AdminSignup() {

    const { latitude, longitude } = useContext(AddContext);
    const { setContext } = useContext(AppContext)
    const [errors, setErrors] = useState("");
    const [user, setUser] = useState({ name: "", email: "", store_name: "", store_description: "", store_address: "", password: "", cpassword: "" })
    const [isLoading, setIsLoading] = useState(false);
    const [addressList, setAddressList] = useState({});

    const navigate = useNavigate();
    const gotoSignin = (e) => {
        e.preventDefault();
        navigate('/admin/sign-in')
    }

    useEffect(() => {
        getUserLocation(longitude, latitude);
    }, [latitude, longitude])

    const getUserLocation = async (long, lati) => {
        let list = {};
        let placeName = "";
        if (latitude != null && longitude != null) {
            const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lati}.json?access_token=${process.env.REACT_APP_MAPBOX}`);
            const address = res.data.features;
            for (let j = 1; j < address.length; j++) {
                list[address[j].place_type[0]] = address[j].text
                // let pair = { [address[j].place_type[0]]: address[j].text };
                // list.push(pair)
                j === address.length - 1 ? placeName = placeName.concat(`${address[j].text}`) : placeName = placeName.concat(`${address[j].text}, `)
            }
            setUser({ ...user, store_address: placeName });
            setAddressList(list);
        }
    }

    const handleChange = (e) => {
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
        setUser({ ...user, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        setErrors(false);
        const config = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            }
        }
        if (addressList.length == 0) {
            setErrors("Please fill all the fields")
        } else {
            try {
                const { data } = await axios.post("/api/admin/auth/sign-up", { ...user, address_list: addressList, latitude: latitude, longitude: longitude }, config).catch(err => {
                    if (err.response.status === 401) {
                        setErrors(err.response.data.error)
                        throw new Error(err.response.data.error);
                    } else {
                        setErrors("Internal Server Error")
                        throw new Error(`Internal Server Error`);
                    }
                });
                localStorage.setItem("adminAuthToken", data.adminAuthToken);
                localStorage.removeItem("userAuthToken");
                setContext()
                setIsLoading(false);
                navigate('/admin/dashboard/profile')
            } catch (err) {
                setIsLoading(false)
            }
        }
    }

    return (
        <div className='signupPage'>
            <form onSubmit={handleSubmit}>
                <div className="signupWrapper">
                    <div className="signupLeft">
                        <h3>Admin Sign Up</h3>
                        {errors ?
                            <div className="errorDiv">
                                <span className="errorMessage">{errors}</span>
                            </div> : null}
                        <input type="text" placeholder='Name' required name="name" value={user.name} onChange={handleChange} />
                        <input type="email" placeholder='Email' required name="email" value={user.email} onChange={handleChange} />
                        <input type="password" placeholder='Password' required name="password" value={user.password} onChange={handleChange} />
                        <input type="password" placeholder='Confirm Password' required name="cpassword" value={user.cpassword} onChange={handleChange} />
                        <h3>Create Store</h3>
                        <input type="text" placeholder='Store Name' required name="store_name" value={user.store_name} onChange={handleChange} />
                        <input type="text" placeholder='Store Description' required name="store_description" value={user.store_description} onChange={handleChange} />
                        <input type="text" placeholder='Add store address from the map' required name="store_address" value={user.store_address} onChange={handleChange} disabled='true' />
                        <button type="submit" className='signupButton' disabled={isLoading}>{isLoading ? "Loading...": "Register"}</button>
                        <button className='gotosignInButton' onClick={gotoSignin}>Sign In</button>
                    </div>
                    <div className="signupRight">
                        <CreateStoreMap />
                    </div>
                </div>
            </form>
        </div>
    )
}