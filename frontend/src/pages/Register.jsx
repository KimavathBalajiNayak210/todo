import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await register(name, email, password);
            if (res.success) {
                navigate('/dashboard');
            } else {
                setError(res.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 m-4 bg-white rounded-lg shadow-md">
                <div className="flex justify-center mx-auto">
                    <span className="text-xl font-bold text-gray-800">Todo App</span>
                </div>

                <form className="mt-6" onSubmit={handleSubmit}>
                    <h3 className="text-2xl font-bold text-center text-gray-700">Get Started</h3>
                    <p className="mt-1 text-center text-gray-500">Create a new account</p>

                    {error && (
                        <div className="mt-4 p-3 text-sm text-red-600 bg-red-100 border border-red-200 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="mt-6">
                        <label className="block text-sm text-gray-600 font-medium" htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-opacity-40"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm text-gray-600 font-medium" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-opacity-40"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm text-gray-600 font-medium" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-opacity-40"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Create Account' : 'Register'}
                        </button>
                    </div>
                </form>

                <div className="flex items-center justify-center mt-4">
                    <span className="text-sm text-gray-600">Already have an account? </span>
                    <Link to="/login" className="mx-2 text-sm font-bold text-blue-500 hover:underline">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
