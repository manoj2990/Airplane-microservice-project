
const BASE_URL = "http://localhost:3001";

export const endpoints = {
 FLIGHT_SERACH_API : `${BASE_URL}/flightService/api/v1/flights`,
 FLIGHT_BY_ID_SERACH_API: `${BASE_URL}/flightService/api/v1/flights`,
 CREATE_BOOKING_API: `${BASE_URL}/bookingService/api/v1/bookings/create`,
 SINGH_UP_API: `${BASE_URL}/api/v1/user/singup`,
 LOGIN_API: `${BASE_URL}/api/v1/user/signin`,
 PAYMENT_API : `${BASE_URL}/bookingService/api/v1/bookings/make-payment`,
}