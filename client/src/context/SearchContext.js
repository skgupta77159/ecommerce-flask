import { createContext, useEffect, useReducer, useState } from "react"
import axios from "../axios";

const INITIAL_STATE = {
    productName: "",
    locMark: "",
    locValue: ""
}
// const AddReducer = (state, actions) => {
//     switch (actions.type) {
//         case "EMPTY_ADDRESS":
//             return {
//                 latitude: null,
//                 longitude: null
//             };
//         case "UPDATE_ADDRESS":
//             return {
//                 latitude: actions.payload.latitude,
//                 longitude: actions.payload.longitude
//             };
//         default:
//             return state;
//     }
// }

export const SearchContext = createContext(INITIAL_STATE);

export const SearchContextProvider = ({ children }) => {

    const [productName, setProductName] = useState("");
    const [locMark, setLocMark] = useState("");
    const [locValue, setLocValue] = useState("");
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [isProductLoading, setIsProductLoading] = useState(false)

    const fetchAllProducts = async ()=> {
        setIsProductLoading(true)
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        try {
            const res = await axios.get("/api/public/product/getall", config);
            if(res.data){
                setProducts(res.data.products)
            }
            setIsProductLoading(false)
        } catch (err) {
            console.log("Error in fetching products")
            setIsProductLoading(false)
        }
    }

    useEffect(()=>{
        fetchAllProducts();
    },[])
    
    useEffect(()=>{
        if(productName!=""){
            searchProduct()
        }
    },[locValue])

    const searchProduct = async () => {
        setIsProductLoading(true)
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        try {
            const res = await axios.post("/api/public/product/search", { "loc_name": locMark, "loc": locValue, "product_name": productName }, config);
            if(res.data){
                setProducts(res.data.products)
                setStores(res.data.stores)
            }
            setIsProductLoading(false)
        } catch (err) {
            console.log("Error in fetching products")
            setIsProductLoading(false)
        }
    }


    return (
        <SearchContext.Provider
            value={{
                setProductName,
                setLocMark,
                setLocValue,
                searchProduct,
                isProductLoading: isProductLoading,
                products: products,
                stores: stores
            }}>
            {children}
        </SearchContext.Provider>
    )
}