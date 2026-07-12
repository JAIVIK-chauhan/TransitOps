import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoleBadge, getRoleLabel, getRoleNavigation } from '../utils/roleConfig';
import { createSeedData, buildFleetSummary, calculateTripMetrics, getAvailableDriversForDispatch, getAvailableVehiclesForDispatch, validateTripAssignment, VEHICLE_STATUSES, DRIVER_STATUSES, TRIP_STATUSES } from '../utils/transitOpsLogic';
import './Dashboard.css';

const makeId = (items) => (items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1);

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = getRoleLabel(user.role || 'Fleet Manager');
  const badge = getRoleBadge(role);
  const navigation = getRoleNavigation(role);

  const [vehicles, setVehicles] = useState(createSeedData().vehicles);
  const [drivers, setDrivers] = useState(createSeedData().drivers);
  const [trips, setTrips] = useState(createSeedData().trips);
  const [expenses, setExpenses] = useState(createSeedData().expenses);
  const [maintenance, setMaintenance] = useState(createSeedData().maintenance);
  const [form, setForm] = useState({
    vehicle: { regNumber: '', name: '', type: 'Van', capacity: '', odometer: '', acquisitionCost: '', status: 'Available', region: 'North' },
    driver: { name: '', licenseNumber: '', licenseCategory: 'C', licenseExpiry: '', phone: '', safetyScore: '90', status: 'Available' },
    trip: { title: '', source: '', destination: '', vehicleId: '', driverId: '', cargoWeight: '', distance: '', status: 'Draft' },
    maintenanceForm: { vehicleId: '', title: '', notes: '', status: 'Pending' },
    expense: { vehicleId: '', type: 'Fuel', amount: '', date: new Date().toISOString().slice(0, 10) },
  });
  const [feedback, setFeedback] = useState('Fleet operations ready.');

  const summary = useMemo(() => buildFleetSummary(vehicles, drivers, trips), [vehicles, drivers, trips]);
  const tripMetrics = useMemo(() => calculateTripMetrics(trips), [trips]);
  const availableVehicles = useMemo(() => getAvailableVehiclesForDispatch(vehicles), [vehicles]);
  const availableDrivers = useMemo(() => getAvailableDriversForDispatch(drivers), [drivers]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleVehicleSubmit = (event) => {
    event.preventDefault();
    const duplicate = vehicles.some((vehicle) => vehicle.regNumber.toLowerCase() === form.vehicle.regNumber.toLowerCase());
    if (duplicate) {
      setFeedback('Vehicle registration number must be unique.');
      return;
    }

    const newVehicle = {
      id: makeId(vehicles),
      regNumber: form.vehicle.regNumber,
      name: form.vehicle.name,
      type: form.vehicle.type,
      capacity: Number(form.vehicle.capacity),
      odometer: Number(form.vehicle.odometer),
      acquisitionCost: Number(form.vehicle.acquisitionCost),
      status: form.vehicle.status,
      region: form.vehicle.region,
    };
    setVehicles((prev) => [...prev, newVehicle]);
    setFeedback(`Vehicle ${newVehicle.regNumber} registered.`);
    setForm((prev) => ({ ...prev, vehicle: { ...prev.vehicle, regNumber: '', name: '', capacity: '', odometer: '', acquisitionCost: '' } }));
  };

  const handleDriverSubmit = (event) => {
    event.preventDefault();
    const newDriver = {
      id: makeId(drivers),
      name: form.driver.name,
      licenseNumber: form.driver.licenseNumber,
      licenseCategory: form.driver.licenseCategory,
      licenseExpiry: form.driver.licenseExpiry,
      phone: form.driver.phone,
      safetyScore: Number(form.driver.safetyScore),
      status: form.driver.status,
    };
    setDrivers((prev) => [...prev, newDriver]);
    setFeedback(`Driver ${newDriver.name} added.`);
    setForm((prev) => ({ ...prev, driver: { ...prev.driver, name: '', licenseNumber: '', phone: '', licenseExpiry: '', safetyScore: '90' } }));
  };

  const handleTripSubmit = (event) => {
    event.preventDefault();
    const vehicle = vehicles.find((item) => item.id === Number(form.trip.vehicleId));
    const driver = drivers.find((item) => item.id === Number(form.trip.driverId));
    const validation = validateTripAssignment({ cargoWeight: Number(form.trip.cargoWeight) }, vehicle, driver);
    if (!validation.ok) {
      setFeedback(validation.message);
      return;
    }

    const newTrip = {
      id: makeId(trips),
      title: form.trip.title || `Trip ${makeId(trips)}`,
      source: form.trip.source,
      destination: form.trip.destination,
      vehicleId: Number(form.trip.vehicleId),
      driverId: Number(form.trip.driverId),
      cargoWeight: Number(form.trip.cargoWeight),
      distance: Number(form.trip.distance),
      fuelConsumed: 0,
      status: form.trip.status,
    };

    setTrips((prev) => [...prev, newTrip]);
    setVehicles((prev) => prev.map((item) => item.id === newTrip.vehicleId ? { ...item, status: 'On Trip' } : item));
    setDrivers((prev) => prev.map((item) => item.id === newTrip.driverId ? { ...item, status: 'On Trip' } : item));
    setFeedback(`Trip ${newTrip.title} dispatched.`);
    setForm((prev) => ({ ...prev, trip: { ...prev.trip, title: '', source: '', destination: '', vehicleId: '', driverId: '', cargoWeight: '', distance: '', status: 'Draft' } }));
  };

  const handleTripStatus = (tripId, nextStatus) => {
    const trip = trips.find((item) => item.id === tripId);
    if (!trip) return;
    setTrips((prev) => prev.map((item) => item.id === tripId ? { ...item, status: nextStatus } : item));
    if (nextStatus === 'Completed' || nextStatus === 'Cancelled') {
      setVehicles((prev) => prev.map((item) => item.id === trip.vehicleId ? { ...item, status: 'Available' } : item));
      setDrivers((prev) => prev.map((item) => item.id === trip.driverId ? { ...item, status: 'Available' } : item));
    }
    setFeedback(`Trip ${trip.title} marked ${nextStatus}.`);
  };

  const handleMaintenanceSubmit = (event) => {
    event.preventDefault();
    const newMaintenance = {
      id: makeId(maintenance),
      vehicleId: Number(form.maintenanceForm.vehicleId),
      title: form.maintenanceForm.title,
      notes: form.maintenanceForm.notes,
      status: form.maintenanceForm.status,
    };
    setMaintenance((prev) => [...prev, newMaintenance]);
    setVehicles((prev) => prev.map((item) => item.id === newMaintenance.vehicleId ? { ...item, status: 'In Shop' } : item));
    setFeedback(`Maintenance log for vehicle ${newMaintenance.vehicleId} created.`);
    setForm((prev) => ({ ...prev, maintenanceForm: { vehicleId: '', title: '', notes: '', status: 'Pending' } }));
  };

  const handleExpenseSubmit = (event) => {
    event.preventDefault();
    const newExpense = { id: makeId(expenses), vehicleId: Number(form.expense.vehicleId), type: form.expense.type, amount: Number(form.expense.amount), date: form.expense.date };
    setExpenses((prev) => [...prev, newExpense]);
    setFeedback(`Expense logged for vehicle ${newExpense.vehicleId}.`);
    setForm((prev) => ({ ...prev, expense: { ...prev.expense, vehicleId: '', amount: '', date: new Date().toISOString().slice(0, 10) } }));
  };

  const exportCsv = () => {
    const rows = [
      ['Id', 'Title', 'Source', 'Destination', 'Status', 'Vehicle', 'Driver'],
      ...trips.map((trip) => [trip.id, trip.title, trip.source, trip.destination, trip.status, trip.vehicleId, trip.driverId]),
    ];
    const csv = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transitops-trips.csv';
    link.click();
  };

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">TO</div>
          <div><h2>TransitOps</h2><p>Operations Command</p></div>
        </div>
        <div className="sidebar-section">
          <p className="sidebar-label">Workspace</p>
          {navigation.map((item) => <button key={item.label} className="sidebar-link"><span>{item.label}</span></button>)}
        </div>
        <div className="sidebar-card">
          <p className="sidebar-label">Current Access</p>
          <div className={`role-pill role-${badge}`}>{role}</div>
          <p className="sidebar-meta">Fleet, dispatch, maintenance, and finance in one control tower.</p>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Smart Transport Operations Platform</p>
            <h1>Welcome back, {user.name || 'Operator'}.</h1>
          </div>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </header>

        <section className="hero-panel">
          <div>
            <p className="hero-kicker">Mission control</p>
            <h2>Digitize dispatch, maintenance, fuel, and expense oversight without leaving the dashboard.</h2>
            <p className="hero-copy">Business rules are enforced in the UI so vehicles, drivers, and trips stay compliant.</p>
          </div>
          <div className="hero-badge">Live • {feedback}</div>
        </section>

        <section className="stats-grid">
          {[
            { label: 'Active Vehicles', value: summary.activeVehicles, delta: 'On trip' },
            { label: 'Available Vehicles', value: summary.availableVehicles, delta: 'Ready to dispatch' },
            { label: 'Maintenance', value: summary.maintenanceVehicles, delta: 'In shop' },
            { label: 'Active Trips', value: summary.activeTrips, delta: 'Dispatched' },
            { label: 'Pending Trips', value: summary.pendingTrips, delta: 'Draft' },
            { label: 'Drivers On Duty', value: summary.driversOnDuty, delta: 'On trip' },
            { label: 'Fleet Utilization', value: `${summary.fleetUtilization}%`, delta: 'Utilization' },
            { label: 'Fuel Efficiency', value: `${tripMetrics.efficiency} km/L`, delta: 'Trip average' },
          ].map((card) => <article key={card.label} className="stat-card"><p>{card.label}</p><h3>{card.value}</h3><span>{card.delta}</span></article>)}
        </section>

        <section className="content-grid">
          <article className="panel-card">
            <div className="panel-heading"><h3>Vehicle Registry</h3><span>Unique registration enforced</span></div>
            <form onSubmit={handleVehicleSubmit} className="stack-form">
              <input placeholder="Registration Number" value={form.vehicle.regNumber} onChange={(e) => setForm((prev) => ({ ...prev, vehicle: { ...prev.vehicle, regNumber: e.target.value } }))} required />
              <input placeholder="Vehicle Name/Model" value={form.vehicle.name} onChange={(e) => setForm((prev) => ({ ...prev, vehicle: { ...prev.vehicle, name: e.target.value } }))} required />
              <input placeholder="Type" value={form.vehicle.type} onChange={(e) => setForm((prev) => ({ ...prev, vehicle: { ...prev.vehicle, type: e.target.value } }))} />
              <input placeholder="Capacity (kg)" type="number" value={form.vehicle.capacity} onChange={(e) => setForm((prev) => ({ ...prev, vehicle: { ...prev.vehicle, capacity: e.target.value } }))} required />
              <input placeholder="Odometer" type="number" value={form.vehicle.odometer} onChange={(e) => setForm((prev) => ({ ...prev, vehicle: { ...prev.vehicle, odometer: e.target.value } }))} required />
              <input placeholder="Acquisition Cost" type="number" value={form.vehicle.acquisitionCost} onChange={(e) => setForm((prev) => ({ ...prev, vehicle: { ...prev.vehicle, acquisitionCost: e.target.value } }))} required />
              <select value={form.vehicle.status} onChange={(e) => setForm((prev) => ({ ...prev, vehicle: { ...prev.vehicle, status: e.target.value } }))}>{VEHICLE_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select>
              <button type="submit" className="primary-button">Register Vehicle</button>
            </form>
            <div className="list-block">
              {vehicles.map((vehicle) => <div key={vehicle.id} className="list-item"><strong>{vehicle.regNumber}</strong> <span>{vehicle.name} • {vehicle.status}</span></div>)}
            </div>
          </article>

          <article className="panel-card">
            <div className="panel-heading"><h3>Driver Registry</h3><span>License and safety tracking</span></div>
            <form onSubmit={handleDriverSubmit} className="stack-form">
              <input placeholder="Driver Name" value={form.driver.name} onChange={(e) => setForm((prev) => ({ ...prev, driver: { ...prev.driver, name: e.target.value } }))} required />
              <input placeholder="License Number" value={form.driver.licenseNumber} onChange={(e) => setForm((prev) => ({ ...prev, driver: { ...prev.driver, licenseNumber: e.target.value } }))} required />
              <input placeholder="Phone" value={form.driver.phone} onChange={(e) => setForm((prev) => ({ ...prev, driver: { ...prev.driver, phone: e.target.value } }))} />
              <input placeholder="License Expiry" type="date" value={form.driver.licenseExpiry} onChange={(e) => setForm((prev) => ({ ...prev, driver: { ...prev.driver, licenseExpiry: e.target.value } }))} required />
              <input placeholder="Safety Score" type="number" value={form.driver.safetyScore} onChange={(e) => setForm((prev) => ({ ...prev, driver: { ...prev.driver, safetyScore: e.target.value } }))} required />
              <select value={form.driver.status} onChange={(e) => setForm((prev) => ({ ...prev, driver: { ...prev.driver, status: e.target.value } }))}>{DRIVER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select>
              <button type="submit" className="primary-button">Add Driver</button>
            </form>
            <div className="list-block">
              {drivers.map((driver) => <div key={driver.id} className="list-item"><strong>{driver.name}</strong> <span>Score {driver.safetyScore} • {driver.status}</span></div>)}
            </div>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel-card">
            <div className="panel-heading"><h3>Trip Dispatch</h3><span>Capacity and availability rules</span></div>
            <form onSubmit={handleTripSubmit} className="stack-form">
              <input placeholder="Trip Title" value={form.trip.title} onChange={(e) => setForm((prev) => ({ ...prev, trip: { ...prev.trip, title: e.target.value } }))} required />
              <input placeholder="Source" value={form.trip.source} onChange={(e) => setForm((prev) => ({ ...prev, trip: { ...prev.trip, source: e.target.value } }))} required />
              <input placeholder="Destination" value={form.trip.destination} onChange={(e) => setForm((prev) => ({ ...prev, trip: { ...prev.trip, destination: e.target.value } }))} required />
              <select value={form.trip.vehicleId} onChange={(e) => setForm((prev) => ({ ...prev, trip: { ...prev.trip, vehicleId: e.target.value } }))} required>
                <option value="">Select Vehicle</option>
                {availableVehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.regNumber}</option>)}
              </select>
              <select value={form.trip.driverId} onChange={(e) => setForm((prev) => ({ ...prev, trip: { ...prev.trip, driverId: e.target.value } }))} required>
                <option value="">Select Driver</option>
                {availableDrivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name}</option>)}
              </select>
              <input placeholder="Cargo Weight" type="number" value={form.trip.cargoWeight} onChange={(e) => setForm((prev) => ({ ...prev, trip: { ...prev.trip, cargoWeight: e.target.value } }))} required />
              <input placeholder="Distance" type="number" value={form.trip.distance} onChange={(e) => setForm((prev) => ({ ...prev, trip: { ...prev.trip, distance: e.target.value } }))} required />
              <select value={form.trip.status} onChange={(e) => setForm((prev) => ({ ...prev, trip: { ...prev.trip, status: e.target.value } }))}>{TRIP_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select>
              <button type="submit" className="primary-button">Create Trip</button>
            </form>
            <div className="list-block">
              {trips.map((trip) => <div key={trip.id} className="list-item"><strong>{trip.title}</strong> <span>{trip.status} • {trip.source} → {trip.destination}</span><div className="row-actions">{trip.status === 'Dispatched' ? <button onClick={() => handleTripStatus(trip.id, 'Completed')}>Complete</button> : <button onClick={() => handleTripStatus(trip.id, 'Dispatched')}>Dispatch</button>}<button onClick={() => handleTripStatus(trip.id, 'Cancelled')}>Cancel</button></div></div>)}
            </div>
          </article>

          <article className="panel-card">
            <div className="panel-heading"><h3>Maintenance & Expenses</h3><span>Operational cost tracking</span></div>
            <form onSubmit={handleMaintenanceSubmit} className="stack-form">
              <input placeholder="Maintenance Title" value={form.maintenanceForm.title} onChange={(e) => setForm((prev) => ({ ...prev, maintenanceForm: { ...prev.maintenanceForm, title: e.target.value } }))} required />
              <select value={form.maintenanceForm.vehicleId} onChange={(e) => setForm((prev) => ({ ...prev, maintenanceForm: { ...prev.maintenanceForm, vehicleId: e.target.value } }))} required>
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.regNumber}</option>)}
              </select>
              <input placeholder="Notes" value={form.maintenanceForm.notes} onChange={(e) => setForm((prev) => ({ ...prev, maintenanceForm: { ...prev.maintenanceForm, notes: e.target.value } }))} />
              <select value={form.maintenanceForm.status} onChange={(e) => setForm((prev) => ({ ...prev, maintenanceForm: { ...prev.maintenanceForm, status: e.target.value } }))}><option value="Pending">Pending</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option></select>
              <button type="submit" className="primary-button">Log Maintenance</button>
            </form>
            <form onSubmit={handleExpenseSubmit} className="stack-form">
              <select value={form.expense.vehicleId} onChange={(e) => setForm((prev) => ({ ...prev, expense: { ...prev.expense, vehicleId: e.target.value } }))} required>
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.regNumber}</option>)}
              </select>
              <input placeholder="Type" value={form.expense.type} onChange={(e) => setForm((prev) => ({ ...prev, expense: { ...prev.expense, type: e.target.value } }))} />
              <input placeholder="Amount" type="number" value={form.expense.amount} onChange={(e) => setForm((prev) => ({ ...prev, expense: { ...prev.expense, amount: e.target.value } }))} required />
              <input placeholder="Date" type="date" value={form.expense.date} onChange={(e) => setForm((prev) => ({ ...prev, expense: { ...prev.expense, date: e.target.value } }))} />
              <button type="submit" className="primary-button">Log Expense</button>
            </form>
            <button className="primary-button" onClick={exportCsv}>Export CSV</button>
            <div className="list-block">
              {expenses.map((expense) => <div key={expense.id} className="list-item"><strong>{expense.type}</strong> <span>{expense.amount} • {expense.date}</span></div>)}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
