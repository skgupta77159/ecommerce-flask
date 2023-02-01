import { useContext } from "react"
import { AppContext } from "../../../context/AppContext"
import "../dashboardstyle.css"
import DeleteProduct from "../DeleteProduct"
import EditProduct from "../EditProduct"
import { add_to_cart } from "../../../service/userApi"
import { useNavigate } from "react-router-dom";
import { useState } from "react"
import { useEffect } from "react"

export default function ProductCard(props) {

    const { setContext, adminAuth, userAuth, user } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [inCart, setInCart] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.cart_products.includes(props.value._id)) {
            setInCart(true)
        } else {
            setInCart(false)
        }
    }, [user])

    const handleAddCart = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!userAuth) {
            navigate("/user/sign-in")
            return
        }
        setIsLoading(true);
        const res = await add_to_cart(props.value._id);
        if (res) {
            setContext();
            setIsLoading(false);
            alert("Item Added to Cart");
        } else {
            setIsLoading(false);
            alert("Failed to Add Item, try again later");
        }
    }

    const openProductPage = () => {
        if (props.public) {
            const win = window.open(`/product/${props.value._id}`, '_blank');
            if (win != null) {
                win.focus();
            }
        }
    }

    return (
        <div className={props.public ? "productWrapper fullWidth" : "productWrapper"} onClick={openProductPage}>
            <img src={props.value.product_image} alt="product image" />
            <h3 className='productName'>{props.value.product_name}</h3>
            <p className='productCateg'>{props.value.product_category}</p>
            {props.public ? null : <p className='productCateg'>{`(${props.value._id})`}</p>}
            <p className='productDesc'>{props.value.product_description}</p>
            <span className='productPrice'>{`Price: $${props.value.product_price}`}</span>
            {
                props.public ? null :
                    <div className="productAction">
                        <EditProduct signal={true} value={props.value} getProd={props.getProd} />
                        <DeleteProduct signal={true} product_id={props.value._id} getProd={props.getProd} />
                    </div>
            }
            {props.public ? <button className="addtoCardButton" onClick={handleAddCart} disabled={isLoading || inCart}>{inCart ? "Added" : (isLoading ? "Adding..." : "Add to Bag")}</button> : null}
        </div>
    )
}