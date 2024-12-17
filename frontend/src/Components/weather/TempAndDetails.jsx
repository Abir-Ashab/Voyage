import { FaThermometerEmpty } from "react-icons/fa";
import { BiSolidDropletHalf } from "react-icons/bi";
import { FiWind } from "react-icons/fi";
import { GiSunrise, GiSunset } from "react-icons/gi";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
const TempAndDetails = ({ weather: {
    details, icon, temp, temp_min, temp_max, sunrise, sunset, speed, humidity, feels_like
} }) => {

    const verticalDetails = [
        {
            id: 1,
            Icon: FaThermometerEmpty,
            title: "Real Feel",
            value: `${feels_like.toFixed()}°`
        },
        {
            id: 2,
            Icon: BiSolidDropletHalf,
            title: "Humidity",
            value: `${humidity.toFixed()}%`
        },
        {
            id: 3,
            Icon: FiWind,
            title: "Wind",
            value: `${speed.toFixed()} km/h`
        }
    ];

    const horizzontalDetails = [
        {
            id: 1,
            Icon: GiSunrise,
            title: "Sunrise",
            value: sunrise
        },
        {
            id: 2,
            Icon: GiSunset,
            title: "Sunset",
            value: sunset
        },
        {
            id: 3,
            Icon: MdKeyboardArrowUp,
            title: "High",
            value: `${temp_max.toFixed()}°C`
        },
        {
            id: 4,
            Icon: MdKeyboardArrowDown,
            title: "Low",
            value: `${temp_min.toFixed()}°C`
        }
    ]
    return (
        <div>
            <div className="flex items-center justify-center mt-1 text-xl text-cream-primary">
                <p>{details}</p>
            </div>

            <div className="flex flex-row items-center justify-between py-3">
                <div className="">
                    {
                        horizzontalDetails.map(({ id, Icon, title, value }) => (
                            <div key={id} className="flex flex-row items-center">
                                <Icon size={30} className="text-orange-primary" />
                                <p className="font-light ml-1">
                                    {`${title}: `}
                                    <span className="font-medium ml-1 text-cream-primary">{value}</span>
                                </p>
                            </div>
                        ))
                    }
                </div>
                <p className="text-5xl text-orange-primary">{`${temp.toFixed()}°`}</p>
                <div className="flex flex-col space-y-3 items-start">
                    {
                        verticalDetails.map(({ id, Icon, title, value }) => (
                            <div className="flex font-light text-sm items-center justify-center">
                                <Icon size={18} className="mr-1 text-orange-primary" />
                                {`${title}: `} <span className="font-medium ml-1 text-cream-primary">{value}</span>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default TempAndDetails