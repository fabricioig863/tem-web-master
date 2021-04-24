import { useState } from 'react';
import './patients.css';
import Title from '../../components/Title';
import Header from '../../components/Header';
import firebase from '../../services/firebaseConnection';
import { FiUser } from 'react-icons/fi';

import { toast } from 'react-toastify';

export default function Patients(){

  const [nomePaciente, setNomePaciente] = useState('');
  const [cpf, setCpf] = useState('');
  const [medico, setMedico] = useState('');
  const [agendamento, setAgendamento] = useState('');

  async function handleAdd(e){
    e.preventDefault();
    
    if(nomePaciente !== '' && cpf !== '' && medico !== '' && agendamento !== ''){
      await firebase.firestore().collection('patients')
      .add({
        nomePaciente: nomePaciente,
        cpf: cpf,
        medico: medico,
        agendamento: agendamento
      })
      .then(() => {
        setNomePaciente('');
        setCpf('');
        setMedico('');
        setAgendamento('');
        toast.info('Paciente cadastrado com sucesso!');
      })
      .catch((error) => {
        console.log(error);
        toast.error('Erro ao cadastrar paciente!');
      })
    }else{
      toast.error('Preencha todos os campos!');
    }
  }


  return(
    <div>
      <Header />

      <div className="content">
        <Title name="Pacientes">
          <FiUser size={25} />
        </Title>

        <div className="container">
          <form className="form-profile patients" onSubmit={handleAdd}>
            <label>Nome do Paciente</label>
            <input type="text" placeholder="Nome do Paciente" value={nomePaciente} onChange={ (e) => setNomePaciente(e.target.value) } />

            <label>CPF</label>
            <input type="text" placeholder="CPF do Paciente" value={cpf} onChange={ (e) => setCpf(e.target.value) } />

            <label>Medico</label>
            <input type="text" placeholder="Nome do Medico" value={medico} onChange={ (e) => setMedico(e.target.value) } />

            <label>Agendamento</label>
            <input type="text" placeholder="Data de Agendamento" value={agendamento} onChange={ (e) => setAgendamento(e.target.value) } />

            <button type="submit">Cadastrar</button>

          </form>
        </div>
      </div>
    </div>
  )
}