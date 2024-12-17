import { NavLink } from "react-router-dom";

const SecondaryNav = () => {
    const links = (
        <>
            <li>
                <NavLink
                    to="/home/plan-trip"
                    className={({ isActive }) =>
                        isActive
                            ? "underline text-gray-600"
                            : "text-gray-600"
                    }
                >
                    Plan a trip
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/home/your-trip"
                    className={({ isActive }) =>
                        isActive
                            ? "underline text-gray-600"
                            : "text-gray-600"
                    }
                >
                    Your trip
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/home/weather"
                    className={({ isActive }) =>
                        isActive
                            ? "underline text-gray-600"
                            : "text-gray-600"
                    }
                >
                    weather
                </NavLink>
            </li>
            <li>
            <NavLink
              to="/home/blogs"
              className={({ isActive }) =>
                isActive
                  ? "underline text-gray-600"
                  : "text-gray-600"
              }
            >
              Blogs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/home/gallary"
              className={({ isActive }) =>
                isActive
                  ? "underline text-gray-600"
                  : "text-gray-600"
              }
            >
              Gallary
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/home/vlog"
              className={({ isActive }) =>
                isActive
                  ? "underline text-gray-600"
                  : "text-gray-600"
              }
            >
              Vlogs
            </NavLink>
          </li>
        </>
        
    );
    return (
        <nav className="font-poppins py-6">
            <ul className="flex justify-center space-x-4 font-poppins font-md text-lg ">
                {links}
            </ul>
        </nav>
    );
};

export default SecondaryNav;