import { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';

const Dashboard = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all'); // 'myday', 'important', 'planned', 'all'

    // Backgrounds for different modes (using CSS classes or inline styles for now)
    const getBackground = () => {
        switch (filterStatus) {
            case 'myday': return 'bg-gradient-to-br from-gray-800 to-gray-900'; // Dark/My Day theme
            default: return 'bg-white';
        }
    };

    useEffect(() => {
        fetchTodos();
    }, [filterStatus]);

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const res = await api.get('/todos');
            let data = res.data;

            // Client-side filtering because backend API is limited
            if (filterStatus === 'myday') {
                const today = new Date().toISOString().split('T')[0];
                data = data.filter(t => t.due_date === today); // Basic My Day logic
            } else if (filterStatus === 'important') {
                data = data.filter(t => t.priority === 'high');
            } else if (filterStatus === 'planned') {
                data = data.filter(t => t.due_date);
            }
            // 'all' returns everything

            setTodos(data);
        } catch (error) {
            console.error("Error fetching todos", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTodoAdded = (newTodo) => {
        setTodos([newTodo, ...todos]);
    };

    const handleTodoDeleted = (id) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };

    const handleTodoUpdated = (updatedTodo) => {
        setTodos(prev => prev.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
    };

    const getTitle = () => {
        const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        switch (filterStatus) {
            case 'myday': return { title: 'My Day', subtitle: date };
            case 'important': return { title: 'Important', subtitle: '' };
            case 'planned': return { title: 'Planned', subtitle: '' };
            default: return { title: 'Tasks', subtitle: '' };
        }
    };

    const { title, subtitle } = getTitle();

    return (
        <div className="flex h-screen overflow-hidden bg-white">
            <Sidebar activeFilter={filterStatus} setFilter={setFilterStatus} />

            <main className="flex-1 flex flex-col relative transition-all duration-300">
                {/* Background Image Layer */}
                <div className={`absolute inset-0 z-0 ${filterStatus === 'myday' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                    <img src="https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Background" />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 flex-1 flex flex-col h-full overflow-hidden">
                    {/* Header */}
                    <div className="pt-8 px-8 pb-4">
                        <h1 className={`text-3xl font-bold ${filterStatus === 'myday' ? 'text-white shadow-sm' : 'text-blue-600'}`}>
                            {title}
                        </h1>
                        {subtitle && <p className={`text-lg mt-1 ${filterStatus === 'myday' ? 'text-white/80' : 'text-gray-500'}`}>{subtitle}</p>}
                    </div>

                    {/* Todo List - Scrollable */}
                    <div className="flex-1 overflow-y-auto px-8 pb-32 scrollbar-thin scrollbar-thumb-gray-300">
                        {loading ? (
                            <div className="flex justify-center p-10">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : todos.length === 0 ? (
                            <div className={`text-center mt-20 ${filterStatus === 'myday' ? 'text-white/70' : 'text-gray-400'}`}>
                                <p>No tasks found.</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {todos.map(todo => (
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

                    {/* Fixed Input Bar at Bottom */}
                    <div className="p-6">
                        <div className="max-w-4xl mx-auto">
                            <TodoForm onTodoAdded={handleTodoAdded} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
