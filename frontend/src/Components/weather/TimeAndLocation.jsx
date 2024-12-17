
const TimeAndLocation = ({weather: {formattedLocalTime, name, country}}) => {
  return (
    <div className="">
        <div className="flex items-center justify-center my-2">
            <p className="text-md font-extralight text-gray-800">
                {formattedLocalTime}
            </p>
        </div>

        <div className="flex items-center justify-center">
            <p className="text-2xl font-medium text-orange-secondary">{`${name}, ${country}`}</p>
        </div>
    </div>
  )
}

export default TimeAndLocation