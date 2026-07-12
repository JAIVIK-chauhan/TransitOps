import { getRoleNavigation, getRoleBadge, getRoleLabel } from './roleConfig';

describe('roleConfig', () => {
  it('returns admin navigation items for the admin role', () => {
    const navigation = getRoleNavigation('Admin');
    expect(navigation).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Overview' }),
        expect.objectContaining({ label: 'Fleet Control' }),
      ])
    );
  });

  it('returns a human-friendly role label and badge', () => {
    expect(getRoleLabel('Fleet Manager')).toBe('Fleet Manager');
    expect(getRoleBadge('Safety Officer')).toBe('safety');
  });
});
