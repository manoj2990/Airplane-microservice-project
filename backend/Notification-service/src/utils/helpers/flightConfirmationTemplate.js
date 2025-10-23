const flightConfirmationTemplate = ({
  passengerName,
  bookingReference,
  departureAirportName,
  departureAirportCode,
  arrivalAirportName,
  arrivalAirportCode,
  departureDate,
  departureTime,
  arrivalDate,
  arrivalTime,
  flightNumber,
  airlineName,
  seatNumbers, 
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your Flight Confirmation</title>
<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #eef2f7;
    font-family: 'Segoe UI', Arial, sans-serif;
    color: #333;
  }

  table {
    border-collapse: collapse;
  }

  .container {
    width: 100%;
    max-width: 600px;
    background-color: #fff;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 5px 20px rgba(0,0,0,0.08);
    margin-top: 30px;
  }

  .header {
    background: linear-gradient(90deg, #005bea, #00c6fb);
    color: #fff;
    text-align: center;
    padding: 35px 25px;
  }

  .header h1 {
    font-size: 24px;
    letter-spacing: 0.5px;
  }

  .section {
    padding: 25px 30px;
  }

  .section-title {
    font-size: 18px;
    color: #004aad;
    font-weight: 600;
    margin-bottom: 18px;
    border-left: 4px solid #0073e6;
    padding-left: 10px;
  }

  .info-table {
    width: 100%;
  }

  .info-table td {
    padding: 10px 12px;
    vertical-align: top;
  }

  .info-table p {
    font-size: 13px;
    color: #6c757d;
    margin-bottom: 5px;
  }

  .info-table h3 {
    font-size: 15px;
    color: #222;
    margin: 0;
  }

  .flight-table {
    width: 100%;
    border: 1px solid #e1e1e1;
    border-radius: 8px;
    overflow: hidden;
  }

  .flight-table th {
    background-color: #f0f7ff;
    text-align: left;
    padding: 10px;
    font-size: 14px;
    color: #004aad;
  }

  .flight-table td {
    padding: 10px;
    font-size: 14px;
    border-top: 1px solid #f0f0f0;
  }

  .footer {
    background-color: #f7f9fb;
    text-align: center;
    padding: 18px;
    font-size: 13px;
    color: #666;
  }

  .footer strong {
    color: #004aad;
  }
</style>
</head>
<body>
  <center>
    <table class="container">
      <tr>
        <td class="header">
          <h1>Your Flight is Confirmed ✈️</h1>
        </td>
      </tr>

      <tr>
        <td class="section">
          <h2 class="section-title">Passenger Information</h2>
          <table class="info-table">
            <tr>
              <td width="50%">
                <p>Passenger Name</p>
                <h3>${passengerName}</h3>
              </td>
              <td width="50%">
                <p>Booking Reference</p>
                <h3>${bookingReference}</h3>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td class="section" style="background-color:#fafcff;">
          <h2 class="section-title">Flight Details</h2>
          <table class="info-table">
            <tr>
              <td width="50%">
                <p>Departure</p>
                <h3>${departureAirportName} (${departureAirportCode})</h3>
                <p>${departureDate} at ${departureTime}</p>
              </td>
              <td width="50%">
                <p>Arrival</p>
                <h3>${arrivalAirportName} (${arrivalAirportCode})</h3>
                <p>${arrivalDate} at ${arrivalTime}</p>
              </td>
            </tr>
            <tr>
              <td width="50%">
                <p>Flight Number</p>
                <h3>${flightNumber}</h3>
              </td>
              <td width="50%">
                <p>Airline</p>
                <h3>${airlineName}</h3>
              </td>
            </tr>
          </table>

          <h2 class="section-title" style="margin-top:25px;">Seat & Class</h2>
          <table class="flight-table">
            <tr>
              <th>Seat</th>
              <th>Class</th>
            </tr>
            ${
              Array.isArray(seatNumbers) && seatNumbers.length > 0
                ? seatNumbers.map(
                    (seat) => `
                    <tr>
                      <td>${seat.seatId}</td>
                      <td>${seat.classType}</td>
                    </tr>`
                  ).join('')
                : `<tr><td colspan="2">No seat information available</td></tr>`
            }
          </table>
        </td>
      </tr>

      <tr>
        <td class="footer">
          Thank you for choosing <strong>${airlineName}</strong>!<br/>
          We wish you a pleasant journey 🌍
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
`;
};

module.exports = { flightConfirmationTemplate };
