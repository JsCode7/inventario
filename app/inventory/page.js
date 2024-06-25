'use client';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faFilePdf } from '@fortawesome/free-solid-svg-icons';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [stock, setStock] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/inventory')
      .then((res) => res.json())
      .then((data) => setProducts(data.data || []));

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalCost = stock * costPerUnit;
    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productCode,
        productName,
        category,
        stock,
        entryDate,
        costPerUnit,
        totalCost,
      }),
    });

    const data = await res.json();
    setProducts((prevProducts) => [...prevProducts, data.data]);
    setProductCode('');
    setProductName('');
    setStock('');
    setEntryDate('');
    setCostPerUnit('');
    setCategory('');
  };

  const handleDelete = async (productId) => {
    const res = await fetch('/api/inventory', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: productId }),
    });

    if (res.ok) {
      setProducts(products.filter((product) => product._id !== productId));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    const totalCost = editingProduct.stock * editingProduct.costPerUnit;
    const res = await fetch('/api/inventory', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...editingProduct, totalCost }),
    });

    if (res.ok) {
      const updatedProduct = await res.json();
      setProducts(products.map((product) => (product._id === updatedProduct.data._id ? updatedProduct.data : product)));
      setIsModalOpen(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Lista de Productos', 20, 10);
    let rowIndex = 20;

    filteredProducts.forEach((product) => {
      doc.text(`${product.productCode} - ${product.productName} - ${product.category} - ${product.stock} - ${new Date(product.entryDate).toLocaleDateString()} - ${product.costPerUnit} - ${product.totalCost}`, 20, rowIndex);
      rowIndex += 10;
    });

    doc.save('products.pdf');
  };

  const filteredProducts = products.filter((product) =>
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.stock?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.costPerUnit?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.totalCost?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Inventario</h1>
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            placeholder="Código de Producto"
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Nombre del Producto"
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="" disabled>Seleccione una Categoría</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Stock Disponible"
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            placeholder="Fecha de Ingreso"
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            value={costPerUnit}
            onChange={(e) => setCostPerUnit(e.target.value)}
            placeholder="Costo por Unidad"
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <div className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500">
            Costo Total: {(stock * costPerUnit).toFixed(2)}
          </div>
          <button type="submit" className="bg-blue-500 p-3 rounded-lg flex items-center space-x-2">
            <FontAwesomeIcon icon={faPlus} />
            <span>Agregar Producto</span>
          </button>
        </div>
      </form>

      <div className="mb-6 flex items-center space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar en inventario"
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
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Código</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Nombre</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Categoría</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Stock</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Fecha de Ingreso</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Costo por Unidad</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Costo Total</th>
            <th className="py-3 px-4 bg-gray-700 text-left text-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id} className="border-b border-gray-700">
              <td className="py-3 px-4 text-gray-300">{product.productCode}</td>
              <td className="py-3 px-4 text-gray-300">{product.productName}</td>
              <td className="py-3 px-4 text-gray-300">{categories.find(cat => cat._id === product.category)?.name || 'Sin categoría'}</td>
              <td className="py-3 px-4 text-gray-300">{product.stock}</td>
              <td className="py-3 px-4 text-gray-300">{new Date(product.entryDate).toLocaleDateString()}</td>
              <td className="py-3 px-4 text-gray-300">{product.costPerUnit}</td>
              <td className="py-3 px-4 text-gray-300">{product.totalCost}</td>
              <td className="py-3 px-4 flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-500 p-2 rounded-lg flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
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
            <h2 className="text-2xl mb-4">Editar Producto</h2>
            <input
              type="text"
              value={editingProduct?.productCode || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, productCode: e.target.value })}
              placeholder="Código de Producto"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
              disabled
            />
            <input
              type="text"
              value={editingProduct?.productName || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, productName: e.target.value })}
              placeholder="Nombre del Producto"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            />
            <select
              value={editingProduct?.category || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>Seleccione una Categoría</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <input
              type="number"
              value={editingProduct?.stock || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
              placeholder="Stock Disponible"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            />
            <input
              type="date"
              value={editingProduct?.entryDate ? new Date(editingProduct.entryDate).toISOString().substr(0, 10) : ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, entryDate: e.target.value })}
              placeholder="Fecha de Ingreso"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              value={editingProduct?.costPerUnit || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, costPerUnit: e.target.value })}
              placeholder="Costo por Unidad"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            />
            <div className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4">
              Costo Total: {(editingProduct?.stock * editingProduct?.costPerUnit).toFixed(2)}
            </div>
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
