import { useState } from 'react';
import api from '../services/api';

const TodoItem = ({ todo, onDelete, onUpdate }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const toggleComplete = async () => {
        try {
            const res = await api.put(`/todos/${todo.id}`, {
                ...todo,
                status: todo.status === 'completed' ? 'pending' : 'completed'
            });
            onUpdate(res.data);
        } catch (error) {
            console.error("Failed to update todo", error);
        }
    };

    const togglePriority = async () => {
        const newPriority = todo.priority === 'high' ? 'medium' : 'high';
        try {
            const res = await api.put(`/todos/${todo.id}`, {
                ...todo,
                priority: newPriority
            });
            onUpdate(res.data);
        } catch (error) {
            console.error("Failed to update priority", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this task?')) return;
        setIsDeleting(true);
        try {
            await api.delete(`/todos/${todo.id}`);
            onDelete(todo.id);
        } catch (error) {
            console.error("Failed to delete todo", error);
            setIsDeleting(false);
        }
    };

    return (
        <div className="group flex items-center gap-3 p-3 bg-white hover:bg-gray-50 rounded-md shadow-sm border border-gray-100 transition-all">
            {/* Checkbox (Circle) */}
            <button
                onClick={toggleComplete}
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${todo.status === 'completed'
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-400 hover:border-blue-600 text-transparent'
                    }`}
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <span className={`text-sm text-gray-800 truncate ${todo.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                    {todo.title}
                </span>
                {/* Metadata Row */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    {todo.due_date && (
                        <span className={`flex items-center gap-1 ${todo.status !== 'completed' && new Date(todo.due_date) < new Date().setHours(0, 0, 0, 0) ? 'text-red-500' : ''}`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            {todo.due_date}
                        </span>
                    )}
                    {todo.description && (
                        <span className="truncate max-w-[200px] opacity-70">
                            {todo.description.split('\n')[0]}
                        </span>
                    )}
                </div>
            </div>

            {/* Actions (Star for Priority, Trash on Hover) */}
            <div className="flex items-center gap-2">
                <button
                    onClick={togglePriority}
                    className={`focus:outline-none transition-colors ${todo.priority === 'high' ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
                >
                    {todo.priority === 'high' ? (
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                    )}
                </button>

                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        </div>
    );
};

export default TodoItem;
