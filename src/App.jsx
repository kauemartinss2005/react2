import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "./services/api";
import Todo from "./components/Todo.jsx";
import TodoForm from "./components/TodoForm.jsx";
import Search from "./components/Search.jsx";
import Login from "./pages/Login.jsx";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn && window.location.pathname !== "/login") {
      navigate("/login");
    }
  }, [navigate]);

  const carregarTarefas = async () => {
    try {
      const response = await api.get("/todos");
      const tarefas = response.data.map((tarefa) => ({
        id: tarefa.id,
        text: tarefa.title,
        category: tarefa.category || "Outro",
        isCompleted: tarefa.completed,
      }));
      setTodos(tarefas);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
  };

  const addTodo = async (text, category) => {
    try {
      const response = await api.post("/todos", {
        title: text,
        category,
        completed: false,
      });

      const novaTarefa = {
        id: response.data.id,
        text,
        category,
        isCompleted: false,
      };

      setTodos([novaTarefa, ...todos]);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  const removeTodo = (id) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
  };

  const completeTodo = (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(newTodos);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <div className="app">
              <h1>Lista de Tarefas</h1>

              <button className="logout" onClick={handleLogout}>
                Login
              </button>

              <Search search={search} setSearch={setSearch} />

              <button onClick={carregarTarefas} className="load-btn">
                Carregar tarefas da API
              </button>

              <div className="todo-list">
                {todos.length === 0 && <p>Nenhuma tarefa carregada.</p>}
                {todos
                  .filter((todo) =>
                    todo.text.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((todo) => (
                    <Todo
                      key={todo.id}
                      todo={todo}
                      removeTodo={removeTodo}
                      completeTodo={completeTodo}
                    />
                  ))}
              </div>

              <TodoForm addTodo={addTodo} />
            </div>
          }
        />
      </Routes>

      <footer className="footer">
        © {new Date().getFullYear()} Kauê Matriz —{" "}
        <a href="https://www.seusite.com" target="_blank" rel="noreferrer">
          www.seusite.com
        </a>
        . Todos os direitos reservados.
      </footer>
    </>
  );
}

export default App;
