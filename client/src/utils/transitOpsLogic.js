export const VEHICLE_STATUSES = ['Available', 'On Trip', 'In Shop', 'Retired'];
export const DRIVER_STATUSES = ['Available', 'On Trip', 'Off Duty', 'Suspended'];
export const TRIP_STATUSES = ['Draft', 'Dispatched', 'Completed', 'Cancelled'];

export function getAvailableVehiclesForDispatch(vehicles = []) {
  return vehicles.filter((vehicle) => vehicle.status === 'Available');
}

export function getAvailableDriversForDispatch(drivers = []) {
  return drivers.filter((driver) => {
    const licenseValid = new Date(driver.licenseExpiry) > new Date();
    return driver.status === 'Available' && licenseValid;
  });
}

export function validateTripAssignment(trip, vehicle, driver) {
  if (!vehicle || !driver) {
    return { ok: false, message: 'Please select a vehicle and driver.' };
  }

  if (vehicle.status !== 'Available') {
    return { ok: false, message: 'Selected vehicle is not available for dispatch.' };
  }

  if (driver.status !== 'Available') {
    return { ok: false, message: 'Selected driver is not available for dispatch.' };
  }

  if (Number(trip.cargoWeight) > Number(vehicle.capacity)) {
    return { ok: false, message: 'Cargo weight exceeds vehicle capacity.' };
  }

  const licenseValid = new Date(driver.licenseExpiry) > new Date();
  if (!licenseValid) {
    return { ok: false, message: 'Driver license is expired.' };
  }

  return { ok: true, message: 'Trip assignment is valid.' };
}

export function buildFleetSummary(vehicles = [], drivers = [], trips = []) {
  const activeVehicles = vehicles.filter((vehicle) => vehicle.status === 'Available' || vehicle.status === 'On Trip').length;
  const availableVehicles = vehicles.filter((vehicle) => vehicle.status === 'Available').length;
  const maintenanceVehicles = vehicles.filter((vehicle) => vehicle.status === 'In Shop').length;
  const activeTrips = trips.filter((trip) => trip.status === 'Dispatched').length;
  const pendingTrips = trips.filter((trip) => trip.status === 'Draft').length;
  const driversOnDuty = drivers.filter((driver) => driver.status === 'Available' && new Date(driver.licenseExpiry) > new Date()).length;
  const fleetUtilization = vehicles.length ? Math.round((activeVehicles / vehicles.length) * 100) : 0;

  return {
    activeVehicles,
    availableVehicles,
    maintenanceVehicles,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    fleetUtilization,
  };
}

export function calculateTripMetrics(trips = []) {
  const totalDistance = trips.reduce((sum, trip) => sum + Number(trip.distance || 0), 0);
  const totalFuel = trips.reduce((sum, trip) => sum + Number(trip.fuelConsumed || 0), 0);
  const efficiency = totalDistance && totalFuel ? (totalDistance / totalFuel).toFixed(1) : '0.0';

  return { totalDistance, totalFuel, efficiency };
}

export function createSeedData() {
  return {
    vehicles: [
      { id: 1, regNumber: 'VAN-05', name: 'Ford Transit', type: 'Van', capacity: 500, odometer: 12000, acquisitionCost: 42000, status: 'Available', region: 'North' },
      { id: 2, regNumber: 'TRK-12', name: 'Isuzu Truck', type: 'Truck', capacity: 1200, odometer: 26000, acquisitionCost: 78000, status: 'Available', region: 'West' },
      { id: 3, regNumber: 'BUS-22', name: 'Coach Bus', type: 'Bus', capacity: 900, odometer: 45000, acquisitionCost: 98000, status: 'In Shop', region: 'Central' },
    ],
    drivers: [
      { id: 1, name: 'Alex Chen', licenseNumber: 'DL-1001', licenseCategory: 'C', licenseExpiry: '2030-01-01', phone: '555-0101', safetyScore: 92, status: 'Available' },
      { id: 2, name: 'Mina Patel', licenseNumber: 'DL-1002', licenseCategory: 'C', licenseExpiry: '2029-02-01', phone: '555-0102', safetyScore: 88, status: 'Available' },
      { id: 3, name: 'Leo Grant', licenseNumber: 'DL-1003', licenseCategory: 'C', licenseExpiry: '2031-06-30', phone: '555-0103', safetyScore: 95, status: 'On Trip' },
    ],
    trips: [
      { id: 1, title: 'North Depot Delivery', source: 'Lagos', destination: 'Abuja', vehicleId: 1, driverId: 3, cargoWeight: 450, distance: 280, fuelConsumed: 18, status: 'Dispatched' },
    ],
    expenses: [
      { id: 1, vehicleId: 1, type: 'Fuel', amount: 2400, date: '2026-07-10' },
      { id: 2, vehicleId: 1, type: 'Maintenance', amount: 1800, date: '2026-07-11' },
    ],
    maintenance: [
      { id: 1, vehicleId: 3, title: 'Oil Change', status: 'In Progress', notes: 'Preventive service' },
    ],
  };
}
