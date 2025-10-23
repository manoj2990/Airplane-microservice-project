
function compareDates(date1, date2) {
  date1 = new Date(date1); //arrivalTime
  date2 = new Date(date2); //departureTime

  return date1.getTime() > date2.getTime();

}

module.exports = {
  compareDates
}