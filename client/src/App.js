import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home"
import AdminSignin from "./pages/admin_signin/AdminSignin"
import AdminSignup from "./pages/admin_signup/AdminSignup"
import Topbar from './components/topbar/Topbar';
import AdminDashboard from './pages/admin_dashboard/AdminDashboard';
import AdminPrivateRoute from './components/routing/AdminPrivateRoute';
import { AddContextProvider } from './context/AddContext';
import { AppContextProvider } from './context/AppContext';
import UserSignup from './pages/user_signup/UserSignup';
import UserSignin from './pages/user_signin/UserSignin';
import UserPrivateRoute from './components/routing/UserPrivateRoute';
import UserDashboard from './pages/user_dashboard/UserDashboard';
import { SearchContextProvider } from './context/SearchContext';
import ProductPage from './pages/product_page/ProductPage';

function App() {

  return (
    <AppContextProvider>
      <AddContextProvider>
        <SearchContextProvider>
          <div className="App">
            <BrowserRouter>
              <Topbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin/sign-in" element={<AdminSignin />} />
                <Route path="/admin/sign-up" element={<AdminSignup />} />
                <Route path="/admin/dashboard/:tabs" element={<AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute>} />

                <Route path="/user/sign-in" element={<UserSignin />} />
                <Route path="/user/sign-up" element={<UserSignup />} />
                <Route path="/user/dashboard/:tabs" element={<UserPrivateRoute><UserDashboard /></UserPrivateRoute>} />

                <Route path="/product/:product_id" element={<ProductPage/>} />
              </Routes>
            </BrowserRouter>
          </div>
        </SearchContextProvider>
      </AddContextProvider>
    </AppContextProvider>
  );
}

export default App;
