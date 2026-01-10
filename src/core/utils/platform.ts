/**
 * Platform detection utilities
 */

/**
 * Check if running in web environment
 */
export const isWeb = (): boolean => {
  return (
    typeof globalThis !== 'undefined' &&
    typeof (globalThis as { document?: unknown }).document !== 'undefined'
  );
};

/**
 * Check if running in native environment
 */
export const isNative = (): boolean => {
  return !isWeb();
};

/**
 * Utility function for responsive text scaling
 * Platform-specific implementations will override this
 */
export const scaleFontSize = (size: number): number => {
  // Base implementation - platforms can override
  return size;
};
