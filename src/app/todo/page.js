"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import TodoCard from "@/components/TodoCard";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function TodoPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState(""); // เพิ่ม state สำหรับ input
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUserName = sessionStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const userName = sessionStorage.userName;
    const response = await fetch(
      `/api/todos?userName=${encodeURIComponent(userName)}`
    );
    const data = await response.json();
    setTodos(data);
  };

  const addTodo = async () => {
    // if (newTodo.trim() === "") return; // ป้องกันการเพิ่ม todo ว่างๆ
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // เพิ่ม headers
      body: JSON.stringify({
        title: newTodo,
        userName: sessionStorage.userName,
      }),
    });
    if (response.ok) {
      setNewTodo(""); // ล้างค่า input หลังจากเพิ่มสำเร็จ
      fetchTodos();
    }
  };

  useEffect(() => {
    // ตรวจสอบข้อมูลจาก sessionStorage
    const Status = sessionStorage.getItem("userStatus");

    if (!Status || Status !== "ยืนยัน") {
      router.push("/login"); // ถ้าไม่ใช่ Admin ให้ไปหน้า login
    }
  }, [router]);

  const handleSignOut = async () => {
    const loginBy = sessionStorage.getItem("loginby");
    if (loginBy === "google") {
      // ลบข้อมูลใน sessionStorage
      sessionStorage.removeItem("loginby");
      sessionStorage.removeItem("userStatus");
      sessionStorage.removeItem("userEmail");
      sessionStorage.removeItem("userName");
      sessionStorage.removeItem("userImage");

      // เรียก signOut จาก next-auth
      await signOut({ redirect: false });

      // นำผู้ใช้ไปที่หน้า login
      router.push("/login");
    } else if (loginBy === "local") {
      // ลบข้อมูลใน sessionStorage
      sessionStorage.removeItem("loginby");
      sessionStorage.removeItem("userStatus");
      sessionStorage.removeItem("userName");

      // เรียก API logout
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // นำผู้ใช้ไปที่หน้า login
        router.push("/login");
      } else {
        console.error("Failed to logout");
      }
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // จัดเรียงรายการใหม่เมื่อมีการลากวาง
    const updatedTodos = Array.from(todos);
    const [movedTodo] = updatedTodos.splice(source.index, 1);
    updatedTodos.splice(destination.index, 0, movedTodo);

    setTodos(updatedTodos); // อัปเดต state ด้วยรายการที่จัดเรียงใหม่
  };

  return (
    <div className="min-h-screen bg-gray-700">
      {/* Navigation Bar */}
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">To-do List</h1>
        {userName && (
          <div className="flex items-center space-x-4">
            <span className="text-white">{userName}</span>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
      {/* Main Content */}

      <div className="p-8 flex flex-col items-center justify-center">
        <div className="mt-6 w-full max-w-lg">
          <textarea
            type="text"
            value={newTodo} // ผูก state กับ input field
            onChange={(e) => setNewTodo(e.target.value)} // อัปเดต state เมื่อมีการพิมพ์
            placeholder="Add a new task"
            className="w-full p-2 border border-gray-300 rounded shadow-md focus:outline-none focus:ring focus:ring-blue-500 text-black"
          />
          <button
            onClick={addTodo} // เรียก addTodo เมื่อกดปุ่ม
            className="mt-2 p-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
          >
            Add Task
          </button>
        </div>
        <div className="mt-6 space-y-4 w-full max-w-lg">
          {todos !== null &&
            todos !== undefined &&
            todos.length > 0 &&
            todos
              .slice()
              .reverse()
              .map((todo) => (
                <TodoCard key={todo.id} todo={todo} onRefresh={fetchTodos} />
              ))}
        </div>
      </div>
    </div>
  );
}
