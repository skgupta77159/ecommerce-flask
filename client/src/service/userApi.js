import axios from "../axios"

export async function logout_user() {
    try {
        const config = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("userAuthToken")}`
            }
        }
        return await axios.delete("/api/user/auth/logout", config).then(response => {
            return true
        }).catch((error) => {
            return false
        })
    } catch (e) {
        console.log(e)
    }
}

export async function check_user_auth() {
    try {
        const userToken = localStorage.getItem("userAuthToken");
        if(!userToken){
            return false
        }
        const config = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`
            },
        }
        return await axios.get("/api/user/auth/check-userauth", config).then(response => {
            return response.data
        }).catch((error) => {
            return false
        })
    } catch (e) {
        console.log(e)
    }
}

export async function add_to_cart(product_id){
    const config = {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("userAuthToken")}`
        }
    }
    return await axios.put("/api/user/product/addtocart", {"product_id": product_id} ,config).then(response => {
        return true
    }).catch((error) => {
        return false
    })
}

export async function remove_from_cart(product_id) {
    try {
        const config = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("userAuthToken")}`
            }
        }
        return await axios.put('/api/user/product/removefromcart', {"product_id": product_id}, config).then(response => {
            return true
        }).catch((error) => {
            return false
        })
    } catch (err) {
        console.log("Error in removing cart item");
    }
}

export async function cancel_order(order_id) {
    try{
        const config = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("userAuthToken")}`
            }
        }
        return await axios.put('/api/user/product/cancelorder', {"order_id": order_id}, config).then(response => {
            return true
        }).catch((error) => {
            return false
        })
    }catch (err) {
        console.log("Error in canceling order");
    }
}