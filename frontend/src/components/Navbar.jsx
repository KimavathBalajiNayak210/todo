import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto h-16 flex items-center justify-between">
                <div className="flex items-center">
                    <Link className="text-xl font-bold text-gray-900 flex items-center gap-2" to="/">
                        <span className="bg-blue-600 text-white p-1 rounded-md">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </span>
                        TaskMaster
                    </Link>
                </div>

                <div className="items-center md:flex">
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                        {user ? (
                            <>
                                <span className="text-sm font-medium text-gray-700">
                                    {user.name}
                                </span>
                                <button
                                    onClick={onLogout}
                                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <Link
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                to="/login"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
