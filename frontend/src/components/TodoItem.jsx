import { useState } from 'react';
import api from '../services/api';

const TodoItem = ({ todo, onDelete, onUpdate }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    // Derived state for priority colors
    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'high':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        High
                    </span>
                );
            case 'medium':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Medium
                    </span>
                );
            case 'low':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Low
                    </span>
                );
            default: return null;
        }
    };

    const handleStatusToggle = async () => {
        try {
            const newStatus = todo.status === 'pending' ? 'completed' : 'pending';
            const res = await api.put(`/todos/${todo.id}`, { status: newStatus });
            onUpdate(res.data);
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            setIsDeleting(true);
            try {
                await api.delete(`/todos/${todo.id}`);
                onDelete(todo.id);
            } catch (error) {
                console.error("Failed to delete", error);
                setIsDeleting(false);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
    };

    return (
        <div
            className={`group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-5 ${todo.status === 'completed' ? 'bg-gray-50' : ''}`}
        >
            <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <div className="flex-shrink-0 pt-1">
                    <input
                        type="checkbox"
                        checked={todo.status === 'completed'}
                        onChange={handleStatusToggle}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h4
                            className={`text-lg font-semibold truncate transition-colors duration-200 ${todo.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'
                                }`}
                        >
                            {todo.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                            {getPriorityBadge(todo.priority)}
                        </div>
                    </div>

                    {todo.description && (
                        <p className={`text-sm mb-3 ${todo.status === 'completed' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {todo.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
                        <div className="flex items-center text-xs text-gray-500">
                            {todo.due_date && (
                                <span className={`flex items-center ${new Date(todo.due_date) < new Date() && todo.status !== 'completed' ? 'text-red-600 font-bold' : ''}`}>
                                    <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {formatDate(todo.due_date)}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className={`
                                flex items-center text-xs font-medium text-gray-400 hover:text-red-600 transition-colors duration-150
                                opacity-0 group-hover:opacity-100 focus:opacity-100
                            `}
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoItem;
