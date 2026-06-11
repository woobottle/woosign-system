import {shouldDismiss} from '../components/BottomSheet/dismiss';

describe('shouldDismiss', () => {
  it('closes when drag exceeds 25% of sheet height', () => {
    expect(shouldDismiss(101, 0, 400)).toBe(true);
  });

  it('stays open when drag is at or under 25%', () => {
    expect(shouldDismiss(100, 0, 400)).toBe(false);
    expect(shouldDismiss(99, 0, 400)).toBe(false);
  });

  it('closes on fast flick past the minimum distance', () => {
    expect(shouldDismiss(30, 0.6, 400)).toBe(true);
  });

  it('ignores a fast flick under the minimum distance', () => {
    expect(shouldDismiss(10, 2, 400)).toBe(false);
  });

  it('stays open on a slow release under both thresholds', () => {
    expect(shouldDismiss(30, 0.3, 400)).toBe(false);
  });

  it('stays open at the exact velocity threshold (strict comparison)', () => {
    expect(shouldDismiss(30, 0.5, 400)).toBe(false);
  });

  it('falls back to an absolute distance when height is unmeasured', () => {
    expect(shouldDismiss(121, 0, 0)).toBe(true);
    expect(shouldDismiss(119, 0, 0)).toBe(false);
  });
});
