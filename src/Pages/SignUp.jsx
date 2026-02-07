import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import api from '../api/api';
import {
  ChevronLeft, ArrowRight, UserPlus, Eye, EyeOff
} from 'lucide-react';

const SignUp = () => {
  const isDark = useSelector((state) => state.theme.isDark);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await api.post('/api/users/register', {
        fullname: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      if (res.data.success) {
        Cookies.set('authToken', res.data.token, { expires: 7 });
        Cookies.set('userInfo', JSON.stringify(res.data.user), { expires: 7 });
        toast.success('Account created');
        window.location.href = '/';
      }
    } catch {
      toast.error('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black' : 'bg-[#fafafa]'}`}>
      <section className="w-full max-w-xl px-6">
        <button onClick={() => window.history.back()} className="mb-10 flex gap-2 text-xs">
          <ChevronLeft size={14} /> Back
        </button>

        <div className="text-center mb-10">
          <UserPlus className="mx-auto text-amber-500" size={36} />
          <h1 className="text-5xl font-black uppercase italic mt-4">Registry</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Full Name"
            required
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full p-5 rounded-xl border"
          />
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-5 rounded-xl border"
          />

          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              required
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-5 rounded-xl border"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-5 top-1/2 -translate-y-1/2"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <input
            type={showPass ? 'text' : 'password'}
            placeholder="Confirm Password"
            required
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full p-5 rounded-xl border"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-black text-white rounded-xl font-black flex items-center justify-center gap-3"
          >
            {loading ? 'Processing…' : 'Create Account'}
            <ArrowRight size={18} />
          </button>
        </form>
      </section>
    </main>
  );
};

export default SignUp;
