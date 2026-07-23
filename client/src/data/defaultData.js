// Static default routes and cabs matching current DB documents for instant zero-loading homepage render
export const DEFAULT_ROUTES = [
  {
    "_id": "69cffe1b787adc43b4387468",
    "pickupCity": "Nashik",
    "destinationCity": "Mumbai",
    "pickupStreet": "CBS",
    "destinationStreet": "Airport",
    "distance": 172,
    "basePrice": 1350,
    "cabFares": [
      {
        "cab": "69d39819ea0a2e4e4bda872f",
        "fare": 3500,
        "_id": "69d3ccf73127d9dfde9644f1"
      },
      {
        "cab": "69ce33581c0fff5c33f55e1b",
        "fare": 2800,
        "_id": "69d3ccf73127d9dfde9644f2"
      }
    ]
  },
  {
    "_id": "69d3ccdc3127d9dfde9644e3",
    "pickupCity": "Mumbai",
    "destinationCity": "Nashik",
    "pickupStreet": "Airport",
    "destinationStreet": "CBS",
    "distance": 172,
    "basePrice": 3000,
    "cabFares": [
      {
        "cab": "69d3cc303127d9dfde9644c4",
        "fare": 5500,
        "_id": "69d3ccdc3127d9dfde9644e4"
      },
      {
        "cab": "69d39819ea0a2e4e4bda872f",
        "fare": 3500,
        "_id": "69d3ccdc3127d9dfde9644e5"
      },
      {
        "cab": "69ce33581c0fff5c33f55e1b",
        "fare": 2800,
        "_id": "69d3ccdc3127d9dfde9644e6"
      }
    ]
  },
  {
    "_id": "69d3d0b43127d9dfde964539",
    "pickupCity": "Pune",
    "destinationCity": "Nashik",
    "pickupStreet": "Airport",
    "destinationStreet": "CBS",
    "distance": 242,
    "basePrice": 3300,
    "cabFares": [
      {
        "cab": "69d3cc303127d9dfde9644c4",
        "fare": 5500,
        "_id": "69d3d0b43127d9dfde96453a"
      },
      {
        "cab": "69d39819ea0a2e4e4bda872f",
        "fare": 3500,
        "_id": "69d3d0b43127d9dfde96453b"
      },
      {
        "cab": "69ce33581c0fff5c33f55e1b",
        "fare": 2800,
        "_id": "69d3d0b43127d9dfde96453c"
      }
    ]
  },
  {
    "_id": "69d3d0ea3127d9dfde96454b",
    "pickupCity": "Nashik",
    "destinationCity": "Pune",
    "pickupStreet": "CBS",
    "destinationStreet": "Airport",
    "distance": 240,
    "basePrice": 3300,
    "cabFares": [
      {
        "cab": "69d3cc303127d9dfde9644c4",
        "fare": 5500,
        "_id": "69d3d0ea3127d9dfde96454c"
      },
      {
        "cab": "69d39819ea0a2e4e4bda872f",
        "fare": 3500,
        "_id": "69d3d0ea3127d9dfde96454d"
      },
      {
        "cab": "69ce33581c0fff5c33f55e1b",
        "fare": 2800,
        "_id": "69d3d0ea3127d9dfde96454e"
      }
    ]
  }
];

export const DEFAULT_CABS = [
  {
    "_id": "69d3cc303127d9dfde9644c4",
    "name": "Innova Crysta",
    "vehicleNumber": "MH15AB2139",
    "seats": 6,
    "pricePerKm": 18,
    "image": "https://res.cloudinary.com/dpjho1bqr/image/upload/v1775488046/cabbook_images/fbmwdsmecr8cra7jqztv.jpg",
    "acStatus": "AC",
    "fuelType": "Diesel",
    "category": "SUV",
    "rating": 4.8,
    "trips": 0,
    "features": [],
    "isActive": true
  },
  {
    "_id": "69d397dcea0a2e4e4bda8721",
    "name": "Suzuki Ertiga",
    "vehicleNumber": "MH15AS1246Q",
    "seats": 6,
    "pricePerKm": 15,
    "image": "https://res.cloudinary.com/dpjho1bqr/image/upload/v1775474627/cabbook_images/p90zqzhxporwvcbbz7bk.png",
    "acStatus": "AC",
    "fuelType": "CNG",
    "category": "SUV",
    "rating": 4.8,
    "trips": 0,
    "features": [],
    "isActive": true
  },
  {
    "_id": "69d39819ea0a2e4e4bda872f",
    "name": "Suzuki Ertiga",
    "vehicleNumber": "MH15ZV2531E",
    "seats": 6,
    "pricePerKm": 15,
    "image": "https://res.cloudinary.com/dpjho1bqr/image/upload/v1775474712/cabbook_images/zds5jaufy8ys9bruiolf.png",
    "acStatus": "AC",
    "fuelType": "CNG",
    "category": "SUV",
    "rating": 4.8,
    "trips": 0,
    "features": [],
    "isActive": true
  },
  {
    "_id": "69ce33581c0fff5c33f55e1b",
    "name": "Suzuki Dzire",
    "vehicleNumber": "22BH2025E",
    "seats": 3,
    "pricePerKm": 12,
    "image": "https://res.cloudinary.com/dpjho1bqr/image/upload/v1775474483/cabbook_images/ka2niufumgsqtim0speu.png",
    "acStatus": "AC",
    "fuelType": "Diesel",
    "category": "Sedan",
    "rating": 4.8,
    "trips": 0,
    "features": [],
    "isActive": true
  }
];

// Helper to merge fetched database items with default hardcoded items without duplicating
export const mergeDataById = (defaultItems = [], fetchedItems = []) => {
  const map = new Map();
  defaultItems.forEach(item => map.set(String(item._id), item));
  fetchedItems.forEach(item => map.set(String(item._id), item));
  return Array.from(map.values());
};

// High quality city images mapping for city avatars
export const CITY_IMAGES = {
  mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=120&q=80",
  pune: "https://images.unsplash.com/photo-1605335870020-f50c059cf3b1?auto=format&fit=crop&w=120&q=80",
  nashik: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=120&q=80",
  nagpur: "https://images.unsplash.com/photo-1627894098939-c189ec322a36?auto=format&fit=crop&w=120&q=80",
  shirdi: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=120&q=80",
  mahabaleshwar: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=120&q=80",
  aurangabad: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=120&q=80",
  kolhapur: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=120&q=80",
  goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=120&q=80"
};

export const getCityImage = (cityName) => {
  if (!cityName) return "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=120&q=80";
  const key = cityName.trim().toLowerCase();
  return CITY_IMAGES[key] || "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=120&q=80";
};

export const getRouteStartingPrice = (route) => {
  if (route?.cabFares && route.cabFares.length > 0) {
    const validFares = route.cabFares.map(cf => cf.fare).filter(f => f && f > 0);
    if (validFares.length > 0) return Math.min(...validFares);
  }
  return route?.basePrice || 2800;
};
