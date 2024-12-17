import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../Pages/LandingPage";
import SignIn from "../Pages/Signin";
import SignUp from "../Pages/SignUp";
import Home from "../Components/Home/Home";
import PlanATrip from "../Components/TripPlan/PlanATrip";
import YourTrip from "../Components/YourTrip/YourTrip";
import WeatherApp from "../Components/weather/WeatherApp";
import ErrorPage from "../Pages/ErrorPage";
import GallaryPage from "../Components/Gallary/GallaryPage";
import TripDetails from "../Components/Gallary/TripDetails";
import BlogsPage from "../Components/Blogs/BlogsPage";
import Vlog from "../Components/Vlogs/Vlog";

const router = createBrowserRouter([
    {
        path: 'sign-up',
        element: <SignUp />
    },
    {
        path: 'sign-in',
        element: <SignIn />
    },
    {
      path: "/",
      element: <LandingPage />,
      errorElement: <ErrorPage />
    },
    {
        path: "/home",
        element: <Home />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'plan-trip',
                element: <PlanATrip />
            },
            {
                path: 'your-trip',
                element: <YourTrip />
            },
            {
                path: 'weather',
                element: <WeatherApp />
            },
            {
                path: 'gallary',
                element: <GallaryPage />
            },
            {
                path: 'trip-details/:tripId',
                element: <TripDetails></TripDetails>
            },
            {
                path: 'blogs',
                element: <BlogsPage />
            },
            {
                path: 'vlog',
                element: <Vlog />
            }
        ]
    }
  ]);

export default router;
