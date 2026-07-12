import { getAvailableVehiclesForDispatch, getAvailableDriversForDispatch, validateTripAssignment, buildFleetSummary } from './transitOpsLogic';

describe('transitOpsLogic', () => {
  const vehicles = [
    { id: 1, regNumber: 'V-001', status: 'Available', capacity: 500 },
    { id: 2, regNumber: 'V-002', status: 'In Shop', capacity: 700 },
    { id: 3, regNumber: 'V-003', status: 'Retired', capacity: 600 },
  ];

  const drivers = [
    { id: 1, name: 'Alex', status: 'Available', licenseExpiry: '2030-01-01' },
    { id: 2, name: 'Mina', status: 'Suspended', licenseExpiry: '2030-01-01' },
    { id: 3, name: 'Leo', status: 'Available', licenseExpiry: '2020-01-01' },
  ];

  it('filters vehicles that are eligible for dispatch', () => {
    expect(getAvailableVehiclesForDispatch(vehicles).map((vehicle) => vehicle.id)).toEqual([1]);
  });

  it('filters drivers that are eligible for dispatch', () => {
    expect(getAvailableDriversForDispatch(drivers).map((driver) => driver.id)).toEqual([1]);
  });

  it('rejects over-capacity trips', () => {
    const result = validateTripAssignment({ cargoWeight: 600 }, vehicles[0], drivers[0]);
    expect(result.ok).toBe(false);
    expect(result.message).toContain('capacity');
  });

  it('builds fleet summary counts correctly', () => {
    const summary = buildFleetSummary(vehicles, drivers, [{ status: 'Dispatched' }, { status: 'Draft' }]);
    expect(summary.activeVehicles).toBe(1);
    expect(summary.availableVehicles).toBe(1);
    expect(summary.activeTrips).toBe(1);
    expect(summary.pendingTrips).toBe(1);
    expect(summary.driversOnDuty).toBe(1);
  });
});
