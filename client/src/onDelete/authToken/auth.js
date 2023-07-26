export const getAuthToken = async () => {
    const response = await fetch('http://localhost:8800/api/1.0/authToken');
    const data = await response.text();
    return data.trim();
};