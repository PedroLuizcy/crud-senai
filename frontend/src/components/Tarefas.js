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
    const [tarefas, SetTarefas] = useState([]);

    // Estado para título de tarefas
    const [titulo, SetTitulo] = useState('');

     // Estado para a mensagem de resposta
    const [message, setMessage] = useState('');
    // hook para navegação
    const navigate = useNavigate();

    // Funçao para carregar tárefas do usuário
    const fetchTarefas = async () => {
        try{
            //obter token do localstorage
            const token = localStorage.getItem('token');
            if(token){
                setMessage('Erro: você precisa estar logado para ver as tarefas.');
                navigate('/login');
                return;
            }
            // GET para listar as tarefas
            const response = await axios.get('http://localhost:3001/tarefas', {headers: {Authorization: 'Bearer ${token}'}
            });

            // Atualiza o estado com as tarefas
            SetTarefas(response.data.tarefas);
        } catch {
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
    const handleSubmit = async (e) => {
        // Impede o comportamento padrão do formulário
        e.preventDefault();
        try {
            // obter token do localstorage
            const token = localStorage.getItem('token');
            if(!token){
                setMessage('Erro: você precisa estar logado para ver as tarefas');
                nagivate('/login');
                return;
            }
            // GET para listar tarefas
            const response = await axios.get('http://localhost:3001/api/tarefas', {headers: {Authorization: 'Bearer ${token}'}
            });
             // Define a mensagem de sucesso
            setMessage(`Sucesso: ${response.data.message} (ID: ${response.data.tarefa})`);
            //Limpa os campos
            SetTitulo(''); //limpa o campo
            fetchTarefas(); //recarrega tarefas
        } catch(error) {
            //Define a mensagem de sucesso
            setMessage(`Erro: ${error.response?.data?.message || 'Falha ao listar tarefas'}`);
            if(error.response.status === 401 || error.response?.status === 403){
                navigate('/login');
             };
        }
    };
};