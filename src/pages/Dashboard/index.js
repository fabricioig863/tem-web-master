import './dashboard.css';
import { useState, useEffect, useCallback } from 'react';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { MdDeleteForever } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

import firebase from '../../services/firebaseConnection';
import Modal from '../../components/Modal';

const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');

export default function Dashboard(){
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();

  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

  useEffect(() => {
    async function loadChamados(){
      await listRef.limit(5)
      .get()
      .then((snapshot) => {
        updateState(snapshot)
      })
      .catch((error) => {
        console.log('Deu algum erro: ', error);
        setLoadingMore(false);
      })
  
      setLoading(false);
    }

    loadChamados();

    return () => {

    }
  },[])


  async function updateState(snapshot){
    const isCollectionEmpty = snapshot.size === 0;

    if(!isCollectionEmpty){
      let list = [];

      snapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          assunto: doc.data().assunto,
          pacientes: doc.data().pacientes,
          pacienteId: doc.data().pacienteId,
          created: doc.data().created,
          createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento
        })
      })

      const lastDoc = snapshot.docs[snapshot.docs.length -1]; //Pegando o ultimo documento buscado

      setChamados(chamados => [...chamados, ...list])
      setLastDocs(lastDoc);
    }else{
      setIsEmpty(true);
    }

    setLoadingMore(false);
  }

  async function handleMore(){
    setLoadingMore(true);
    await listRef.startAfter(lastDocs).limit(5)
    .get()
    .then((snapshot) => {
      updateState(snapshot);
    })
  }


  function togglePostModal(item){
    setShowPostModal(!showPostModal) //troca de true pra false com base no valor do estado.
    setDetail(item);
  }

  const deleteItem = useCallback((item) => {
    firebase.firestore().collection('chamados').doc(item)
    .delete()
    .then(() => {
      let chamadosPatients = chamados.filter(id => item.id !== id)
      setChamados(chamadosPatients);
      toast.success('Item deletado com sucesso!');
    })
    .catch((err) => {
      toast.error('Ops erro ao tentar deletar item.');
      console.log(err)
    })

  }, [chamados])

  if(loading === true){
    return(
      <div>
        <Header />
        <div className="content">
          <Title name="Atendimentos">
            <FiMessageSquare size={25} />
          </Title>

          <div className="container dashboard">
            <span>Buscando chamados...</span>
          </div>

        </div>
      </div>
    )
  }


  return(
    <div>
      <Header />
      <div className="content">
        <Title name="Atendimentos">
          <FiMessageSquare size={25} />
        </Title>

        {chamados.length === 0 ? (
           <div className="container dashboard">
           <span>Nenhum chamado registrado...</span>
 
           <Link to="/new" className="new">
             <FiPlus size={25} color="#FFF" />
             Novo chamado
           </Link>
         </div>
        ): (
        <>  
          <Link to="/new" className="new">
            <FiPlus size={25} color="#FFF" />
            Novo chamado
          </Link>

          <table>
            <thead>
              <tr>
                <th scope="col">Paciente</th>
                <th scope="col">Assunto</th>
                <th scope="col">Status</th>
                <th scope="col">Cadastrado em</th>
                <th scope="col">#</th>
              </tr>
            </thead>
            <tbody>
              {chamados.map((item, index) =>{
                return(
                <tr key={index}>
                  <td data-label="Paciente">{item.pacientes}</td>
                  <td data-label="Assunto">{item.assunto}</td>
                  <td data-label="Status">
                    <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999' }}>{item.status}</span>
                  </td>
                  <td data-label="Cadastrado Em">{item.createdFormated}</td>
                  <td data-label="#">
                    <button className="action" style={{backgroundColor: '#3583f6' }} onClick={ () => togglePostModal(item)}>
                      <FiSearch color="#FFF" size={17} />
                    </button>
                    <button className="action" style={{backgroundColor: '#FF0000' }} onClick={ () => deleteItem(item.id)}>
                      <MdDeleteForever color="#FFF" size={17} />
                    </button>
                    <Link className="action" style={{backgroundColor: '#F6a935' }} to={`/new/${item.id}`} >
                      <FiEdit2 color="#FFF" size={17} />
                    </Link>
                  </td>
                </tr>
                )           
              })}
            </tbody>
          </table>

          {loadingMore && <h3 style={{textAlign: 'center', marginTop: 15 }}>Buscando dados...</h3>}
          { !loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais </button>}
        </>
        )}

      </div>

      {showPostModal && (
        <Modal 
          conteudo={detail}
          close={togglePostModal}
        />
      )}

    </div>
  )
}
