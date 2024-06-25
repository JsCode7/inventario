'use client';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faFilePdf } from '@fortawesome/free-solid-svg-icons';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [quantity, setQuantity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSale, setEditingSale] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/sales')
      .then((res) => res.json())
      .then((data) => setSales(data.data || []));

    fetch('/api/inventory')
      .then((res) => res.json())
      .then((data) => setProducts(data.data || []));

    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data.data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product: selectedProduct,
        user: selectedUser,
        quantity: parseInt(quantity, 10),
      }),
    });

    const data = await res.json();
    setSales((prevSales) => [...prevSales, data.data]);
    setSelectedProduct('');
    setSelectedUser('');
    setQuantity('');

    const updatedSales = await fetch('/api/sales')
    .then((res) => res.json())
    .then((data) => data.data || []);
    setSales(updatedSales);
  };

  const handleDelete = async (saleId) => {
    const res = await fetch('/api/sales', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: saleId }),
    });

    if (res.ok) {
      setSales(sales.filter((sale) => sale._id !== saleId));
    }
  };

  const handleEdit = (sale) => {
    setEditingSale({
      ...sale,
      product: sale.product._id,
      user: sale.user._id,
    });
    setIsModalOpen(true);
  };
  

  const handleUpdate = async () => {
    const res = await fetch('/api/sales', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editingSale),
    });
  
    if (res.ok) {
      const updatedSales = await fetch('/api/sales')
        .then((res) => res.json())
        .then((data) => data.data || []);
      setSales(updatedSales);
      setIsModalOpen(false);
    }
  };
  

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Lista de Ventas', 20, 10);
    let rowIndex = 20;

    filteredSales.forEach((sale) => {
      doc.text(`${sale.saleCode} - ${sale.product?.productName || 'Producto no encontrado'} - ${sale.quantity} - ${sale.user?.name || 'Usuario no encontrado'}`, 20, rowIndex);
      rowIndex += 10;
    });

    doc.save('sales.pdf');
  };

  const filteredSales = sales.filter((sale) =>
    (sale.product?.productName?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (sale.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    sale.saleCode.toString().includes(searchTerm.toLowerCase()) ||
    sale.quantity.toString().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Ventas</h1>
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="" disabled>Seleccione un Producto</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>{product.productName}</option>
            ))}
          </select>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="" disabled>Seleccione un Usuario</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Cantidad"
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="bg-blue-500 p-3 rounded-lg flex items-center space-x-2">
            <FontAwesomeIcon icon={faPlus} />
            <span>Agregar Venta</span>
          </button>
        </div>
      </form>

      <div className="mb-6 flex items-center space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar en ventas"
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
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Código de Venta</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Producto</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Cantidad</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Cliente</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale) => (
            <tr key={sale._id} className="border-b border-gray-700">
              <td className="py-3 px-4 text-gray-300">{sale.saleCode}</td>
              <td className="py-3 px-4 text-gray-300">{sale.product?.productName || 'Producto no encontrado'}</td>
              <td className="py-3 px-4 text-gray-300">{sale.quantity}</td>
              <td className="py-3 px-4 text-gray-300">{sale.user?.name || 'Usuario no encontrado'}</td>
              <td className="py-3 px-4 flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(sale)}
                  className="bg-yellow-500 p-2 rounded-lg flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(sale._id)}
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
            <h2 className="text-2xl mb-4">Editar Venta</h2>
            <select
              value={editingSale?.product || ''}
              onChange={(e) => setEditingSale({ ...editingSale, product: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>Seleccione un Producto</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>{product.productName}</option>
              ))}
            </select>
            <select
              value={editingSale?.user || ''}
              onChange={(e) => setEditingSale({ ...editingSale, user: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>Seleccione un Usuario</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
            <input
              type="number"
              value={editingSale?.quantity || ''}
              onChange={(e) => setEditingSale({ ...editingSale, quantity: e.target.value })}
              placeholder="Cantidad"
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
