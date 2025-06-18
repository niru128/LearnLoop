import React from 'react';
import useAuthStore from './store/authStore';

function App() {
  const setAuth = useAuthStore((state)=>state.setAuth);
  const setLoading = useAuthStore((state)=>state.setLoading);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const user = JSON.parse(localStorage.getItem('user'));

    if(token && user){
      setAuth({ token, user });
      
    }else{
      setLoading(false);
    }
  }, [])
  
  
  return (
    <>
      
    </>
  )
}

export default App
