/**
 * Calculates a future expiration Date object based on the number of days provided.
 * @param {number} days - Number of days until expiration (e.g., 1, 200, 2000)
 * @returns {Date} - The exact JavaScript Date object when it will expire
 */
export function calculateTTL(days) {
    const expiresAt = new Date();
    
    // Add the input days to the current date
    expiresAt.setDate(expiresAt.getDate() + days);
    
    return expiresAt;
}