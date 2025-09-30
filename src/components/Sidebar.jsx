import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <aside className="w-60 bg-gray-800 text-white min-h-screen p-4">
            <ul className="space-y-4">
                <li>
                    <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
                </li>
                <li>
                    <Link to="/profile" className="hover:text-blue-400">Profile</Link>
                </li>
                <li>
                    <Link to="/settings" className="hover:text-blue-400">Settings</Link>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
