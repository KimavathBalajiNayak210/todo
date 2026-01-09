import { useState } from 'react';
import api from '../services/api';

const TodoForm = ({ onTodoAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            const res = await api.post('/todos', {
                title,
                description,
                priority,
                due_date: dueDate || null
            });
            onTodoAdded(res.data);

            // Success animation/feedback could go here
            setTitle('');
            setDescription('');
            setPriority('medium');
            setDueDate('');
        } catch (error) {
            console.error('Failed to create todo', error);
            setError('Failed to add task. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h3 className="font-bold text-gray-700">Add New Task</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {error && (
                    <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-100">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                    <input
                        type="text"
                        placeholder="What needs to be done?"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                    <textarea
                        placeholder="Add details (optional)"
                        rows="3"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isSubmitting}
                    ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Priority</label>
                        <select
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            disabled={isSubmitting}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Due Date</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full px-4 py-2 text-sm font-bold text-white uppercase tracking-wide bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Task'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TodoForm;
