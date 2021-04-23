import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo2.png';
import './signup.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

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
        <h1>Cadastrar uma conta</h1>
        <input type="text" placeholder="name" value={name} onchange={ (e) => setName(e.target.value) }/>
        <input type="text" placeholder="email@gmail.com" value={email} onchange={ (e) => setEmail(e.target.value) }/>
        <input type="password" placeholder="*******" value={password} onchange={ (e) => setPassword(e.target.value) }/>
    
        <button type="submit">Cadastrar</button>
      </form>


      <Link to="/">Ja possui uma conta? Entre</Link>
    </div>
  </div>
  );
}

export default SignUp;
