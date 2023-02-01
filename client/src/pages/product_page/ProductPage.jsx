import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../axios"
import { AppContext } from "../../context/AppContext";
import ClockIcon from "../../static/svg/ClockIcon";
import HappyIcon from "../../static/svg/HappyIcon";
import SadIcon from "../../static/svg/SadIcon";
import { add_to_cart } from "../../service/userApi";
import { CircularProgress } from '@material-ui/core'
import "./product_page.css"

export default function ProductPage(props) {

    const { product_id } = useParams();
    const { setContext, userAuth, user } = useContext(AppContext)
    const [product, setProduct] = useState({})
    const [review, setReview] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [reviewLoading, setReviewLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getProduct = async () => {
            try {
                setPageLoading(true)
                const config = {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
                return await axios.post('/api/public/product/getone', { "product_id": product_id }, config).then(response => {
                    setProduct(response.data.data)
                    document.title = response.data.data.product_name
                    setPageLoading(false)
                }).catch((error) => {
                    console.log("Error while fetching product")
                    setPageLoading(false)
                })
            } catch (err) {
                console.log("Error while fetching product")
                setPageLoading(false)
            }
        }
        const getReviews = async () => {
            try {
                setReviewLoading(true)
                const config = {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
                return await axios.post('/api/public/product/getproductreviews', { "product_id": product_id }, config).then(response => {
                    setReview(response.data.data)
                    setReviewLoading(false)
                }).catch((error) => {
                    console.log("Error while fetching reviews")
                    setReviewLoading(false)
                })
            } catch (err) {
                console.log("Error while fetching reviews")
                setReviewLoading(false)
            }
        }
        getProduct();
        getReviews();
    }, [product_id]);

    const handleAddCart = async (e) => {
        e.preventDefault();
        if (!userAuth) {
            navigate("/user/sign-in")
            return
        }
        setIsLoading(true);
        const res = await add_to_cart(product_id);
        if (res) {
            setContext();
            setIsLoading(false);
            alert("Item Added to Cart");
        } else {
            setIsLoading(false);
            alert("Failed to Add Item, try again later");
        }
    }

    const handleBuyNow = async (e) => {
        e.preventDefault();
        if (!userAuth) {
            navigate("/user/sign-in")
            return
        }
        setIsLoading(true);
        const res = await add_to_cart(product_id);
        if (res) {
            setContext();
            setIsLoading(false);
        } else {
            setIsLoading(false);
            navigate("/user/dashboard/cart")
        }
    }

    const ReviewCard = (props) => {
        return (
            <div className="reviewCard">
                <div className="rcWrapper">
                    <div className="rcLeft">
                        <h3>{props.value.user_name}</h3>
                        <p>{props.value.review}</p>
                        <div className="rcDate"><ClockIcon /> <span>{props.value.updatedAt.slice(0, props.value.updatedAt.length - 13)}</span></div>
                    </div>
                    <div className="rcRight">
                        {
                            props.value.sentiment === 1 ?
                                <HappyIcon />
                                : <SadIcon />
                        }
                    </div>
                </div>
                <hr />
            </div>
        )
    }

    return (
        <div className="productPage">
            <div className="productPageWrapper">
                <div className="productDetail">
                    {pageLoading ? <CircularProgress /> :
                        <>
                            <div className="productDleft">
                                <img src={product.product_image} alt="product image" />
                            </div>
                            <div className="productDright">
                                <h2>{product.product_name}</h2>
                                <span>{product.product_category}</span>
                                <h3>Price : ${product.product_price}/-</h3>
                                <p>{product.product_description}</p>
                                <div className="prodActionDiv">
                                    <button className="addBagBtn" onClick={handleAddCart} disabled={isLoading || (user && user.cart_products.includes(product_id))}>{(user && user.cart_products.includes(product_id)) ? "Added" : (isLoading ? "Adding..." : "Add to Bag")}</button>
                                    <button className="buyBtn" onClick={handleBuyNow}>Buy Now</button>
                                </div>
                            </div>
                        </>
                    }
                </div>

                {review &&
                    <div className="productReview">
                        <h3>{review.length} Reviews</h3>
                        <hr />
                        {
                            reviewLoading ?
                                <div className="reviewLoadingDiv">
                                    <CircularProgress />
                                </div>
                                :
                                review.map((item, key) => {
                                    return <ReviewCard key={key} value={item} />
                                })
                        }
                    </div>}
            </div>
        </div>
    )
}