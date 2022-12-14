import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage(props) {
  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <h3 className='login-description'><i className="bi bi-journal-bookmark-fill"></i></h3>
        <h3 className='login-description'>Fooniversity</h3>
        <h5 className='login-description'>Study plan</h5>
        <h2>Login</h2>
        <LoginForm {...props} />
      </div>
    </div>
  );
}

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async (event) => {
    event.preventDefault();
    const credentials = { username, password };
    try {
      const user = await props.login(credentials);
      if (user) {
        props.setUser(user);
        navigate('/studyPlan');
      } else {
        props.setError('Invalid credentials, please retry.');
      }
    } catch (err) {
      console.error(err);
      props.setError('An error occurred while trying to login, please retry.');
    }
  };

  return <Form onSubmit={login}>
    <Form.Group controlId='username' className="mb-3">
      <Form.Label className='label'>Email</Form.Label>
      <Form.Control className="form-control" type='email' value={username}
        onChange={e => setUsername(e.target.value)} required={true} />
    </Form.Group>

    <Form.Group controlId='password' className="mb-3">
      <Form.Label className='label'>Password</Form.Label>
      <Form.Control className="form-control" type='password' value={password}
        onChange={e => setPassword(e.target.value)} required={true} />
    </Form.Group>

    <div className="d-grid">
      <Button type="submit" className="btn btn-primary">Login</Button>
    </div>
  </Form>
};
