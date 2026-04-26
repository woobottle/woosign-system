import { cssifyWebStyles } from '../core/utils/cssifyWebStyles';

describe('cssifyWebStyles', () => {
  it('converts numeric lineHeight pixel values to px strings', () => {
    expect(cssifyWebStyles({ lineHeight: 24 })).toEqual({ lineHeight: '24px' });
    expect(cssifyWebStyles({ lineHeight: 16, fontSize: 12 })).toEqual({
      lineHeight: '16px',
      fontSize: 12,
    });
  });

  it('leaves multiplier-style lineHeight values alone', () => {
    expect(cssifyWebStyles({ lineHeight: 1.5 })).toEqual({ lineHeight: 1.5 });
    expect(cssifyWebStyles({ lineHeight: 1.2 })).toEqual({ lineHeight: 1.2 });
    expect(cssifyWebStyles({ lineHeight: 0 })).toEqual({ lineHeight: 0 });
  });

  it('leaves string lineHeight values alone', () => {
    expect(cssifyWebStyles({ lineHeight: '24px' })).toEqual({ lineHeight: '24px' });
    expect(cssifyWebStyles({ lineHeight: '1.5' })).toEqual({ lineHeight: '1.5' });
  });

  it('does not touch other unitless properties', () => {
    const input = {
      fontWeight: 600,
      opacity: 0.5,
      flexGrow: 1,
      zIndex: 10,
    };
    expect(cssifyWebStyles(input)).toEqual(input);
  });

  it('returns the original reference when no conversion is needed', () => {
    const input = { color: 'red', fontSize: 16 };
    expect(cssifyWebStyles(input)).toBe(input);
  });

  it('handles undefined / null input', () => {
    expect(cssifyWebStyles(undefined)).toBeUndefined();
    expect(cssifyWebStyles(null)).toBeNull();
  });
});
