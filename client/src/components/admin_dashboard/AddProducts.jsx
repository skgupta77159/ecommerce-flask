import { useContext } from "react";
import { useState } from "react"
import "./dashboardstyle.css"
import ProductCard from "./product_card/ProductCard"
import { AppContext } from "../../context/AppContext";
import { addProduct, getStoreProducts } from "../../service/adminApi";
import { useEffect } from "react";
import { CircularProgress } from '@material-ui/core'

export default function AddProducts() {
    const [product, setProduct] = useState({
        product_category: "homedecoration",
        product_description: "",
        product_image: "",
        product_name: "",
        product_price: ""
    });
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [productLoading, setProductLoading] = useState(false);
    const { admin, adminAuth } = useContext(AppContext)

    const getProd = async () => {
        setProductLoading(true)
        const products = await getStoreProducts(admin._id)
        setAllProducts(products)
        setProductLoading(false)
    }

    useEffect(() => {
        if (adminAuth) {
            getProd()
        }
    }, [adminAuth])

    const handleAddClick = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        const res = await addProduct({ ...product, store_id: admin._id })
        if (res) {
            getProd()
            setProduct({
                product_category: "homedecoration",
                product_description: "",
                product_image: "",
                product_name: "",
                product_price: ""
            })
        }
        setIsLoading(false)
    }

    const handleSelectChange = (e) => {
        e.preventDefault();
        setProduct({ ...product, product_category: e.target.value })
    }
    const handleInputChange = (e) => {
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
        setProduct({ ...product, [name]: value });
    }
    return (
        <>
            {
                admin ?
                    <>
                        <div className="adDashRightTop">
                            <h2>Products</h2>
                        </div>

                        <div className="allProducts">
                            <div className="addProductDiv" onSubmit={handleAddClick}>
                                <form className="productDiv">
                                <input type="text" placeholder='Product image' required name="product_image" value={product.product_image} onChange={handleInputChange} />
                                    <input type="text" placeholder='Product name' required name="product_name" value={product.product_name} onChange={handleInputChange} />
                                    <input type="text" placeholder='Product price' required name="product_price" value={product.product_price} onChange={handleInputChange} />
                                    <input type="text" placeholder='About product' required name="product_description" value={product.product_description} onChange={handleInputChange} />
                                    <select name="category" id="productCategory" onChange={e => handleSelectChange(e)} value={product.product_category}>
                                        <option value="homedecoration">Home & Decorations</option>
                                        <option value="electronic">Electronic & Accessories</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <button className='addProductBtn' disabled={isLoading} type="submit">{isLoading ? "Adding..." : "Add"}</button>
                                </form>
                            </div>
                            {
                                productLoading ? <CircularProgress /> :
                                    allProducts.map((item) => {
                                        return <ProductCard value={item} getProd={getProd} public={false} />
                                    })
                            }
                        </div>
                    </>
                    : null
            }
        </>
    )
}