import { useState, useEffect } from 'react';
import './App.css';

import Card from './components/Card';

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortField, setSortField] = useState('name.first');
  const [selectedUser, setSelectedUser] = useState(null);

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [sortedUsers, setSortedUsers] = useState(filteredUsers);
  const [displayedUsers, setDisplayedUsers] = useState(sortedUsers);

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.name.first.toLowerCase().includes(search.toLowerCase()) ||
          user.name.last.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.location.city.toLowerCase().includes(search.toLowerCase()) ||
          user.location.country.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  useEffect(() => {
    setSortedUsers(
      filteredUsers.slice().sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (aValue < bValue) {
          return sortOrder === 'asc' ? -1 : 1;
        } else if (aValue > bValue) {
          return sortOrder === 'asc' ? 1 : -1;
        } else {
          // if sortField is 'name.first' or 'name.last',
          // set the sorting order based on sortOrder
          if (sortField === 'name.first' || sortField === 'name.last') {
            return sortOrder === 'asc' ? -1 : 1;
          } else {
            return 0;
          }
        }
      })
    );
  }, [filteredUsers, sortOrder, sortField]);

  useEffect(() => {
    setDisplayedUsers(sortedUsers);
  }, [sortedUsers]);

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=10')
      .then((response) => response.json())
      .then((data) => setUsers(data.results));
  }, []);

  const handleSortClick = (field) => {
    console.log(field, 'field');
    console.log(sortOrder, 'Order');
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setSortedUsers(
      filteredUsers.slice().sort((a, b) => {
        // check whether the selected field is a nested object property or not
        const aValue = field.includes('.')
          ? a[field.split('.')[0]][field.split('.')[1]]
          : a[field];
        const bValue = field.includes('.')
          ? b[field.split('.')[0]][field.split('.')[1]]
          : b[field];
        if (aValue < bValue) {
          return sortOrder === 'asc' ? -1 : 1;
        } else if (aValue > bValue) {
          return sortOrder === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      })
    );
  };

  const handleEditClick = (user) => {
    console.log(user, 'User');
    setSelectedUser(user);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const updatedUser = {
      ...selectedUser,
      name: {
        ...selectedUser.name,
        first: form.elements['name.first'].value,
        last: form.elements['name.last'].value,
      },
      email: form.elements['email'].value,
    };
    const updatedUsers = filteredUsers.map((user) =>
      user.email === selectedUser.email ? updatedUser : user
    );
    setUsers(updatedUsers);

    const updatedFilteredUsers = updatedUsers.filter(
      (user) =>
        user.name.first.toLowerCase().includes(search.toLowerCase()) ||
        user.name.last.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.location.city.toLowerCase().includes(search.toLowerCase()) ||
        user.location.country.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(updatedFilteredUsers);

    const updatedSortedUsers = updatedFilteredUsers.slice().sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      } else {
        if (sortField === 'name.first' || sortField === 'name.last') {
          return sortOrder === 'asc' ? -1 : 1;
        } else {
          return 0;
        }
      }
    });
    setSortedUsers(updatedSortedUsers);

    setSelectedUser(null);
  };

  return (
    <div className="App">
      <h1 className="title">Users List:</h1>

      <input
        type="text"
        className="form-control"
        placeholder="🔍 Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div>
        <div role="group">
          <button type="button" onClick={() => handleSortClick('name.first')}>
            Name{' '}
          </button>
          <button type="button" onClick={() => handleSortClick('name.last')}>
            Last Name{' '}
          </button>
          <button type="button" onClick={() => handleSortClick('email')}>
            Email{' '}
          </button>
        </div>
      </div>

      {selectedUser ? (
        <form className="edit-form" onSubmit={handleEditSubmit}>
          <label>
            First name:
            <input
              type="text"
              name="name.first"
              value={selectedUser.name.first}
              onChange={(event) =>
                setSelectedUser({
                  ...selectedUser,
                  name: {
                    ...selectedUser.name,
                    first: event.target.value,
                  },
                })
              }
            />
          </label>
          <label>
            Last name:
            <input
              type="text"
              name="name.last"
              value={selectedUser.name.last}
              onChange={(event) =>
                setSelectedUser({
                  ...selectedUser,
                  name: {
                    ...selectedUser.name,
                    last: event.target.value,
                  },
                })
              }
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={selectedUser.email}
              onChange={(event) =>
                setSelectedUser({
                  ...selectedUser,
                  email: event.target.value,
                })
              }
            />
          </label>
          <button type="submit">Save</button>
          <button onClick={() => setSelectedUser(null)}>Cancel</button>
        </form>
      ) : (
        <ul role="list" className="users-grid">
          {displayedUsers &&
            displayedUsers.map((user, index) => (
              <Card
                user={user}
                key={index}
                onClick={() => handleEditClick(user)}
              />
            ))}
        </ul>
      )}
    </div>
  );
}

export default App;
