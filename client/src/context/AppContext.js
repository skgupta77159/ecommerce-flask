import { createContext, useEffect, useReducer, useState } from "react"
import { check_admin_auth } from "../service/adminApi";
import { check_user_auth } from "../service/userApi";

const INITIAL_STATE = {
    userAuth: false,
    adminAuth: false,
    user: null,
    admin: null,
    isFetching: false,
    error: false
}

const AppReducer = (state, actions) => {
    switch (actions.type) {
        case "EMPTY_STATE":
            return {
                userAuth: false,
                adminAuth: false,
                user: null,
                admin: null,
                error: false
            };
        case "FETCH_SUCCESS":
            return {
                userAuth: actions.value.userAuth,
                adminAuth: actions.value.adminAuth,
                user: actions.value.user,
                admin: actions.value.admin,
                error: false
            };
        case "FETCH_FAILED":
            return {
                userAuth: false,
                adminAuth: false,
                user: null,
                admin: null,
                error: actions.payload
            };
        default:
            return state;
    }
}

export const AppContext = createContext(INITIAL_STATE);

export const AppContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AppReducer, INITIAL_STATE);
    const [contextLoading, setContextLoading] = useState(true);

    const setContext = async ()=>{
        setContextLoading(true);
        const adminData = await check_admin_auth()
        const userData = await check_user_auth()
        if(adminData){
            dispatch({ type: "FETCH_SUCCESS", value: {userAuth: false, adminAuth: true, user: null, admin: adminData}});
            setContextLoading(false);
        }else if(userData){
            dispatch({ type: "FETCH_SUCCESS", value: {userAuth: true, adminAuth: false, user: userData, admin: null}});
            setContextLoading(false);
        }else{
            dispatch({ type: "EMPTY_STATE" });
            setContextLoading(false);
        }
    }

    useEffect(()=>{
        setContext()
    },[])

    return (
        <AppContext.Provider
            value={{
                userAuth: state.userAuth,
                adminAuth: state.adminAuth,
                user: state.user,
                admin: state.admin,
                isFetching: state.isFetching,
                error: state.error,
                contextLoading: contextLoading,
                setContextLoading,
                dispatch,
                setContext,
            }}>
                {children}
        </AppContext.Provider>
    )
}