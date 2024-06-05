import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateCredentialForm = ({ credentialId }) => {
  const [systemname, setSystemname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUpdateCredential = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/credential/${credentialId}/update`,
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
       // Display success toast
    toast.success('Credential updated successfully');

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (error) {
    console.error('Error updating credential:', error);

    // Display error toast
    toast.error('Error updating credential');
  }
};

  return (
    <div className="mt-3">
      <h3>Update Credential</h3>
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
        <button type="button" className="btn btn-primary" onClick={handleUpdateCredential}>
          Update Credential
        </button>
      </form>
    </div>
  );
};

export default UpdateCredentialForm;