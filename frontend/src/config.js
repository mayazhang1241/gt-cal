// API Configuration
// This will automatically use the right URL based on environment

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default API_BASE_URL;

