import { nav } from "framer-motion/client";
import { useState } from "react";
import { BiCurrentLocation, BiSearch } from "react-icons/bi"

const Inputs = ({setQuery, setUnits}) => {
    const [city, setCity] = useState('');

    const handleSearchClick = () => {
        if(city !== "") setQuery({q: city})
    }

    const handleLocationClick = () => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const {latitude, longitude} = position.coords;
                setQuery({lat: latitude, lon: longitude})
            })
        }
    }
  return (
    <div className="font-poppins flex flex-row justify-center">
        <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
            <input 
            type="text"
            value={city}
            onChange={e => setCity(e.currentTarget.value)}
            placeholder="search by city"
            className="input focus:outline-orange-primary text-orange-secondary border-orange-primary text-xl font-light p-2 w-full capitalize placeholder:lowercase max-w-md" />
            <BiSearch size={25}
            className="cursor-pointer text-gray-700 transition ease-out hover:scale-125"
            onClick={handleSearchClick} />
            <BiCurrentLocation size={25}
            className="cursor-pointer transition ease-out hover:scale-125 text-orange-primary"
            onClick={handleLocationClick} />
        </div>
        
    </div>
  )
}

export default Inputs