import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const NavHeader: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <header className="relative">
      <div className="absolute inset-0 bg-primary"></div>
      <div className="container relative text-white p-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="text-2xl font-bold">DRAGCURA @ </span>
          <span className="text-2xl font-bold">
            {location.pathname === "/" ? "SALES REPORT" : "STOCK REPORT"}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link
                  to="/"
                  className="hover:bg-secondary hover:text-primary border border-secondary text-white px-3 py-2 rounded-sm"
                >
                  SALES REPORT
                </Link>
              </li>
              <li>
                <Link
                  to="/inventory"
                  className="hover:bg-secondary hover:text-primary border border-secondary text-white px-3 py-2 rounded-sm"
                >
                  STOCK REPORT
                </Link>
              </li>
            </ul>
          </nav>
          <Button
            onClick={logout}
            variant="secondary"
            className="text-primary hover:text-primary"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavHeader;