import { useState, useEffect, useCallback } from 'react';
import { version } from './version';
import { useAuth } from 'react-oidc-context';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState<string>('');
  const auth = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/hello');
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Error fetching data from the server.');
      }
    };

    fetchData();
  }, []);

  const login = useCallback(async () => {
    await auth.signinRedirect();
  }, [auth]);

  return (
    <div className="App">
      <h1>React Frontend</h1>
      <img src="/logo.png" />
      <p>Message from backend: {message}</p>
      <p>Version: {version}</p>
      <button onClick={login}>Login</button>
    </div>
  );
}

export default App;