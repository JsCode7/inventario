'use client';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faFilePdf } from '@fortawesome/free-solid-svg-icons';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password: 'defaultPassword' }),
    });

    const data = await res.json();
    setUsers((prevUsers) => [...prevUsers, data.data]);
    setName('');
    setEmail('');
  };

  const handleDelete = async (userId) => {
    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: userId }),
    });

    if (res.ok) {
      setUsers(users.filter((user) => user._id !== userId));
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    const res = await fetch('/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editingUser),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      setUsers(users.map((user) => (user._id === updatedUser.data._id ? updatedUser.data : user)));
      setIsModalOpen(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Lista de Usuarios', 20, 10);
    let rowIndex = 20;

    filteredUsers.forEach((user) => {
      doc.text(`${user.name} - ${user.email}`, 20, rowIndex);
      rowIndex += 10;
    });

    doc.save('users.pdf');
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Usuarios</h1>
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="bg-blue-500 p-3 rounded-lg flex items-center space-x-2">
            <FontAwesomeIcon icon={faPlus} />
            <span>Agregar Usuario</span>
          </button>
        </div>
      </form>

      <div className="mb-6 flex items-center space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o email"
          className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
      </div>

      <button onClick={exportToPDF} className="bg-green-500 p-3 mb-6 rounded-lg flex items-center space-x-2">
        <FontAwesomeIcon icon={faFilePdf} />
        <span>Exportar a PDF</span>
      </button>

      <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Nombre</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Email</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id} className="border-b border-gray-700">
              <td className="py-3 px-4 text-gray-300">{user.name}</td>
              <td className="py-3 px-4 text-gray-300">{user.email}</td>
              <td className="py-3 px-4 flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-500 p-2 rounded-lg flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 p-2 rounded-lg flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span>Eliminar</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Editar Usuario</h2>
            <input
              type="text"
              value={editingUser.name}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              placeholder="Nombre"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              placeholder="Email"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 p-3 rounded-lg flex items-center space-x-2"
              >
                <span>Cancelar</span>
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 p-3 rounded-lg flex items-center space-x-2"
              >
                <span>Guardar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
