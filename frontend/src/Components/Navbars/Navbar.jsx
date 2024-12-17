import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdOutlineTravelExplore } from "react-icons/md";
import { AuthContext } from "../Authentication/AuthProvider";
import Profile from "./Profile";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, logOut, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      logOut()
        .then(() => {
          window.location.reload();
        })
        .catch((error) => console.error(error));
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <div className="relative font-poppins bg-gradient-to-b from-rose-50 to-orange-50">
      <div className="navbar bg-blue-secondary font-manrope md:px-6">
        <div className="navbar-start">
          <NavLink to={"/"}>
            <span className="flex items-center gap-1">
              <MdOutlineTravelExplore className="text-4xl text-orange-secondary" />
              <h2 className="text-3xl font-bold italic font-poppins">
                Voyage
              </h2>
            </span>
          </NavLink>
        </div>
        
        <div className="navbar-end gap-1 md:gap-4">
          {user ? (
            <div className="relative">
              <button
                className="text-md mr-2 text-white font-poppins border-2 border-blue-primary rounded-full p-1"
                onClick={() => setIsDrawerOpen(true)}
              >
                <img
                  src={user.imageURL || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="rounded-full w-10 h-10"
                />
              </button>

              {isDrawerOpen && (
                <div className="fixed top-20 right-2 w-80 shadow-lg z-50">
                  <Profile user={user} setUser={setUser} setIsDrawerOpen={setIsDrawerOpen} />
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleAuthClick}
              className="border px-3 rounded-full text-md italic font-poppins"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
