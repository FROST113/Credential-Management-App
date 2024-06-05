import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import UpdateCredentialForm from './UpdateCredentialForm';
import AddCredentialForm from './AddCredentialForm';


const UserDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [editingCredentialId, setEditingCredentialId] = useState(null);
  const [showAddCredentialForm, setShowAddCredentialForm] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get('http://localhost:5000/api/user-data', {
          headers: {
            Authorization: localStorage.getItem('Bearer'),
          },
        });
        console.log('User Data:', userResponse.data);
        setUserData(userResponse.data);

        // Fetch credentials for each division
        const divisionCredentials = await Promise.all(
          userResponse.data.divisions.map(async (divisionId) => {
            const credentialsResponse = await axios.get(`http://localhost:5000/api/credential-repository/${divisionId}`, {
              headers: {
                Authorization: localStorage.getItem('Bearer'),
              },
            });
            return credentialsResponse.data;
          })
        );

        // Flatten the array of objects into a single array
        const allCredentials = divisionCredentials.flat();
        console.log('All Credentials:', allCredentials);
        setCredentials(allCredentials);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEditCredential = (credentialId) => {
    setEditingCredentialId(credentialId);
  };

  const handleToggleAddCredentialForm = () => {
    setShowAddCredentialForm(!showAddCredentialForm);
  };

  const handleViewUsers = () => {
    navigate('/UserList');
  };
  
  return (
    <div className="container mt-5">
      <h2>User Dashboard</h2>
      {userData && (
        <>
          <h3>Welcome, {userData.username}!</h3>
          <p>Role: {userData.role}</p>
          {userData.role === 'Admin' && (
            <>
              <button className="btn btn-primary" onClick={handleViewUsers}>
                View All Users
              </button>
            </>
          )}
        </>
      )}
      <h3>Credentials for Divisions</h3>
      {credentials.map((data) => (
        <div key={data.division._id} className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">
              Organisational Units: {data.ou.name} | Division: {data.division.name}
            </h5>
          
              <button className="btn btn-primary mb-3" onClick={handleToggleAddCredentialForm}>
                {showAddCredentialForm ? 'Hide Add Credentials' : 'Add Credentials'}
              </button>
           

            {showAddCredentialForm && <AddCredentialForm divisionId={data.division._id} />}
            <ul className="list-group">
              {data.credentialRepository.credentials.map((credential) => (
                <li key={credential._id} className="list-group-item">
                  <strong>System:</strong> {credential.systemname} <br />
                  <strong>Username:</strong> {credential.username} <br />
                  <strong>Password:</strong> {credential.password} <br />
                  {userData.role !== 'Normal' && (
                  <button className="btn btn-warning" onClick={() => handleEditCredential(credential._id)}>
                    Edit
                  </button>
                   )}
                  {editingCredentialId === credential._id && (
                    <UpdateCredentialForm credentialId={credential._id} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserDashboard;