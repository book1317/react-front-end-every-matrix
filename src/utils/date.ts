export const isTimeBetween = (open: string, close: string) => { // format HH:MM
    const [openHoursStr, openMinutesStr] = open.split(":");
    const [closeHoursStr, closeMinutesStr] = close.split(":");
    const openTime = new Date().setHours(parseInt(openHoursStr), parseInt(openMinutesStr), 0);
    const closeTime = new Date().setHours(parseInt(closeHoursStr), parseInt(closeMinutesStr), 0);
    const currentTime = Date.now();
    return currentTime >= openTime && currentTime <= closeTime
}