import "./user_dashboard.css"
import { AppContext } from "../../context/AppContext"
import { useContext } from "react"

export default function UserProfile() {

    const { user } = useContext(AppContext)
    return (
        <>
            {
                user ? <>
                    <div className="userDashRightTop">
                        <h2>Profile</h2>
                    </div>
                    <div className="userProfileDiv">
                        <div className="personalInfo">
                            <h3>Personal Details</h3>
                            <div className="infoDiv">
                                <div className="infoProp">
                                    <p>Name</p>
                                    <p>Email</p>
                                </div>
                                <div className="infoValue">
                                    <p>{user.name}</p>
                                    <p>{user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </> : null
            }
        </>
    )
}