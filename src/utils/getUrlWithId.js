function getUrlWithId(req, id) {
  // Automatically detects http or https
  const protocol = req.protocol; 
  
  // Gets current host (e.g., 'localhost:3000' or 'yourdomain.com')
  const host = req.get('host'); 
  
  return `${protocol}://${host}/${id}`;
}

export default getUrlWithId;