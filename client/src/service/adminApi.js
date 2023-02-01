import axios from "../axios"

// export function signup_admin(userData) {
//     try {
//         const config = {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json",
//             }
//         }
//         axios.post("/api/admin/auth/sign-up", userData, config).then(response => {
//             console.log(response)
//         }).catch((error) => {
//             if(error.response.status === 401){
//                 return {"error": error.response.data.message}
//             }
//         })
//     } catch (e) {
//         console.log(e)
//     }
// }

export async function logout_admin() {
    try {
        const config = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("adminAuthToken")}`
            }
        }
        return await axios.delete("/api/admin/auth/logout", config).then(response => {
            return true
        }).catch((error) => {
            return false
        })
    } catch (e) {
        console.log(e)
    }
}

export async function check_admin_auth() {
    try {
        const adminToken = localStorage.getItem("adminAuthToken");
        if(!adminToken){
            return false
        }
        const config = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`
            },
        }
        return await axios.get("/api/admin/auth/checkauth", config).then(response => {
            return response.data
        }).catch((error) => {
            return false
        })
    } catch (e) {
        console.log(e)
    }
}

export async function addProduct(product_detail){
    try {
        const config = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("adminAuthToken")}`
            }
        }
        return await axios.post("/api/admin/product/add", product_detail, config).then(response => {
            return true
        }).catch((error) => {
            return false
        })
    } catch (e) {
        console.log(e)
    }
}

export async function deleteProduct(product_id) {
    try {
        const config = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("adminAuthToken")}`
            }
        }
        return await axios.post('/api/admin/product/delete', {"_id": product_id}, config).then(response => {
            return true
        }).catch((error) => {
            return false
        })
    } catch (err) {
        console.log("Error in updating user");
    }
}

export async function updateProduct(detail) {
    try {
        const config = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("adminAuthToken")}`
            }
        }
        return await axios.post('/api/admin/product/edit', detail, config).then(response => {
            return true
        }).catch((error) => {
            return false
        })
    } catch (err) {
        console.log("Error in updating user");
    }
}

export async function getStoreProducts(store_id){
    try {
        const config = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("adminAuthToken")}`
            }
        }
        return await axios.post("/api/admin/product/getstoreproducts", {"store_id":store_id}, config).then(response => {
            return [...response.data]
        }).catch((error) => {
            return false
        })
    } catch (e) {
        console.log(e)
    }
}

export async function get_admin_orders(){
    try {
        const config = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("adminAuthToken")}`
            }
        }
        return await axios.get("/api/admin/product/getorders", config).then(response => {
            return response.data
        }).catch((error) => {
            return false
        })
    } catch (e) {
        console.log(e)
    }
}

export async function set_order_status(payload){
    try {
        const config = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("adminAuthToken")}`
            }
        }
        return await axios.put("/api/admin/product/setorderstatus", payload, config).then(response => {
            return true
        }).catch((error) => {
            return false
        })
    } catch (e) {
        console.log(e)
    }
}