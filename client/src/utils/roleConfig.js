export const ROLE_OPTIONS = [
  'Admin',
  'Fleet Manager',
  'Safety Officer',
  'Financial Analyst',
  'Driver',
];

const roleNavigationMap = {
  Admin: [
    { label: 'Overview', icon: 'LayoutGrid' },
    { label: 'Fleet Control', icon: 'Bus' },
    { label: 'Trips', icon: 'Map' },
    { label: 'Finance', icon: 'Wallet' },
    { label: 'Reports', icon: 'BarChart3' },
  ],
  'Fleet Manager': [
    { label: 'Overview', icon: 'LayoutGrid' },
    { label: 'Fleet Control', icon: 'Bus' },
    { label: 'Trips', icon: 'Map' },
    { label: 'Maintenance', icon: 'Wrench' },
  ],
  'Safety Officer': [
    { label: 'Overview', icon: 'LayoutGrid' },
    { label: 'Compliance', icon: 'ShieldCheck' },
    { label: 'Driver Safety', icon: 'UserCheck' },
    { label: 'Incidents', icon: 'AlertTriangle' },
  ],
  'Financial Analyst': [
    { label: 'Overview', icon: 'LayoutGrid' },
    { label: 'Finance', icon: 'Wallet' },
    { label: 'Expenses', icon: 'Receipt' },
    { label: 'Reports', icon: 'BarChart3' },
  ],
  Driver: [
    { label: 'Overview', icon: 'LayoutGrid' },
    { label: 'My Trips', icon: 'Map' },
    { label: 'Documents', icon: 'FileText' },
  ],
};

export function getRoleNavigation(role) {
  return roleNavigationMap[role] || roleNavigationMap['Fleet Manager'];
}

export function getRoleLabel(role) {
  return role || 'Fleet Manager';
}

export function getRoleBadge(role) {
  const badges = {
    Admin: 'admin',
    'Fleet Manager': 'manager',
    'Safety Officer': 'safety',
    'Financial Analyst': 'finance',
    Driver: 'driver',
  };
  return badges[role] || 'manager';
}
