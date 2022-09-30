// Debounce helper function
const debounce = (callbackFunc, delay = 1000) => { //delay set to 1000 msec default
    let timeoutId;
    // Wrapper function; the shield from our diagram
    return (...args) => {
    // ...args: takes several arguments
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            callbackFunc.apply(null, args);
            // .apply(): call the function as we normally would and take all the arguments or whatever is inside of that array and pass them in as separate argumetns to the original function
        }, delay);
    };
};