import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCredentialForm = ({ divisionId }) => {
  const [systemname, setSystemname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAddCredential = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/credential-repository/${divisionId}/add-credential`,
        {
          systemname,
          username,
          password,
        },
        {
          headers: {
            Authorization: localStorage.getItem('Bearer'),
          },
        }
      );

      // Show success toast
      toast.success('Credential added successfully', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Wait for 2 seconds and then refresh the page
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error adding credential:', error);

      // Show error toast
      toast.error('Error adding credential. Please try again.', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add Credential</h3>
      <form>
        <div className="mb-3">
          <label className="form-label">Systemname:</label>
          <input
            type="text"
            className="form-control"
            value={systemname}
            onChange={(e) => setSystemname(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Username:</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="text"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleAddCredential}>
          Add Credential
        </button>
      </form>

      {/* Toast Container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default AddCredentialForm;