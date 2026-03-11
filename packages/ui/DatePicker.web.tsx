import React from 'react';

interface DatePickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange, error }) => {
    return (
        <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-700 mb-1.5 ml-1">{label}</label>
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`bg-white border-2 ${error ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-base text-gray-900 focus:outline-none focus:border-black transition-all`}
            />
            {error && <span className="text-xs text-red-500 mt-1 ml-1">{error}</span>}
        </div>
    );
};
