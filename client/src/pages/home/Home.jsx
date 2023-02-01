import React, { useState, useEffect } from 'react'
import ProductCard from '../../components/admin_dashboard/product_card/ProductCard';
import Homemap from '../../components/maps/Homemap'
import useGeoLocation from "../../components/maps/useGeoLocation";
import { CircularProgress } from '@material-ui/core'
import axios from 'axios';
import './home.css'
import { useContext } from 'react';
import { SearchContext } from '../../context/SearchContext';

export default function Home() {

    const location = useGeoLocation();
    const { setLocMark, setLocValue, products, isProductLoading } = useContext(SearchContext);
    const [userAddress, setUserAddress] = useState([]);
    const [locallowed, setLocallowed] = useState(true);
    const [selected, setSelected] = useState("N/A");
    const [stores, setStores] = useState([]);

    useEffect(() => {
        document.title = "MyStore Welcome you!"
    }, []);

    useEffect(() => {
        const getUserLocation = async () => {
            let list = [];
            if (!location.error) {
                setLocallowed(true)
                const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location.coordinates.lng},${location.coordinates.lat}.json?access_token=${process.env.REACT_APP_MAPBOX}`);
                const address = res.data.features;
                for (let j = 1; j < address.length; j++) {
                    let pair = { id: address[j].place_type[0], name: address[j].text };
                    list.push(pair)
                }
                setUserAddress(list)
            } else {
                setLocallowed(false)
            }
        }
        getUserLocation();
    }, [location.coordinates])

    const handleChange = (e) => {
        e.preventDefault();
        setSelected(e.target.value)
        setLocMark(e.target.value)
        for (let i = 0; i < userAddress.length; i++) {
            if (userAddress[i].id === (e.target.value)) {
                setLocValue(userAddress[i].name)
            }
        }
    }

    return (
        <div className='homeDiv'>
            {
                locallowed ? null :
                    <div className="locError">
                        <span className="locErrorSpan">Please allow the location permission and refresh the page again.</span>
                    </div>
            }
            <div className="homeDivWrapper">
                {
                    isProductLoading ?
                        <div className="homeLeftLoading">
                            <CircularProgress />
                        </div>
                        :
                        <>
                            {
                                products.length == 0 ? 
                                <div className="notFoundDiv">
                                    <img src="https://hdn-1.fynd.com/company/884/applications/000000000000000000000001/theme/pictures/free/original/empty-state.dad8145f254f744108af946933831880.png" />
                                    <h2>No items found near the selected region</h2>
                                </div>
                                    :
                                    <div className="homeLeft">
                                        {
                                            products.length != 0 && products.map((item) => {
                                                return <ProductCard value={item} public={true} />
                                            })
                                        }
                                    </div>
                            }
                        </>


                }
                <div className="homeRight">
                    <div className="homeAction">
                        <p>Filter by location</p>
                        <select id="dropdown" onChange={handleChange}>
                            <option value="N/A">Search Nearby Location</option>
                            {
                                userAddress.map((data) => {
                                    return (
                                        <option key={data.id} value={data.id} name={data.name}>{data.name}</option>
                                    )
                                })
                            }
                        </select>
                        {/* <select name="Location" id="location" value="Location">
                            <option>India</option>
                            <option>Maharashtra</option>
                            <option>Mumbai</option>
                        </select> */}
                        {/* <select name="Category" id="productCategory" value="Category">
                            <option>Category</option>
                            <option>Home & Decorations</option>
                            <option>Electronics</option>
                        </select> */}
                    </div>
                    <div className="homeMapDiv">
                        <Homemap />
                    </div>

                </div>
            </div>
        </div>
    )
}