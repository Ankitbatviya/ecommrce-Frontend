import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [valid, setValid] = useState(true);

  useEffect(() => {
    api.get(`/api/auth/reset-password/${token}`).catch(() => setValid(false));
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error('Mismatch');

    try {
      const res = await api.post('/api/auth/reset-password', { token, password });
      Cookies.set('authToken', res.data.token, { expires: 7 });
      Cookies.set('userInfo', JSON.stringify(res.data.user), { expires: 7 });
      toast.success('Password updated');
      navigate('/');
    } catch {
      toast.error('Reset failed');
    }
  };

  if (!valid) return <p>Token expired</p>;

  return (
    <form onSubmit={submit}>
      <input onChange={e=>setPassword(e.target.value)} />
      <input onChange={e=>setConfirm(e.target.value)} />
      <button>Reset</button>
    </form>
  );
};

export default ResetPassword;
