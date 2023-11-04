import { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = "ACE";
  return config;
});

const Todolist = () => {
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTask, setNewTask] = useState("");

  const fetchTodos = async (searchQuery) => {
    try {
      const response = await api.get("/todos", {
        params: {
          q: searchQuery,
        },
      });
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos: ", error);
    }
  };

  useEffect(() => {
    let debounceTimer;
    const delay = 2000;

    debounceTimer = setTimeout(() => {
      console.log("Hello");
      fetchTodos(searchTerm);
    }, delay);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTaskChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  const handleDone = async (todo) => {
    try {
      const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
      const response = await api.put(`/todos/${todo.id}`, updatedTodo);
      setTodos((prevTodos) => {
        const index = prevTodos.findIndex((t) => t.id === response.data.id);
        if (index !== -1) {
          prevTodos[index] = response.data;
        }
        return [...prevTodos];
      });
    } catch (error) {
      console.error("Error toggling completion status: ", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();

    if (newTask.trim() === "") {
      return;
    }

    const newTodo = {
      taskName: newTask,
      isCompleted: false,
    };

    try {
      const response = await api.post("/todos", newTodo);
      setTodos([...todos, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding todo: ", error);
    }
  };

  return (
    <div className="todolist">
      <div className="search">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search "
        />
      </div>
      <form className="addTask" onSubmit={addTask}>
        <input
          type="text"
          value={newTask}
          onChange={handleTaskChange}
          placeholder="Add a task........"
        />
        <button className="addtask-btn">Add Task</button>
      </form>
      <div className="lists">
        {true
          ? todos.map((todo, id) => (
              <div
                key={id}
                className={`list ${todo.isCompleted ? "completed" : ""}`}
              >
                <p>{todo.taskName}</p>
                <div className="span-btns">
                  {!todo.isCompleted && (
                    <span
                      onClick={() => handleDone(todo)}
                      title="completed"
                      className="toggle-button"
                    >
                      ✓
                    </span>
                  )}
                  {todo.isCompleted && (
                    <span
                      onClick={() => handleDone(todo)}
                      title="uncompleted"
                      className="toggle-button"
                    >
                      ^
                    </span>
                  )}
                  <span
                    className="delete-btn"
                    onClick={() => handleDelete(todo.id)}
                    title="delete"
                  >
                    x
                  </span>
                </div>
              </div>
            ))
          : todos.map((todo, id) => (
              <div
                key={id}
                className={`list ${todo.isCompleted ? "completed" : ""}`}
              >
                <p>{todo.taskName}</p>
                <div className="span-btns">
                  {!todo.isCompleted && (
                    <span
                      onClick={() => handleDone(todo)}
                      title="completed"
                      className="toggle-button"
                    >
                      ✓
                    </span>
                  )}
                  {todo.isCompleted && (
                    <span
                      onClick={() => handleDone(todo)}
                      title="uncompleted"
                      className="toggle-button"
                    >
                      ^
                    </span>
                  )}
                  <span
                    className="delete-btn"
                    onClick={() => handleDelete(todo.id)}
                    title="delete"
                  >
                    x
                  </span>
                </div>
              </div>
            ))}
        {!searchTerm && !todos.length && <h1>No Records</h1>}
      </div>
    </div>
  );
};

export default Todolist;
