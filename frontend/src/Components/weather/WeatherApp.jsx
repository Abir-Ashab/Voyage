import { useEffect, useState } from "react";
import Forecast from "./Forecast";
import Inputs from "./Inputs";
import TempAndDetails from "./TempAndDetails";
import TimeAndLocation from "./TimeAndLocation";
import TopButton from "./TopButton";
import getFormattedWeatherData from "./service/weatherService";

const WeatherApp = () => {

    const [query, setQuery] = useState({ q: 'dhaka' });
    const [units, setUnits] = useState('metric');
    const [weather, setWeather] = useState(null);

    const getWeather = async () => {
        await getFormattedWeatherData({...query, units}).then(data => {
            setWeather(data);
        })
    }

    useEffect(() => {
        getWeather();
    }, [query, units])
    return (
        <>
            {/* <h2 className="text-blue-primary text-4xl font-bold text-center my-5 underline ">Weather Update</h2> */}
            <div className="mx-auto mt-4 py-5 px-20 mb-6 max-w-5xl">
                {
                    weather && (
                        <>
                            <Inputs setQuery={setQuery} setUnits={setUnits}></Inputs>
                            <TimeAndLocation weather={weather} />
                            <TempAndDetails weather={weather} />
                            <Forecast title={"Hourly forecast"} data={weather.hourly} />
                            <Forecast title={"Daily forecast"} data={weather.daily} />
                        </>
                    )
                }
            </div>
        </>
    );
};

export default WeatherApp;