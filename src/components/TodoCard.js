import { useState } from "react";

export default function TodoCard({ todo, onRefresh }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const toggleDone = async () => {
    try {
      const response = await fetch(`/api/todos/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: todo.id, done: !todo.done }),
      });
      onRefresh();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error:", error);
      // แสดงข้อความผิดพลาดที่เหมาะสม
    }
  };

  const deleteTodo = async () => {
    const response = await fetch(`/api/todos/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: todo.id }),
    });
    onRefresh();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  };

  const saveTitle = async () => {
    try {
      const response = await fetch(`/api/todos/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: todo.id, title: newTitle }),
      });
      onRefresh();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error:", error);
      // แสดงข้อความผิดพลาดที่เหมาะสม
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex justify-between items-center">
      <div className="flex items-center">
        <button
          onClick={toggleDone}
          className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
            todo.done ? "bg-green-500 text-white" : "border border-gray-400"
          }`}
        >
          {todo.done ? "✓" : ""}
        </button>
        {isEditing ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="text-black border border-gray-300 rounded px-2 py-1"
          />
        ) : (
          <span className={`${todo.done ? "line-through" : ""} text-black`}>
            {todo.title}
          </span>
        )}
      </div>
      <div className="flex items-center">
        {isEditing ? (
          <button
            onClick={saveTitle}
            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
          >
            Save
          </button>
        ) : (
          !todo.done && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
            >
              Edit
            </button>
          )
        )}
        <button
          onClick={deleteTodo}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
