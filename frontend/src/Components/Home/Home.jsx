import { Outlet } from "react-router-dom";
import Navbar from "../Navbars/Navbar";
import SecondaryNav from "../Navbars/SecondaryNav";

const Home = () => {
    return (
        <div>
            <Navbar />
            <SecondaryNav />
            <Outlet />
        </div>
    );
};

export default Home;