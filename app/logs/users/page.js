'use client';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFileCode, faFileAlt, faChevronDown, faChevronUp, faSearch, faFilePdf } from '@fortawesome/free-solid-svg-icons';

export default function LogsUsersPage() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/logs')
      .then((res) => res.json())
      .then((data) => {
        const filteredLogs = data.data.filter(log => log.action === 'http://localhost:3000/api/users');
        setLogs(filteredLogs.map(log => ({ ...log, expanded: false })));
      });
  }, []);

  const toggleExpand = (index) => {
    setLogs((prevLogs) =>
      prevLogs.map((log, i) =>
        i === index ? { ...log, expanded: !log.expanded } : log
      )
    );
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Logs de Usuarios', 20, 10);
    let rowIndex = 20;

    filteredLogs.forEach((log) => {
      doc.text(`${new Date(log.createdAt).toLocaleString()} - ${log.method} - ${log.action}`, 20, rowIndex);
      rowIndex += 10;
      const logInfo = JSON.stringify(log.info, null, 2).split('\n');
      logInfo.forEach((line) => {
        doc.text(line, 20, rowIndex);
        rowIndex += 10;
      });
    });

    doc.save('logs.pdf');
  };

  const filteredLogs = logs.filter((log) =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    JSON.stringify(log.info).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Logs de usuarios</h1>

      <div className="mb-6 flex items-center space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar en logs"
          className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
      </div>

      <button onClick={exportToPDF} className="bg-green-500 p-3 mb-6 rounded-lg flex items-center space-x-2">
        <FontAwesomeIcon icon={faFilePdf} />
        <span>Exportar a PDF</span>
      </button>

      {filteredLogs.length === 0 ? (
        <p className="text-gray-400">No logs found for /api/users.</p>
      ) : (
        filteredLogs.map((log, index) => (
          <div className="m-2 p-4 bg-gray-800 rounded-lg shadow-lg" key={log._id}>
            <div className="mb-2 flex items-center space-x-2">
              <FontAwesomeIcon icon={faClock} className="text-gray-500" />
              <p className="text-gray-400">{new Date(log.createdAt).toLocaleString()}</p>
            </div>
            <div className="mb-2 flex items-center space-x-2">
              <FontAwesomeIcon icon={faFileCode} className="text-gray-500" />
              <p className="text-gray-400">{log.method}</p>
            </div>
            <div className="mb-2 flex items-center space-x-2">
              <FontAwesomeIcon icon={faFileAlt} className="text-gray-500" />
              <p className="text-gray-400 break-words">{log.action}</p>
            </div>
            <div className="mb-2 flex justify-between items-center">
              <span className="text-gray-400">Info</span>
              <button onClick={() => toggleExpand(index)} className="text-gray-400 focus:outline-none">
                <FontAwesomeIcon icon={log.expanded ? faChevronUp : faChevronDown} />
              </button>
            </div>
            {log.expanded && (
              <div className="mb-2">
                <pre className="text-gray-400 break-words">{JSON.stringify(log.info, null, 2)}</pre>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
