/**
 * Birthplace atlas for the free DRISHTI snapshot.
 * [name, region, latitude (N+), longitude (E+), IANA time zone]
 * Anyone not listed can enter coordinates manually.
 */
export type CityTuple = readonly [string, string, number, number, string];

export const CITIES: readonly CityTuple[] = [
  // India
  ["New Delhi", "Delhi, India", 28.6139, 77.209, "Asia/Kolkata"],
  ["Mumbai", "Maharashtra, India", 19.076, 72.8777, "Asia/Kolkata"],
  ["Kolkata", "West Bengal, India", 22.5726, 88.3639, "Asia/Kolkata"],
  ["Chennai", "Tamil Nadu, India", 13.0827, 80.2707, "Asia/Kolkata"],
  ["Bengaluru", "Karnataka, India", 12.9716, 77.5946, "Asia/Kolkata"],
  ["Hyderabad", "Telangana, India", 17.385, 78.4867, "Asia/Kolkata"],
  ["Ahmedabad", "Gujarat, India", 23.0225, 72.5714, "Asia/Kolkata"],
  ["Pune", "Maharashtra, India", 18.5204, 73.8567, "Asia/Kolkata"],
  ["Jaipur", "Rajasthan, India", 26.9124, 75.7873, "Asia/Kolkata"],
  ["Lucknow", "Uttar Pradesh, India", 26.8467, 80.9462, "Asia/Kolkata"],
  ["Kanpur", "Uttar Pradesh, India", 26.4499, 80.3319, "Asia/Kolkata"],
  ["Nagpur", "Maharashtra, India", 21.1458, 79.0882, "Asia/Kolkata"],
  ["Indore", "Madhya Pradesh, India", 22.7196, 75.8577, "Asia/Kolkata"],
  ["Bhopal", "Madhya Pradesh, India", 23.2599, 77.4126, "Asia/Kolkata"],
  ["Ujjain", "Madhya Pradesh, India", 23.1765, 75.7885, "Asia/Kolkata"],
  ["Jabalpur", "Madhya Pradesh, India", 23.1815, 79.9864, "Asia/Kolkata"],
  ["Gwalior", "Madhya Pradesh, India", 26.2183, 78.1828, "Asia/Kolkata"],
  ["Patna", "Bihar, India", 25.5941, 85.1376, "Asia/Kolkata"],
  ["Gaya", "Bihar, India", 24.7914, 85.0002, "Asia/Kolkata"],
  ["Varanasi", "Uttar Pradesh, India", 25.3176, 82.9739, "Asia/Kolkata"],
  ["Prayagraj", "Uttar Pradesh, India", 25.4358, 81.8463, "Asia/Kolkata"],
  ["Ayodhya", "Uttar Pradesh, India", 26.7922, 82.1998, "Asia/Kolkata"],
  ["Mathura", "Uttar Pradesh, India", 27.4924, 77.6737, "Asia/Kolkata"],
  ["Vrindavan", "Uttar Pradesh, India", 27.565, 77.6593, "Asia/Kolkata"],
  ["Barsana", "Uttar Pradesh, India", 27.6497, 77.3776, "Asia/Kolkata"],
  ["Agra", "Uttar Pradesh, India", 27.1767, 78.0081, "Asia/Kolkata"],
  ["Meerut", "Uttar Pradesh, India", 28.9845, 77.7064, "Asia/Kolkata"],
  ["Noida", "Uttar Pradesh, India", 28.5355, 77.391, "Asia/Kolkata"],
  ["Ghaziabad", "Uttar Pradesh, India", 28.6692, 77.4538, "Asia/Kolkata"],
  ["Gorakhpur", "Uttar Pradesh, India", 26.7606, 83.3732, "Asia/Kolkata"],
  ["Bareilly", "Uttar Pradesh, India", 28.367, 79.4304, "Asia/Kolkata"],
  ["Aligarh", "Uttar Pradesh, India", 27.8974, 78.088, "Asia/Kolkata"],
  ["Gurugram", "Haryana, India", 28.4595, 77.0266, "Asia/Kolkata"],
  ["Faridabad", "Haryana, India", 28.4089, 77.3178, "Asia/Kolkata"],
  ["Kurukshetra", "Haryana, India", 29.9695, 76.8783, "Asia/Kolkata"],
  ["Chandigarh", "Chandigarh, India", 30.7333, 76.7794, "Asia/Kolkata"],
  ["Amritsar", "Punjab, India", 31.634, 74.8723, "Asia/Kolkata"],
  ["Ludhiana", "Punjab, India", 30.901, 75.8573, "Asia/Kolkata"],
  ["Jalandhar", "Punjab, India", 31.326, 75.5762, "Asia/Kolkata"],
  ["Jammu", "Jammu & Kashmir, India", 32.7266, 74.857, "Asia/Kolkata"],
  ["Srinagar", "Jammu & Kashmir, India", 34.0837, 74.7973, "Asia/Kolkata"],
  ["Shimla", "Himachal Pradesh, India", 31.1048, 77.1734, "Asia/Kolkata"],
  ["Dehradun", "Uttarakhand, India", 30.3165, 78.0322, "Asia/Kolkata"],
  ["Haridwar", "Uttarakhand, India", 29.9457, 78.1642, "Asia/Kolkata"],
  ["Rishikesh", "Uttarakhand, India", 30.0869, 78.2676, "Asia/Kolkata"],
  ["Surat", "Gujarat, India", 21.1702, 72.8311, "Asia/Kolkata"],
  ["Vadodara", "Gujarat, India", 22.3072, 73.1812, "Asia/Kolkata"],
  ["Rajkot", "Gujarat, India", 22.3039, 70.8022, "Asia/Kolkata"],
  ["Dwarka", "Gujarat, India", 22.2442, 68.9685, "Asia/Kolkata"],
  ["Somnath", "Gujarat, India", 20.888, 70.4013, "Asia/Kolkata"],
  ["Udaipur", "Rajasthan, India", 24.5854, 73.7125, "Asia/Kolkata"],
  ["Jodhpur", "Rajasthan, India", 26.2389, 73.0243, "Asia/Kolkata"],
  ["Ajmer", "Rajasthan, India", 26.4499, 74.6399, "Asia/Kolkata"],
  ["Bikaner", "Rajasthan, India", 28.0229, 73.3119, "Asia/Kolkata"],
  ["Kota", "Rajasthan, India", 25.2138, 75.8648, "Asia/Kolkata"],
  ["Raipur", "Chhattisgarh, India", 21.2514, 81.6296, "Asia/Kolkata"],
  ["Ranchi", "Jharkhand, India", 23.3441, 85.3096, "Asia/Kolkata"],
  ["Jamshedpur", "Jharkhand, India", 22.8046, 86.2029, "Asia/Kolkata"],
  ["Bhubaneswar", "Odisha, India", 20.2961, 85.8245, "Asia/Kolkata"],
  ["Puri", "Odisha, India", 19.8135, 85.8312, "Asia/Kolkata"],
  ["Guwahati", "Assam, India", 26.1445, 91.7362, "Asia/Kolkata"],
  ["Shillong", "Meghalaya, India", 25.5788, 91.8933, "Asia/Kolkata"],
  ["Siliguri", "West Bengal, India", 26.7271, 88.3953, "Asia/Kolkata"],
  ["Imphal", "Manipur, India", 24.817, 93.9368, "Asia/Kolkata"],
  ["Nashik", "Maharashtra, India", 19.9975, 73.7898, "Asia/Kolkata"],
  ["Chhatrapati Sambhajinagar", "Maharashtra, India", 19.8762, 75.3433, "Asia/Kolkata"],
  ["Kolhapur", "Maharashtra, India", 16.705, 74.2433, "Asia/Kolkata"],
  ["Pandharpur", "Maharashtra, India", 17.6746, 75.3237, "Asia/Kolkata"],
  ["Panaji", "Goa, India", 15.4909, 73.8278, "Asia/Kolkata"],
  ["Mysuru", "Karnataka, India", 12.2958, 76.6394, "Asia/Kolkata"],
  ["Mangaluru", "Karnataka, India", 12.9141, 74.856, "Asia/Kolkata"],
  ["Udupi", "Karnataka, India", 13.3409, 74.7421, "Asia/Kolkata"],
  ["Hubballi", "Karnataka, India", 15.3647, 75.124, "Asia/Kolkata"],
  ["Kochi", "Kerala, India", 9.9312, 76.2673, "Asia/Kolkata"],
  ["Thiruvananthapuram", "Kerala, India", 8.5241, 76.9366, "Asia/Kolkata"],
  ["Kozhikode", "Kerala, India", 11.2588, 75.7804, "Asia/Kolkata"],
  ["Guruvayur", "Kerala, India", 10.5943, 76.0411, "Asia/Kolkata"],
  ["Coimbatore", "Tamil Nadu, India", 11.0168, 76.9558, "Asia/Kolkata"],
  ["Madurai", "Tamil Nadu, India", 9.9252, 78.1198, "Asia/Kolkata"],
  ["Tiruchirappalli", "Tamil Nadu, India", 10.7905, 78.7047, "Asia/Kolkata"],
  ["Rameswaram", "Tamil Nadu, India", 9.2876, 79.3129, "Asia/Kolkata"],
  ["Visakhapatnam", "Andhra Pradesh, India", 17.6868, 83.2185, "Asia/Kolkata"],
  ["Vijayawada", "Andhra Pradesh, India", 16.5062, 80.648, "Asia/Kolkata"],
  ["Tirupati", "Andhra Pradesh, India", 13.6288, 79.4192, "Asia/Kolkata"],
  ["Puducherry", "Puducherry, India", 11.9416, 79.8083, "Asia/Kolkata"],
  // South Asia
  ["Kathmandu", "Nepal", 27.7172, 85.324, "Asia/Kathmandu"],
  ["Colombo", "Sri Lanka", 6.9271, 79.8612, "Asia/Colombo"],
  ["Dhaka", "Bangladesh", 23.8103, 90.4125, "Asia/Dhaka"],
  ["Karachi", "Pakistan", 24.8607, 67.0011, "Asia/Karachi"],
  ["Lahore", "Pakistan", 31.5204, 74.3587, "Asia/Karachi"],
  ["Thimphu", "Bhutan", 27.4728, 89.639, "Asia/Thimphu"],
  // Middle East
  ["Dubai", "United Arab Emirates", 25.2048, 55.2708, "Asia/Dubai"],
  ["Abu Dhabi", "United Arab Emirates", 24.4539, 54.3773, "Asia/Dubai"],
  ["Sharjah", "United Arab Emirates", 25.3463, 55.4209, "Asia/Dubai"],
  ["Muscat", "Oman", 23.588, 58.3829, "Asia/Muscat"],
  ["Doha", "Qatar", 25.2854, 51.531, "Asia/Qatar"],
  ["Riyadh", "Saudi Arabia", 24.7136, 46.6753, "Asia/Riyadh"],
  ["Kuwait City", "Kuwait", 29.3759, 47.9774, "Asia/Kuwait"],
  ["Manama", "Bahrain", 26.2285, 50.586, "Asia/Bahrain"],
  // East & Southeast Asia, Oceania
  ["Singapore", "Singapore", 1.3521, 103.8198, "Asia/Singapore"],
  ["Kuala Lumpur", "Malaysia", 3.139, 101.6869, "Asia/Kuala_Lumpur"],
  ["Bangkok", "Thailand", 13.7563, 100.5018, "Asia/Bangkok"],
  ["Jakarta", "Indonesia", -6.2088, 106.8456, "Asia/Jakarta"],
  ["Denpasar (Bali)", "Indonesia", -8.6705, 115.2126, "Asia/Makassar"],
  ["Hong Kong", "China", 22.3193, 114.1694, "Asia/Hong_Kong"],
  ["Shanghai", "China", 31.2304, 121.4737, "Asia/Shanghai"],
  ["Tokyo", "Japan", 35.6762, 139.6503, "Asia/Tokyo"],
  ["Seoul", "South Korea", 37.5665, 126.978, "Asia/Seoul"],
  ["Sydney", "Australia", -33.8688, 151.2093, "Australia/Sydney"],
  ["Melbourne", "Australia", -37.8136, 144.9631, "Australia/Melbourne"],
  ["Brisbane", "Australia", -27.4698, 153.0251, "Australia/Brisbane"],
  ["Perth", "Australia", -31.9505, 115.8605, "Australia/Perth"],
  ["Adelaide", "Australia", -34.9285, 138.6007, "Australia/Adelaide"],
  ["Auckland", "New Zealand", -36.8485, 174.7633, "Pacific/Auckland"],
  ["Suva", "Fiji", -18.1248, 178.4501, "Pacific/Fiji"],
  // Europe
  ["London", "United Kingdom", 51.5074, -0.1278, "Europe/London"],
  ["Leicester", "United Kingdom", 52.6369, -1.1398, "Europe/London"],
  ["Birmingham", "United Kingdom", 52.4862, -1.8904, "Europe/London"],
  ["Manchester", "United Kingdom", 53.4808, -2.2426, "Europe/London"],
  ["Edinburgh", "United Kingdom", 55.9533, -3.1883, "Europe/London"],
  ["Dublin", "Ireland", 53.3498, -6.2603, "Europe/Dublin"],
  ["Paris", "France", 48.8566, 2.3522, "Europe/Paris"],
  ["Amsterdam", "Netherlands", 52.3676, 4.9041, "Europe/Amsterdam"],
  ["Brussels", "Belgium", 50.8503, 4.3517, "Europe/Brussels"],
  ["Frankfurt", "Germany", 50.1109, 8.6821, "Europe/Berlin"],
  ["Berlin", "Germany", 52.52, 13.405, "Europe/Berlin"],
  ["Munich", "Germany", 48.1351, 11.582, "Europe/Berlin"],
  ["Zurich", "Switzerland", 47.3769, 8.5417, "Europe/Zurich"],
  ["Milan", "Italy", 45.4642, 9.19, "Europe/Rome"],
  ["Rome", "Italy", 41.9028, 12.4964, "Europe/Rome"],
  ["Madrid", "Spain", 40.4168, -3.7038, "Europe/Madrid"],
  ["Lisbon", "Portugal", 38.7223, -9.1393, "Europe/Lisbon"],
  ["Stockholm", "Sweden", 59.3293, 18.0686, "Europe/Stockholm"],
  ["Oslo", "Norway", 59.9139, 10.7522, "Europe/Oslo"],
  ["Warsaw", "Poland", 52.2297, 21.0122, "Europe/Warsaw"],
  ["Moscow", "Russia", 55.7558, 37.6173, "Europe/Moscow"],
  // Africa
  ["Johannesburg", "South Africa", -26.2041, 28.0473, "Africa/Johannesburg"],
  ["Durban", "South Africa", -29.8587, 31.0218, "Africa/Johannesburg"],
  ["Cape Town", "South Africa", -33.9249, 18.4241, "Africa/Johannesburg"],
  ["Nairobi", "Kenya", -1.2921, 36.8219, "Africa/Nairobi"],
  ["Dar es Salaam", "Tanzania", -6.7924, 39.2083, "Africa/Dar_es_Salaam"],
  ["Kampala", "Uganda", 0.3476, 32.5825, "Africa/Kampala"],
  ["Lagos", "Nigeria", 6.5244, 3.3792, "Africa/Lagos"],
  ["Port Louis", "Mauritius", -20.1609, 57.5012, "Indian/Mauritius"],
  // Americas
  ["New York", "New York, USA", 40.7128, -74.006, "America/New_York"],
  ["Edison", "New Jersey, USA", 40.5187, -74.4121, "America/New_York"],
  ["Boston", "Massachusetts, USA", 42.3601, -71.0589, "America/New_York"],
  ["Washington", "District of Columbia, USA", 38.9072, -77.0369, "America/New_York"],
  ["Philadelphia", "Pennsylvania, USA", 39.9526, -75.1652, "America/New_York"],
  ["Atlanta", "Georgia, USA", 33.749, -84.388, "America/New_York"],
  ["Miami", "Florida, USA", 25.7617, -80.1918, "America/New_York"],
  ["Orlando", "Florida, USA", 28.5383, -81.3792, "America/New_York"],
  ["Charlotte", "North Carolina, USA", 35.2271, -80.8431, "America/New_York"],
  ["Detroit", "Michigan, USA", 42.3314, -83.0458, "America/Detroit"],
  ["Chicago", "Illinois, USA", 41.8781, -87.6298, "America/Chicago"],
  ["Houston", "Texas, USA", 29.7604, -95.3698, "America/Chicago"],
  ["Dallas", "Texas, USA", 32.7767, -96.797, "America/Chicago"],
  ["Austin", "Texas, USA", 30.2672, -97.7431, "America/Chicago"],
  ["Minneapolis", "Minnesota, USA", 44.9778, -93.265, "America/Chicago"],
  ["Denver", "Colorado, USA", 39.7392, -104.9903, "America/Denver"],
  ["Phoenix", "Arizona, USA", 33.4484, -112.074, "America/Phoenix"],
  ["Los Angeles", "California, USA", 34.0522, -118.2437, "America/Los_Angeles"],
  ["San Francisco", "California, USA", 37.7749, -122.4194, "America/Los_Angeles"],
  ["San Jose", "California, USA", 37.3382, -121.8863, "America/Los_Angeles"],
  ["Fremont", "California, USA", 37.5485, -121.9886, "America/Los_Angeles"],
  ["Seattle", "Washington, USA", 47.6062, -122.3321, "America/Los_Angeles"],
  ["Toronto", "Ontario, Canada", 43.6532, -79.3832, "America/Toronto"],
  ["Brampton", "Ontario, Canada", 43.7315, -79.7624, "America/Toronto"],
  ["Mississauga", "Ontario, Canada", 43.589, -79.6441, "America/Toronto"],
  ["Ottawa", "Ontario, Canada", 45.4215, -75.6972, "America/Toronto"],
  ["Montreal", "Quebec, Canada", 45.5017, -73.5673, "America/Toronto"],
  ["Calgary", "Alberta, Canada", 51.0447, -114.0719, "America/Edmonton"],
  ["Edmonton", "Alberta, Canada", 53.5461, -113.4938, "America/Edmonton"],
  ["Vancouver", "British Columbia, Canada", 49.2827, -123.1207, "America/Vancouver"],
  ["Surrey", "British Columbia, Canada", 49.1913, -122.849, "America/Vancouver"],
  ["Port of Spain", "Trinidad and Tobago", 10.6549, -61.5019, "America/Port_of_Spain"],
  ["Georgetown", "Guyana", 6.8013, -58.1551, "America/Guyana"],
  ["Paramaribo", "Suriname", 5.852, -55.2038, "America/Paramaribo"],
  ["Mexico City", "Mexico", 19.4326, -99.1332, "America/Mexico_City"],
  ["São Paulo", "Brazil", -23.5558, -46.6396, "America/Sao_Paulo"],
  ["Buenos Aires", "Argentina", -34.6037, -58.3816, "America/Argentina/Buenos_Aires"],
];

export interface City {
  name: string;
  region: string;
  lat: number;
  lon: number;
  tz: string;
}

export const cityList: City[] = CITIES.map(([name, region, lat, lon, tz]) => ({ name, region, lat, lon, tz }));

const fold = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function searchCities(query: string, limit = 8): City[] {
  const q = fold(query.trim());
  if (!q) return [];
  const starts: City[] = [];
  const contains: City[] = [];
  for (const c of cityList) {
    const n = fold(c.name);
    if (n.startsWith(q)) starts.push(c);
    else if (n.includes(q) || fold(c.region).includes(q)) contains.push(c);
  }
  return [...starts, ...contains].slice(0, limit);
}

/** Best single match for free text (used by Sakhi in conversation). */
export function findCity(text: string): City | null {
  const t = fold(text);
  let best: City | null = null;
  for (const c of cityList) {
    const n = fold(c.name);
    if (t.includes(n) && (!best || n.length > best.name.length)) best = c;
  }
  if (!best) {
    // common aliases
    const aliases: Record<string, string> = {
      delhi: "New Delhi",
      bombay: "Mumbai",
      calcutta: "Kolkata",
      madras: "Chennai",
      bangalore: "Bengaluru",
      allahabad: "Prayagraj",
      benares: "Varanasi",
      banaras: "Varanasi",
      kashi: "Varanasi",
      gurgaon: "Gurugram",
      baroda: "Vadodara",
      trivandrum: "Thiruvananthapuram",
      cochin: "Kochi",
      mysore: "Mysuru",
      mangalore: "Mangaluru",
      aurangabad: "Chhatrapati Sambhajinagar",
      goa: "Panaji",
      nyc: "New York",
      "bay area": "San Francisco",
      sf: "San Francisco",
      la: "Los Angeles",
    };
    for (const [alias, name] of Object.entries(aliases)) {
      if (new RegExp(`\\b${alias}\\b`).test(t)) return cityList.find((c) => c.name === name) ?? null;
    }
  }
  return best;
}
