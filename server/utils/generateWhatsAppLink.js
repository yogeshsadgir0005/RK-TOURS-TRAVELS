// generateWhatsAppLink.js
export const generateWhatsAppLink = (adminPhone, bookingDetails) => {
  const text = `Hello, I want to book a cab.
Name: ${bookingDetails.passengerDetails.name}
Phone: ${bookingDetails.passengerDetails.phone}

*PICKUP:*
${bookingDetails.pickup.streetAddress}, ${bookingDetails.pickup.city}
Map: ${bookingDetails.pickup.mapUrl}

*DROP:*
${bookingDetails.destination.streetAddress}, ${bookingDetails.destination.city}
Map: ${bookingDetails.destination.mapUrl}

Date: ${new Date(bookingDetails.journeyDate).toLocaleDateString()}
Trip Type: ${bookingDetails.tripType}
Cab Type: ${bookingDetails.cabType.name || 'Selected Cab'}`;

  return `https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`;
};