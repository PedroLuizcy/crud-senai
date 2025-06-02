// Listar, inserir e excluir tarefas

// Importa o React e useState para gerenciar estado
import React, { useState, useEffect } from 'react';
// Importa o axios para fazer requisições HTTP
import axios from 'axios';
// Importa o usenavigation para redirecionamento
import { useNavigate } from 'react-router-dom';

// Definir componentes Tarefas
const Tarefas = () => {
    // Estado para listar as tarefas 
    const [tarefas, setTarefas] = useState([]);

    // Estado para título de tarefas
    const [titulo, setTitulo] = useState('');

     // Estado para a mensagem de resposta
    const [message, setMessage] = useState('');
    // hook para navegação
    const navigate = useNavigate();

    // Funçao para carregar tárefas do usuário
    const fetchTarefas = async () => {
        try{
            //obter token do localstorage
            const token = localStorage.getItem('token');
            if(!token){
                setMessage('Erro: você precisa estar logado para ver as tarefas.');
                navigate('/login');
                return;
            }
            // GET para listar as tarefas
            const response = await axios.get('http://localhost:3001/api/tarefas', {headers: {Authorization: `Bearer ${token}`}
            });

            // Atualiza o estado com as tarefas
            setTarefas(response.data.tarefas);
        } catch(error) {
            // Define a mensagem de erro
             setMessage(`Erro: ${error.response?.data?.message || 'Falha ao listar tarefas'}`);
             if(error.response.status === 401 || error.response?.status === 403){
                navigate('/login');
             }
        }
    };

    // Carrega as tarefas quando o componente é montado
    useEffect(() =>{
        fetchTarefas();
    }, []);

    // função para incluir tarefas
    const handleCreate = async (e) => {
        // Impede o comportamento padrão do formulário
        e.preventDefault();
        try {
            // obter token do localstorage
            const token = localStorage.getItem('token');
            if(!token){
                setMessage('Erro: você precisa estar logado');
                nagivate('/login');
                return;
            }
            // POST para inserir tarefas
            const response = await axios.post('http://localhost:3001/api/tarefas', {titulo}, {headers: {Authorization: `Bearer ${token}`}
            });
             // Define a mensagem de sucesso
            setMessage(`Sucesso: ${response.data.message} (ID: ${response.data.tarefaId})`);
            //Limpa os campos
            setTitulo(''); //limpa o campo
            fetchTarefas(); //recarrega tarefas
        } catch(error) {
            //Define a mensagem de erro
            setMessage(`Erro: ${error.response?.data?.message || 'Falha ao listar tarefas'}`);
        }
    };
    const handleDelete = async (id) => {
         try {
            // obter token do localstorage
            const token = localStorage.getItem('token');
            if(!token){
                setMessage('Erro: você precisa estar logado para ver as tarefas');
                nagivate('/login');
                return;
            }
            // DELETE para deletar tarefas
            const response = await axios.delete(`http://localhost:3001/api/tarefas/${id}`, {headers: {Authorization: `Bearer ${token}`}
            });
             // Define a mensagem de sucesso
            setMessage(`Sucesso: ${response.data.message} (ID: ${response.data.tarefa})`);
            //Limpa os campos
            fetchTarefas(); //recarrega tarefas
        } catch(error) {
            //Define a mensagem de erro
            setMessage(`Erro: ${error.response?.data?.message || 'Falha ao excliuir tarefas'}`);
        }
    }

    // Renderiza o componente
    return (
        <div className="container mt-4">
            <h2 className="text-center">Minhas tarefas</h2>
            {/* Exibe a mensagem de resposta */}
            {message && <div className="alert alert-info">{message}</div>}
            {/* Formulário de registro */}
            <form onSubmit={handleCreate} className='mt-4'>
                <div className="mb-3">
                    <label htmlFor="titulo" className="form-label">Título</label>
                    <input
                        type="titulo"
                        className="form-control"
                        id="titulo"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Criar Tarefas</button>
            </form>

            <ult className='list-group'>
                {tarefas.map((tarefa) => (
                    <li key='{tarefa.id}' className='list-group-item d-flex justify-content-between align-items-center'>
                        {tarefa.titulo}
                        <button className='btn btn-danger' onClick={() => handleDelete(tarefa.id)}>Excluir</button>
                    </li>
                ))}
            </ult>
        </div>
    );

};

//exportando o componente
export default Tarefas;