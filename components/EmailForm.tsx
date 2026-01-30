import React, { useState } from 'react';
import { MailIcon } from './icons';

interface EmailFormProps {
  onSubmit: (email: string) => void;
  buttonText?: string;
}

const EmailForm: React.FC<EmailFormProps> = ({ onSubmit, buttonText = "Submit" }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); if (error) setError(''); }}
            placeholder="your.email@example.com"
            className="w-full p-3 pl-10 bg-slate-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder-slate-400"
            aria-label="Email address"
            />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors duration-150 shadow-md hover:shadow-lg"
        >
          {buttonText}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </form>
  );
};

export default EmailForm;