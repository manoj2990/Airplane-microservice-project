
// Function to convert backend seat numbers (['1','12']) → frontend IDs (['A-1','B-3'])
export const mapBackendToFrontend = (seatNumbers, seatLayout) => {
  if (!Array.isArray(seatNumbers)) return [];

  const allSeats = [...seatLayout.leftSide, ...seatLayout.rightSide];

  return seatNumbers
    .map((seatNo) => {
      const foundSeat = allSeats.find(
        (s) => s.seatid.toString() === seatNo.toString()
      );
      return foundSeat ? foundSeat.id : null;
    })
    .filter(Boolean);
};

// Function to convert frontend IDs (['A-1','B-3']) → backend seat numbers (['1','12'])
export const mapFrontendToBackend = (seatIds, seatLayout) => {
  if (!Array.isArray(seatIds)) return [];

  const allSeats = [...seatLayout.leftSide, ...seatLayout.rightSide];

  return seatIds
    .map((seatId) => {
      const foundSeat = allSeats.find((s) => s.id === seatId);
      return foundSeat ? foundSeat.seatid.toString() : null;
    })
    .filter(Boolean);
};
