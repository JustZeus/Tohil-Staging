export function time(date){
    const dateUTC = new Date(date);

    // Convertir a hora de California (formato: "6/15/2025, 8:30 AM")
    const dateCalifornia = dateUTC.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles", // Zona horaria de California
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true // Formato AM/PM
    });

    return dateCalifornia
}

export function color(severity){
    let colorAlert = severity <= 2 ? "#CC9900" : "#8b0333" 
    return colorAlert;
}

