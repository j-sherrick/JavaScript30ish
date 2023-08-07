
function runClock(hourHand, minuteHand, secondHand) 
{
    const now = new Date();

    const seconds = now.getSeconds();
    const secDegrees = ((seconds / 60) * 360);
    secondHand.setAttribute('transform', `rotate(${secDegrees})`);
    
    const minutes = now.getMinutes();
    const minDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6);
    minuteHand.setAttribute('transform', `rotate(${minDegrees})`);
    
    const hours = now.getHours();
    const hourDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30);
    hourHand.setAttribute('transform', `rotate(${hourDegrees})`);
}

window.onload = () => {
    const clock = document.querySelector('#clock').contentDocument;
    const minuteHand = clock.querySelector("#minutes");
    const secondHand = clock.querySelector('#seconds');
    const hourHand = clock.querySelector('#hours');
    
    setInterval(runClock, 1000, hourHand, minuteHand, secondHand);
    runClock(hourHand, minuteHand, secondHand);
}

// TODO: Make a Clock class with methods to update hand position
// TODO: Inline javascript animation so clock runs with 'file://' protocol, i.e. without a server
// TODO: Fix bug where second hand spins in a full circle when it gets back to 12.