import React from "react";

const NavHeader = () => {
  return (
    <header className="bg-slate-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold">DragCura INVENTORY REPORT</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a
                href="https://sdb.dragcura.com"
                rel="noopener noreferrer"
                className="hover:text-gray-300 font-medium"
              >
                SALES REPORT
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default NavHeader;
