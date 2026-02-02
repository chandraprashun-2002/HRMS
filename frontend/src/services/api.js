// API Service - using fetch (no axios)
const API_BASE_URL = 'http://localhost:8000/api';

// Generic fetch wrapper with error handling
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'An error occurred',
        errors: data.errors || {},
      };
    }
    
    return data;
  } catch (error) {
    if (error.status) {
      throw error;
    }
    throw {
      status: 500,
      message: 'Network error. Please check your connection.',
      errors: {},
    };
  }
}

// Employee API
export const employeeAPI = {
  // Get all employees
  getAll: async () => {
    return fetchAPI('/employees/');
  },

  // Get single employee
  getById: async (employeeId) => {
    return fetchAPI(`/employees/${employeeId}/`);
  },

  // Create employee
  create: async (employeeData) => {
    return fetchAPI('/employees/', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  },

  // Delete employee
  delete: async (employeeId) => {
    return fetchAPI(`/employees/${employeeId}/`, {
      method: 'DELETE',
    });
  },
};

// Attendance API
export const attendanceAPI = {
  // Get all attendance records
  getAll: async () => {
    return fetchAPI('/attendance/');
  },

  // Get attendance by employee
  getByEmployee: async (employeeId) => {
    return fetchAPI(`/attendance/?employee_id=${employeeId}`);
  },

  // Mark attendance
  create: async (attendanceData) => {
    return fetchAPI('/attendance/', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  },
};
