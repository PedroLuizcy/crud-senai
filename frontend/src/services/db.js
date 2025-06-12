import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

const sqlite = new SQLiteConnection(CapacitorSQLite);

let db = null;

const initDB = async () => {
    try {
        db = await sqlite.createConnection('tarefas', false, 'no-encryption', 1);
        await db.open();
        console.log('Banco de dados aberto');

        // Criar tabelas
        await db.execute(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
        `);
        await db.execute(`
            CREATE TABLE IF NOT EXISTS tarefas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                userId INTEGER NOT NULL,
                FOREIGN KEY(userId) REFERENCES usuarios(id)
            );
        `);
        console.log('Tabelas criadas');
    } catch (error) {
        console.error('Erro ao inicializar DB:', error);
    }
};

const login = async (email, senha) => {
    try {
        const result = await db.query('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, senha]);
        if (result.values.length > 0) {
            return { id: result.values[0].id, token: 'fake-token' }; // Simula JWT
        }
        throw new Error('Credenciais inválidas');
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
};

const cadastrar = async (email, senha) => {
    try {
        await db.run('INSERT INTO usuarios (email, password) VALUES (?, ?)', [email, senha]);
        console.log('Usuário cadastrado');
    } catch (error) {
        console.error('Erro no cadastro:', error);
        throw error;
    }
};

const getTarefas = async (userId) => {
    try {
        const result = await db.query('SELECT * FROM tarefas WHERE userId = ?', [userId]);
        return result.values;
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        throw error;
    }
};

const addTarefa = async (titulo, userId) => {
    try {
        await db.run('INSERT INTO tarefas (titulo, userId) VALUES (?, ?)', [titulo, userId]);
        console.log('Tarefa adicionada');
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
        throw error;
    }
};

export { initDB, login, cadastrar, getTarefas, addTarefa };