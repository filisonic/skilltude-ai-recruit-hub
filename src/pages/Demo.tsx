
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Demo = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to CRM page since demo is now only for CRM
    navigate('/crm', { replace: true });
  }, [navigate]);

  return null;
};

export default Demo;
