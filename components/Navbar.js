'use client';

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/users" className="text-white hover:text-gray-400">
            Usuarios
          </Link>
        </li>
        <li>
          <Link href="/inventory" className="text-white hover:text-gray-400">
            Inventario
          </Link>
        </li>
        <li>
          <Link href="/categories" className="text-white hover:text-gray-400">
            Categorías
          </Link>
        </li>
        <li>
          <Link href="/sales" className="text-white hover:text-gray-400">
            Ventas
          </Link>
        </li>
        <li>
          <Link href="/buys" className="text-white hover:text-gray-400 ">
            Añadir Stock
          </Link>
        </li>
        <li className="relative">
          <button
            onClick={toggleDropdown}
            className="text-white hover:text-gray-400 flex items-center focus:outline-none"
          >
            Logs
            <FontAwesomeIcon
              icon={isDropdownOpen ? faChevronUp : faChevronDown}
              className="ml-1"
            />
          </button>
          {isDropdownOpen && (
            <ul className="absolute mt-2 bg-gray-800 border border-gray-700 rounded shadow-lg">
              <li>
                <Link href="/logs/users" className="block px-4 py-2 text-white hover:bg-gray-700">
                  Logs usuarios
                </Link>
              </li>
              <li>
                <Link href="/logs/inventory" className="block px-4 py-2 text-white hover:bg-gray-700">
                  Logs inventario
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
