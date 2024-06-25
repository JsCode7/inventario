'use client';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faFilePdf } from '@fortawesome/free-solid-svg-icons';

export default function BuysPage() {
  const [products, setProducts] = useState([]);
  const [buys, setBuys] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBuy, setEditingBuy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/inventory')
      .then((res) => res.json())
      .then((data) => setProducts(data.data || []));

    fetch('/api/buys')
      .then((res) => res.json())
      .then((data) => setBuys(data.data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/buys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product: selectedProduct,
        quantity: parseInt(quantity, 10),
        supplier,
      }),
    });

    const data = await res.json();
    setBuys((prevBuys) => [...prevBuys, data.data]);
    setSelectedProduct('');
    setQuantity('');
    setSupplier('');
  };

  const handleDelete = async (buyId) => {
    const res = await fetch('/api/buys', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: buyId }),
    });

    if (res.ok) {
      setBuys(buys.filter((buy) => buy._id !== buyId));
    }
  };

  const handleEdit = (buy) => {
    setEditingBuy({
      ...buy,
      product: buy.product._id,
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    const res = await fetch('/api/buys', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editingBuy),
    });

    if (res.ok) {
      const updatedBuys = await fetch('/api/buys')
        .then((res) => res.json())
        .then((data) => data.data || []);
      setBuys(updatedBuys);
      setIsModalOpen(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Lista de Compras', 20, 10);
    let rowIndex = 20;

    filteredBuys.forEach((buy) => {
      doc.text(`${buy.product.productName} - ${buy.quantity} - ${buy.supplier} - ${new Date(buy.entryDate).toLocaleDateString()}`, 20, rowIndex);
      rowIndex += 10;
    });

    doc.save('buys.pdf');
  };

  const filteredBuys = buys.filter((buy) =>
    (buy.product?.productName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (buy.supplier?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    buy.quantity.toString().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Añadir Stock</h1>
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
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Cantidad"
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="Proveedor"
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="bg-blue-500 p-3 rounded-lg flex items-center space-x-2">
            <FontAwesomeIcon icon={faPlus} />
            <span>Agregar Stock</span>
          </button>
        </div>
      </form>

      <div className="mb-6 flex items-center space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar en compras"
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
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Producto</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Cantidad</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Proveedor</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Fecha de Entrada</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredBuys.map((buy) => (
            <tr key={buy._id} className="border-b border-gray-700">
              <td className="py-3 px-4 text-gray-300">{buy.product?.productName || 'Producto no encontrado'}</td>
              <td className="py-3 px-4 text-gray-300">{buy.quantity}</td>
              <td className="py-3 px-4 text-gray-300">{buy.supplier}</td>
              <td className="py-3 px-4 text-gray-300">{new Date(buy.entryDate).toLocaleDateString()}</td>
              <td className="py-3 px-4 flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(buy)}
                  className="bg-yellow-500 p-2 rounded-lg flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(buy._id)}
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
            <h2 className="text-2xl mb-4">Editar Entrada de Stock</h2>
            <select
              value={editingBuy?.product || ''}
              onChange={(e) => setEditingBuy({ ...editingBuy, product: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>Seleccione un Producto</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>{product.productName}</option>
              ))}
            </select>
            <input
              type="number"
              value={editingBuy?.quantity || ''}
              onChange={(e) => setEditingBuy({ ...editingBuy, quantity: e.target.value })}
              placeholder="Cantidad"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={editingBuy?.supplier || ''}
              onChange={(e) => setEditingBuy({ ...editingBuy, supplier: e.target.value })}
              placeholder="Proveedor"
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
