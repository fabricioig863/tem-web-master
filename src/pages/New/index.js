import { useState, useEffect, useContext } from 'react';

import firebase from '../../services/firebaseConnection';
import { useHistory, useParams } from 'react-router-dom';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';
import './new.css';
import { FiPlus } from 'react-icons/fi'

export default function New(){
  const { id } = useParams();
  const history = useHistory();

  const [loadPatients, setLoadPatients] = useState(true);
  const [patients, setPatients] = useState([]);
  const [patientsSelected, setPatientsSelected] = useState(0);

  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [complemento, setComplemento] = useState('');

  const [idPatients, setIdPatients] = useState();

  const { user } = useContext(AuthContext);


  useEffect(() => {
    async function loadPatients(){
      await firebase.firestore().collection('patients')
      .get()
      .then((snapshot)=>{
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id:doc.id,
            nomePaciente: doc.data().nomePaciente
          })
        })

        if(lista.length === 0){
          console.log('NENHUM PACIENTE ENCONTRADO');
          setPatients([ {id: '1', nomePaciente: 'FREELA' } ]);
          setLoadPatients(false);
          return;
        }

        setPatients(lista);
        setLoadPatients(false);

        if(id){
          loadId(lista)
        }
      })
      .catch((error) => {
        console.log('Deu erro, corre!', error);
        setLoadPatients(false);
        setPatients([ {id: '1', nomePaciente: '' } ]);

      })
    }
    loadPatients();

  },[]);

  async function loadId(lista){
    await firebase.firestore().collection('chamados').doc(id)
    .get()
    .then((snapshot) => {
      setAssunto(snapshot.data().assunto)
      setStatus(snapshot.data().status);
      setComplemento(snapshot.data().complemento)

      let index = lista.findIndex(item => item.id === snapshot.data().pacienteId);
      setPatientsSelected(index);
      setIdPatients(true);
    })
    .catch((err) => {
      console.log('Erro no id passado: ', err);
      setIdPatients(false);
    })
  }

  async function handleRegister(e){
    e.preventDefault();

    if(idPatients){
      await firebase.firestore().collection('chamados')
      .doc(id)
      .update({
        pacientes: patients[patientsSelected].nomePaciente,
        pacienteId: patients[patientsSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid
      })
      .then(()=>{
        toast.success('Chamado editada com sucesso!');
        setPatientsSelected(0);
        setComplemento('');
        history.push('./dashboard');
      })
      .catch((error) => {
        toast.error('Ops erro ao registrar, tente mais tarde.');
        console.log(error);
      })

      return;
    }
    
    await firebase.firestore().collection('chamados')
    .add({
      created: new Date(),
      pacientes: patients[patientsSelected].nomePaciente,
      pacienteId: patients[patientsSelected].id,
      assunto: assunto,
      status: status,
      complemento: complemento,
      userId: user.uid
    })
    .then(() => {
      toast.success('Chamado criado com sucesso!');
      setComplemento('');
      setPatientsSelected(0);
    })
    .catch((err) => {
      toast.error('Ops erro ao registrar tente mais tarde.');
      console.log(err)
    })

  }

  //Chamado quando troca o assunto
  function handleChangeSelect(e){
    setAssunto(e.target.value);
  }

  //Chamado quando troca o status
  function handleOptionChange(e){
    setStatus(e.target.value);
  }

  //chamado quando troca de paciente
  function handleChangePatients(e){
    console.log('Index do cliente selecionado: ', e.target.value);
    console.log('Cliente selecionado', patients[e.target.value]);
    setPatientsSelected(e.target.value);
  }


  return(
    <div>
      <Header />

      <div className="content">
        <Title name="Novo Chamado">
          <FiPlus size={25} />
        </Title>

        <div className="container">

          <form className="form-profile" onSubmit={handleRegister}>
            <label>Paciente</label>

            {loadPatients ? (
              <input type="text" disable={true} value="Carregando cliente..." />
            ): (
              <select value={patientsSelected} onChange={handleChangePatients}>
              {patients.map((item, index) => {
                 return(
                   <option key={item.key} value={index}>
                     {item.nomePaciente}
                   </option>
                 )
              })}
             </select>
            )}

            <label>Requerimento</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Psicologo</option>
              <option value="Visita Familiares">Visita dos Familiares</option>
              <option value="Fisioterapeuta">Fisioterapeuta</option>
            </select>

            <label>
              Status
            </label>
              <div className="status"> 
                <input 
                type="radio"
                name="radio"
                value="Aberto"
                onChange={handleOptionChange}
                checked={ status === 'Aberto' }
                />
                <span>Em Aberto</span>

                <input 
                type="radio"
                name="radio"
                value="Progresso"
                onChange={handleOptionChange}
                checked={ status === 'Progresso' }
                />
                <span>Progresso</span>

                <input 
                type="radio"
                name="radio"
                value="Atendido"
                onChange={handleOptionChange}
                checked={ status === 'Atendido' }
                />
                <span>Atendido</span>
              </div>

              <label>Complemento</label>
              <textarea
                type="text"
                placeholder="Informações a mais...(opcional)"
                value={complemento}
                onChange={ (e) => setComplemento(e.target.value)}
              />

              <button type="submit">Registrar</button>
          </form>

        </div>
      </div>
    </div>
  )
}