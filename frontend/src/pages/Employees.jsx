import { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeAPI.getAll();
      setEmployees(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load employees');
      showError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.employee_id.trim()) errors.employee_id = 'Employee ID is required';
    if (!formData.full_name.trim()) errors.full_name = 'Full Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.department.trim()) errors.department = 'Department is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      await employeeAPI.create(formData);
      showSuccess('Employee added successfully');
      setShowModal(false);
      resetForm();
      fetchEmployees();
    } catch (err) {
      if (err.errors) {
        setFormErrors(err.errors);
      }
      showError(err.message || 'Failed to add employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (employeeId, employeeName) => {
    if (!window.confirm(`Are you sure you want to delete ${employeeName}?`)) {
      return;
    }

    try {
      await employeeAPI.delete(employeeId);
      showSuccess(`${employeeName} deleted successfully`);
      fetchEmployees();
    } catch (err) {
      showError(err.message || 'Failed to delete employee');
    }
  };

  const resetForm = () => {
    setFormData({
      employee_id: '',
      full_name: '',
      email: '',
      department: '',
    });
    setFormErrors({});
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Manage your workforce directory</p>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Employee
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-state">
          <p>{error}</p>
          <button className="btn btn-primary mt-4" onClick={fetchEmployees}>
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && employees.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3 className="empty-state-title">No employees yet</h3>
          <p className="empty-state-text">
            Get started by adding your first employee to the system.
          </p>
          <button className="btn btn-primary mt-4" onClick={openModal}>
            Add First Employee
          </button>
        </div>
      )}

      {/* Employee Table */}
      {!loading && !error && employees.length > 0 && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.employee_id}>
                  <td>
                    <div className="employee-info">
                      <div className="employee-avatar">
                        {getInitials(employee.full_name)}
                      </div>
                      <div>
                        <div className="employee-name">{employee.full_name}</div>
                        <div className="employee-email">ID: {employee.employee_id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>
                    <button
                      className="action-link action-link-danger"
                      onClick={() => handleDelete(employee.employee_id, employee.full_name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Employee Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Employee">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Employee ID *</label>
            <input
              type="text"
              name="employee_id"
              className="form-input"
              placeholder="e.g., EMP001"
              value={formData.employee_id}
              onChange={handleInputChange}
            />
            {formErrors.employee_id && <p className="form-error">{formErrors.employee_id}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="full_name"
              className="form-input"
              placeholder="e.g., John Doe"
              value={formData.full_name}
              onChange={handleInputChange}
            />
            {formErrors.full_name && <p className="form-error">{formErrors.full_name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="text"
              name="email"
              className="form-input"
              placeholder="e.g., john.doe@company.com"
              value={formData.email}
              onChange={handleInputChange}
            />
            {formErrors.email && <p className="form-error">{formErrors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Department *</label>
            <select
              name="department"
              className="form-select"
              value={formData.department}
              onChange={handleInputChange}
            >
              <option value="">Select Department</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="Engineering">Engineering</option>
              <option value="Operations">Operations</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
            {formErrors.department && <p className="form-error">{formErrors.department}</p>}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Employees;
