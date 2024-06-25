'use client';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        products: [] // Inicialmente sin productos
      }),
    });

    const data = await res.json();
    setCategories((prevCategories) => [...prevCategories, data.data]);
    setName('');
    setDescription('');
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    const res = await fetch('/api/categories', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editingCategory),
    });

    if (res.ok) {
      const updatedCategory = await res.json();
      setCategories(categories.map((category) => (category._id === updatedCategory.data._id ? updatedCategory.data : category)));
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (categoryId) => {
    const res = await fetch('/api/categories', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: categoryId }),
    });

    if (res.ok) {
      setCategories(categories.filter((category) => category._id !== categoryId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Categorías</h1>
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la Categoría"
          className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción de la Categoría"
          className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-500 p-3 rounded-lg flex items-center space-x-2">
          <FontAwesomeIcon icon={faPlus} />
          <span>Agregar Categoría</span>
        </button>
      </form>

      <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Nombre</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Descripción</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id} className="border-b border-gray-700">
              <td className="py-3 px-4 text-gray-300">{category.name}</td>
              <td className="py-3 px-4 text-gray-300">{category.description}</td>
              
              <td className="py-3 px-4 flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="bg-yellow-500 p-2 rounded-lg flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
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
            <h2 className="text-2xl mb-4">Editar Categoría</h2>
            <input
              type="text"
              value={editingCategory?.name || ''}
              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
              placeholder="Nombre de la Categoría"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            />
            <textarea
              value={editingCategory?.description || ''}
              onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
              placeholder="Descripción de la Categoría"
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
