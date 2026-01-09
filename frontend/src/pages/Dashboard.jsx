import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';

const Dashboard = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPriority, setFilterPriority] = useState('');

    useEffect(() => {
        fetchTodos();
    }, [filterStatus, filterPriority]);

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filterStatus) params.status = filterStatus;
            if (filterPriority) params.priority = filterPriority;

            const res = await api.get('/todos', { params });
            setTodos(res.data);
        } catch (error) {
            console.error("Error fetching todos", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTodoAdded = (newTodo) => {
        // If filters are strict, re-fetch; otherwise optimistic update for UX
        if (!filterStatus && !filterPriority) {
            setTodos([newTodo, ...todos]);
        } else {
            fetchTodos();
        }
    };

    const handleTodoDeleted = (id) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };

    const handleTodoUpdated = (updatedTodo) => {
        setTodos(prev => prev.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
    };

    const resetFilters = () => {
        setFilterStatus('');
        setFilterPriority('');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* Sidebar / Form Area */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <TodoForm onTodoAdded={handleTodoAdded} />
                        </div>
                    </div>

                    {/* Todo List Area */}
                    <div className="lg:col-span-3">
                        <div className="flex flex-col mb-6 sm:flex-row sm:justify-between sm:items-center">
                            <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>

                            <div className="flex flex-col mt-4 space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3 sm:mt-0">
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-2 pr-8 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>

                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-2 pr-8 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                        value={filterPriority}
                                        onChange={(e) => setFilterPriority(e.target.value)}
                                    >
                                        <option value="">All Priority</option>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>

                                {(filterStatus || filterPriority) && (
                                    <button
                                        onClick={resetFilters}
                                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                    >
                                        Reset Filters
                                    </button>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : todos.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
                                <div className="p-4 bg-gray-100 rounded-full">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                                    </svg>
                                </div>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
                                <p className="mt-2 text-gray-500">
                                    {(filterStatus || filterPriority)
                                        ? "Try adjusting your filters to see more tasks."
                                        : "Get started by adding a new task from the sidebar!"}
                                </p>
                                {(filterStatus || filterPriority) && (
                                    <button onClick={resetFilters} className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500">
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {todos.map((todo) => (
                                    <TodoItem
                                        key={todo.id}
                                        todo={todo}
                                        onDelete={handleTodoDeleted}
                                        onUpdate={handleTodoUpdated}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
