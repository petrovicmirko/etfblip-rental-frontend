import React from "react";

const Navbar = ({ onLogout }) => {
    return (
        <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold">Moja Aplikacija</h1>
            <button
                onClick={onLogout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </nav>
    );
};

export default Navbar;
