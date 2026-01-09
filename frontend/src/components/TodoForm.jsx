import { useState, useRef, useEffect } from 'react';
import api from '../services/api';

const TodoForm = ({ onTodoAdded }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const formRef = useRef(null);

    // Helpers
    const getTodayString = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const getCurrentTimeString = () => {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    };

    // Collapse on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                if (!title && !description && !dueDate) {
                    setIsExpanded(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [title, description, dueDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Basic Validation
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        const todayStr = getTodayString();
        const nowTimeStr = getCurrentTimeString();

        // 2. Date Validation (Strict Future/Today Only)
        if (dueDate && dueDate < todayStr) {
            setError('Due date cannot be in the past');
            return;
        }

        // 3. Time Validation
        if (dueDate === todayStr) {
            // If today, Start Time cannot be in the past
            if (startTime && startTime < nowTimeStr) {
                setError('Start time cannot be in the past for today\'s tasks');
                return;
            }
        }

        // 4. Time Range Validation
        if (startTime && endTime) {
            if (endTime <= startTime) {
                setError('End time must be after start time');
                return;
            }
        }

        setError('');
        setIsSubmitting(true);

        try {
            // Append time info to description since we can't change DB schema
            let finalDescription = description;
            if (startTime || endTime) {
                const timeInfo = `\n[Time: ${startTime || '...'} - ${endTime || '...'}]`;
                finalDescription = description ? `${description}${timeInfo}` : timeInfo.trim();
            }

            const res = await api.post('/todos', {
                title,
                description: finalDescription,
                priority,
                due_date: dueDate || null
            });
            onTodoAdded(res.data);

            // Reset form
            setTitle('');
            setDescription('');
            setPriority('medium');
            setDueDate('');
            setStartTime('');
            setEndTime('');
            setIsExpanded(true); // Keep expanded for rapid entry
        } catch (error) {
            console.error('Failed to create todo', error);
            setError('Failed to add task. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div ref={formRef} className={`transition-all duration-300 ${isExpanded ? 'bg-white shadow-lg rounded-t-lg border-t border-x border-gray-200' : 'bg-transparent'}`}>
            <form onSubmit={handleSubmit} className="p-3">
                {/* Main Input Line */}
                <div className="flex items-center gap-3 bg-white/50 rounded-md p-1">
                    <button type="button" className={`w-6 h-6 rounded-full border-2 border-blue-600 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors ${isExpanded ? 'opacity-100' : 'opacity-70'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    </button>
                    <input
                        type="text"
                        placeholder="Add a task"
                        className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-blue-600/70 py-2 h-10"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onFocus={() => setIsExpanded(true)}
                        disabled={isSubmitting}
                    />
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                    <div className="mt-3 px-1 animate-fadeIn space-y-3">
                        {error && <div className="text-xs text-red-500 bg-red-50 p-2 rounded">{error}</div>}

                        <div className="flex flex-col space-y-3">
                            {/* Description */}
                            <input
                                type="text"
                                placeholder="Details"
                                className="w-full text-sm border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            {/* Controls Row */}
                            <div className="flex flex-wrap items-center gap-2">
                                {/* Due Date */}
                                <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <input
                                        type="date"
                                        min={getTodayString()}
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="bg-transparent border-none p-0 text-xs focus:ring-0 w-28 text-gray-600"
                                    />
                                </div>

                                {/* Start Time */}
                                <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                    <span className="text-xs text-gray-500">Start:</span>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="bg-transparent border-none p-0 text-xs focus:ring-0 w-20 text-gray-600"
                                    />
                                </div>

                                {/* End Time */}
                                <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                    <span className="text-xs text-gray-500">End:</span>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="bg-transparent border-none p-0 text-xs focus:ring-0 w-20 text-gray-600"
                                    />
                                </div>

                                <div className="flex-1"></div>

                                {/* Action Buttons */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 shadow-sm"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default TodoForm;
