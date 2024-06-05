import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [ous, setOus] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [selectedOU, setSelectedOU] = useState("");
  const [linkedDivisions, setLinkedDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [isOpenRoleModal, setOpenRoleModal] = useState(false);  // Added this line
  const [selectedRole, setSelectedRole] = useState("");  // Added this line
  const [allRoles, setAllRoles] = useState([]);  // Added this line

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the list of users from the backend
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: localStorage.getItem("Bearer"),
          },
        });

        // Fetch all roles from the backend
        const rolesResponse = await axios.get("http://localhost:5000/api/roles");

        // Update the state with the fetched data
        setUsers(response.data.users);
        setDivisions(response.data.divisions);
        setOus(response.data.ous);
        setRoles(response.data.roles);
        setAllRoles(rolesResponse.data);  // Added this line
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddOrgUnitClick = (userId) => {
    setSelectedUserId(userId);
    setOpen(true);
  };

  const handleOUChange = async (ouName) => {
    try {
      setSelectedOU(ouName);
      // Fetch linked divisions based on OU
      const response = await axios.get(
        `http://localhost:5000/api/divisions/${ouName}`
      );
      setLinkedDivisions(response.data);
    } catch (error) {
      console.error("Error fetching linked divisions:", error);
    }
  };

  const handleAddDivision = async () => {
    try {
      // Send a request to add the division to the user
      await axios.post(`http://localhost:5000/api/users/${selectedUserId}/add-division`, {
        divisionId: selectedDivision,
      });

      // Display a success toast notification
      toast.success("Division added successfully!");

      // Close the modal after successful addition
      setOpen(false);

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error adding division to user:", error);
      // Display an error toast notification
      toast.error("Error adding division. Please try again.");
    }
  };

  const handleRoleClick = (userId) => {  // Added this function
    setSelectedUserId(userId);
    setOpenRoleModal(true);
  };

  const handleUpdateRole = async () => {
    try {
      // Send a request to update the user's role
      await axios.put(`http://localhost:5000/api/users/${selectedUserId}/update-role`, {
        role: selectedRole,
      });

      // Display a success toast notification
      toast.success("Role updated successfully!");

      // Close the role modal after successful update
      setOpenRoleModal(false);

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error updating user role:", error);
      // Display an error toast notification
      toast.error("Error updating user role. Please try again.");
    }
  };

  const handleDeleteDivision = async (userId, divisionId) => {
    try {
      // Send a request to remove the division from the user
      await axios.delete(`http://localhost:5000/api/users/${userId}/remove-division/${divisionId}`, {
        headers: {
          Authorization: localStorage.getItem("Bearer"),
        },
      });
  
      // Display a success toast notification
      toast.success("Division removed successfully!");
  
      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error removing division from user:", error);
      // Display an error toast notification
      toast.error("Error removing division. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">User List</h2>
      {users.map((user) => {
        const role = roles.find((r) => r.roleId === user.role);
        return (
          <div key={user._id} className="mb-4">
            <h3>
              {user.username} -
              <span
                className="badge bg-secondary me-2 clickable-badge"
                onClick={() => handleRoleClick(user._id)}
              >
                {role ? role.rolename + " " : "Unknown Role "}
                - Edit
              </span>
              <button className="btn btn-outline-primary" onClick={() => handleAddOrgUnitClick(user._id)}>
                Add Org Unit
              </button>
            </h3>
            <ul className="list-unstyled">
              {user.divisions.map((divisionId) => {
                const division = divisions.find(
                  (div) => div._id === divisionId
                );

                if (!division) {
                  return null; // Skip rendering if division is not found
                }

                const divOU = ous.find((ou) => ou._id === division.ou);

                return (
                  <li key={division._id} className="mb-2">
                      <div>
                        <span className="badge bg-secondary me-2">
                          {division ? division.name : "Unknown Division"}
                        </span>
                        <span className="badge bg-info">
                          {divOU ? divOU.name : "Unknown Division"}
                        </span>
                      </div>
                      <button className="btn btn-danger mt-2" onClick={() => handleDeleteDivision(user._id, division._id)}>
                        Delete
                      </button>
                    </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {/* Modal */}
      <div className={`modal ${isOpen ? "show" : ""}`} tabIndex="-1" role="dialog" style={{ display: isOpen ? "block" : "none" }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Org Unit</h5>
              <button type="button" className="btn-close" onClick={() => setOpen(false)}></button>
            </div>
            <div className="modal-body">
              {/* OU Dropdown */}
              <div className="mb-3">
                <label className="form-label">Organisational Unit</label>
                <select
                  className="form-select"
                  value={selectedOU}
                  onChange={(e) => handleOUChange(e.target.value)}
                >
                  <option value="">Select an OU</option>
                  {ous.map((ou) => (
                    <option key={ou._id} value={ou.name}>
                      {ou.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Division Dropdown */}
              <div className="mb-3">
                <label className="form-label">Division</label>
                <select
                  className="form-select"
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  disabled={!selectedOU}
                >
                  <option value="">Select a Division</option>
                  {linkedDivisions.map((division) => (
                    <option key={division._id} value={division._id}>
                      {division.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={handleAddDivision}>
                Add Division
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Role Edit Modal */}
      <div className={`modal ${isOpenRoleModal ? "show" : ""}`} tabIndex="-1" role="dialog" style={{ display: isOpenRoleModal ? "block" : "none" }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit User Role</h5>
              <button type="button" className="btn-close" onClick={() => setOpenRoleModal(false)}></button>
            </div>
            <div className="modal-body">
              {/* Role Dropdown */}
              <div className="mb-3">
                <label className="form-label">Select Role</label>
                <select
                  className="form-select"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">Select a Role</option>
                  {allRoles.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.rolename}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={handleUpdateRole}>
                Update Role
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setOpenRoleModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default UserList;