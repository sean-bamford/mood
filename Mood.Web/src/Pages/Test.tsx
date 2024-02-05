import { useNavigate } from "react-router-dom";
import "./Test.css";
const Test = () => {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate("/");
    }

    function getTimes(startingTime: string, hours: number, days: number) {
        // Parse the starting time
        const [hour, minute] = startingTime.split(':').map(Number);
        const currentTime = new Date();
        currentTime.setHours(hour, minute, 0, 0);

        // Initialize the array of times and the current day number
        const times = [];
        let currentDay = 1;

        // Calculate the end time
        const endTime = new Date(currentTime.getTime());
        endTime.setDate(endTime.getDate() + days);

        // Loop until the current time exceeds the end time
        while (currentTime <= endTime) {
            // Format the current time as a 12-hour AM/PM time
            let hour = currentTime.getHours();
            const minutes = currentTime.getMinutes();
            const period = hour < 12 ? 'AM' : 'PM';
            if (hour > 12) hour -= 12;
            if (hour === 0) hour = 12;
            const time = `${hour}:${minutes < 10 ? '0' : ''}${minutes} ${period}, Day ${currentDay}`;

            // Add the time to the array
            times.push(time);

            // Add the given number of hours to the current time
            currentTime.setHours(currentTime.getHours() + hours);

            // If the current time has passed midnight, increment the current day number
            if (currentTime.getHours() < hours) {
                currentDay++;
            }
        }

        return times;
    }



    return (
        <>
        <div className="header">
            <h1 className="title">Test</h1>
        </div>
        <div className="content">
                <div className="times">
                    {getTimes('10:00', 14, 7).map((time) => {
                        if (parseInt(time.substring(time.indexOf("Day") + 4)) % 2 === 0) { return <div className="bubble time even">{time}</div>; }
                        else { return <div className="bubble time odd">{time}</div>; }
                    })}
                </div>
            </div>
            <button className="back" onClick={handleBack} title="Back to Home">
                ←
            </button>
        </>

    )
}
export default Test;

// 12 14 18 24 36 72