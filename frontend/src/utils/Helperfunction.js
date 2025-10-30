

export const FormateDuration = (arrivalTime,departureTime) => {
    const diff =
      new Date(arrivalTime).getTime() - new Date(departureTime).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return `${hours} h ${minutes} m`;
  }


    // Format time and date
  export const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const formatDate = (time) =>
    new Date(time).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export const getAddress = (add) =>{
  let cityName = add.split(',')[0];
  return cityName;
}