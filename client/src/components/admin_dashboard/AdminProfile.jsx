import "./dashboardstyle.css"
import { AppContext } from "../../context/AppContext"
import { useContext } from "react"

export default function AdminProfile() {

    const { admin } = useContext(AppContext)
    return (
        <>
            {
                admin ? <>
                    <div className="adDashRightTop">
                        <h2>Profile</h2>
                    </div>
                    <div className="adminProfileDiv">
                        <div className="personalInfo">
                            <h3>Personal Details</h3>
                            <div className="infoDiv">
                                <div className="infoProp">
                                    <p>Name</p>
                                    <p>Email</p>
                                </div>
                                <div className="infoValue">
                                    <p>{admin.name}</p>
                                    <p>{admin.email}</p>
                                </div>
                            </div>
                            <h3>Store Details</h3>
                            <div className="infoDiv">
                                <div className="infoProp">
                                    <p>Store Name</p>
                                    <p>Store Description</p>
                                    <p>Store Address</p>
                                </div>
                                <div className="infoValue">
                                    <p>{admin.store_name}</p>
                                    <p>{admin.store_description}</p>
                                    <p>{admin.store_address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </> : null
            }
        </>
    )
}