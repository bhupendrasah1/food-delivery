import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/authSlice';

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    const rawRole = (searchParams.get('role') || 'user').toLowerCase();
    const role = rawRole === 'own' ? 'owner' : rawRole;
    const name = searchParams.get('name') || 'Google User';
    const email = searchParams.get('email') || '';

    if (!token) {
      navigate('/login?error=google_auth_failed', { replace: true });
      return;
    }

    const user = { name, email, role };
    dispatch(loginSuccess({ user, token }));

    if (role === 'admin') navigate('/admin', { replace: true });
    else if (role === 'owner') navigate('/owner-dashboard', { replace: true });
    else if (role === 'deliveryBoy') navigate('/delivery-dashboard', { replace: true });
    else navigate('/', { replace: true });
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfaf8] text-gray-600 font-bold">
      Signing you in with Google...
    </div>
  );
};

export default GoogleAuthCallback;