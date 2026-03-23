import API_BASE_URL from '../config/api';

/**
 * Enhanced fetch wrapper that:
 * 1. Automatically includes Authorization header if user token exists
 * 2. Handles 401 Unauthorized (redirect to login)
 * 3. Handles 403 Forbidden (show error message)
 * 4. Merges headers intelligently
 */
const authenticatedFetch = async (url, options = {}) => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = user?.token;

    // Build headers
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    // If it's a FormData request (like file upload), don't set Content-Type
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);

        if (response.status === 401) {
            console.error('Unauthorized access - redirecting to login');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return response;
        }

        if (response.status === 403) {
            console.error('Forbidden - Access Denied');
            // We return the response so the UI can show a specific message if needed
            return response;
        }

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export default authenticatedFetch;
