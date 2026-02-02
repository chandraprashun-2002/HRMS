import { useState, useEffect } from 'react';
import { attendanceAPI, employeeAPI } from '../services/api';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';

function Attendance() {
    const [attendance, setAttendance] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filterEmployee, setFilterEmployee] = useState('');
    const [formData, setFormData] = useState({
        employee: '',
        employee_name: '',
        date: '',
        status: 'Present',
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const { showSuccess, showError } = useToast();

    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, []);

    // Re-fetch attendance when filter changes
    useEffect(() => {
        fetchAttendance();
    }, [filterEmployee]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch both employees and attendance
            const [empResponse, attResponse] = await Promise.all([
                employeeAPI.getAll(),
                attendanceAPI.getAll(),
            ]);

            setEmployees(empResponse.data || []);
            setAttendance(attResponse.data || []);
        } catch (err) {
            setError(err.message || 'Failed to load data');
            showError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendance = async () => {
        try {
            let response;
            if (filterEmployee) {
                response = await attendanceAPI.getByEmployee(filterEmployee);
            } else {
                response = await attendanceAPI.getAll();
            }
            setAttendance(response.data || []);
        } catch (err) {
            showError('Failed to filter attendance');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // If employee is selected, auto-fill employee_name
        if (name === 'employee') {
            const selectedEmployee = employees.find(emp => emp.employee_id === value);
            setFormData(prev => ({
                ...prev,
                employee: value,
                employee_name: selectedEmployee ? selectedEmployee.full_name : '',
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Clear error when user types
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.employee) errors.employee = 'Please select an employee';
        if (!formData.date) errors.date = 'Please select a date';
        if (!formData.status) errors.status = 'Please select status';
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
            await attendanceAPI.create(formData);
            showSuccess('Attendance marked successfully');
            setShowModal(false);
            resetForm();
            fetchAttendance();
        } catch (err) {
            if (err.errors) {
                setFormErrors(err.errors);
            }
            showError(err.message || 'Failed to mark attendance');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            employee: '',
            employee_name: '',
            date: '',
            status: 'Present',
        });
        setFormErrors({});
    };

    const openModal = () => {
        resetForm();
        // Set default date to today
        setFormData(prev => ({
            ...prev,
            date: new Date().toISOString().split('T')[0],
        }));
        setShowModal(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            weekday: 'short',
        });
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
                    <h1 className="page-title">Attendance</h1>
                    <p className="page-subtitle">Track daily attendance records</p>
                </div>
                <button className="btn btn-primary" onClick={openModal}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    Mark Attendance
                </button>
            </div>

            {/* Filter */}
            {employees.length > 0 && (
                <div className="mb-4">
                    <select
                        className="form-select"
                        style={{ maxWidth: '300px' }}
                        value={filterEmployee}
                        onChange={(e) => setFilterEmployee(e.target.value)}
                    >
                        <option value="">All Employees</option>
                        {employees.map(emp => (
                            <option key={emp.employee_id} value={emp.employee_id}>
                                {emp.full_name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

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
                    <button className="btn btn-primary mt-4" onClick={fetchData}>
                        Try Again
                    </button>
                </div>
            )}

            {/* No Employees State */}
            {!loading && !error && employees.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-icon">👥</div>
                    <h3 className="empty-state-title">No employees found</h3>
                    <p className="empty-state-text">
                        Please add employees first before marking attendance.
                    </p>
                </div>
            )}

            {/* Empty Attendance State */}
            {!loading && !error && employees.length > 0 && attendance.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <h3 className="empty-state-title">No attendance records</h3>
                    <p className="empty-state-text">
                        {filterEmployee
                            ? 'No attendance records found for the selected employee.'
                            : 'Start marking attendance for your employees.'}
                    </p>
                    <button className="btn btn-primary mt-4" onClick={openModal}>
                        Mark First Attendance
                    </button>
                </div>
            )}

            {/* Attendance Table */}
            {!loading && !error && attendance.length > 0 && (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((record) => (
                                <tr key={record.id}>
                                    <td>
                                        <div className="employee-info">
                                            <div className="employee-avatar">
                                                {getInitials(record.employee_name)}
                                            </div>
                                            <div>
                                                <div className="employee-name">{record.employee_name}</div>
                                                <div className="employee-email">ID: {record.employee}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{formatDate(record.date)}</td>
                                    <td>
                                        <span className={`badge ${record.status === 'Present' ? 'badge-present' : 'badge-absent'}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Mark Attendance Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Mark Attendance">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Employee *</label>
                        <select
                            name="employee"
                            className="form-select"
                            value={formData.employee}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp.employee_id} value={emp.employee_id}>
                                    {emp.full_name} ({emp.employee_id})
                                </option>
                            ))}
                        </select>
                        {formErrors.employee && <p className="form-error">{formErrors.employee}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Date *</label>
                        <input
                            type="date"
                            name="date"
                            className="form-input"
                            value={formData.date}
                            onChange={handleInputChange}
                        />
                        {formErrors.date && <p className="form-error">{formErrors.date}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Status *</label>
                        <select
                            name="status"
                            className="form-select"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                        </select>
                        {formErrors.status && <p className="form-error">{formErrors.status}</p>}
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
                            {submitting ? 'Saving...' : 'Mark Attendance'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Attendance;
