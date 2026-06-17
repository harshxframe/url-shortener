export function calculateTTL(days) {
    const expiresAt = new Date();
    
    // Add the input days to the current date
    expiresAt.setDate(expiresAt.getDate() + days);
    
    return expiresAt;
}