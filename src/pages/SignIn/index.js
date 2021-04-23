import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo2.png';
import './signin.css';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e){
    e.preventDefault();
    alert('clicou');
  }

  return (
  <div className="container-center">
    <div className="login">
      <div className="logo-area">
        <img src={logo} alt="Logo tem saude" />
      </div>

      <form onSubmit={handleSubmit}>
        <h1>Entrar</h1>
        <input type="text" placeholder="email@gmail.com" value={email} onchange={ (e) => setEmail(e.target.value) }/>
        <input type="password" placeholder="*******" value={password} onchange={ (e) => setPassword(e.target.value) }/>
        <button type="submit">Acessar</button>
      </form>


      <Link to="/register">Criar uma conta</Link>
    </div>
  </div>
  );
}

export default SignIn;
