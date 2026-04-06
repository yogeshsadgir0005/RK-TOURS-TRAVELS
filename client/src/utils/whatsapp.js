export const generateWhatsAppLink = (adminPhone, details) => {
  const message = `Hello, I want to book a cab.
*Name:* ${details.passengerDetails.name}
*Phone:* ${details.passengerDetails.phone}
*Pickup:* ${details.pickup.city}
*Destination:* ${details.destination.city}
*Date:* ${new Date(details.journeyDate).toLocaleDateString()}
*Trip Type:* ${details.tripType}
*Cab Type:* ${details.cabTypeName}

Please confirm price and availability.`;

  const encodedMessage = encodeURIComponent(message);
  // Remove any spaces or '+' from the phone number
  const cleanPhone = adminPhone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};