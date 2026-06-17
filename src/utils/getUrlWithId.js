/**
 * Generates a full URL using the current request host and a given ID
 * @param {object} req - The Express request object
 * @param {string|number} id - The resource ID
 * @returns {string} - The complete URL string
 */
function getUrlWithId(req, id) {
  // Automatically detects http or https
  const protocol = req.protocol; 
  
  // Gets current host (e.g., 'localhost:3000' or 'yourdomain.com')
  const host = req.get('host'); 
  
  return `${protocol}://${host}/${id}`;
}

export default getUrlWithId;