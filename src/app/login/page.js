
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

export default function LoginPage() {
  const { data: session } = useSession();
  const [userStatus, setUserStatus] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleLogin = async () => {
    const response = await fetch("/api/loginlocal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    console.log("Login response status:", response.status);
    if (response.ok) {
      const data = await response.json();
      console.log("Data received from Next.js API:", data);
      if (data.status === "ยืนยัน") {
        sessionStorage.setItem("loginby", "local");
        sessionStorage.setItem("userStatus", data.status);
        sessionStorage.setItem("userName", data.user);
        router.push("/todo");
      } else {
        alert("Login failed: Invalid status");
      }
    } else {
      alert("Login failed");
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Registration successful:", data);
      setShowRegister(false);
      // Handle successful registration (e.g., show success message)
    } catch (error) {
      console.error("Error:", error);
      // Handle registration error (e.g., show error message to user)
    }
  };

  useEffect(() => {
    const checkUserStatus = async () => {
      if (session) {
        try {
          console.log("Session:", session);
          const response = await fetch(
            "http://localhost:8088/check-google-user",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
              },
              body: JSON.stringify({
                google_id: session.accessToken,
                email: session.user.email,
                profile_image: session.user.image,
                username: session.user.name,
              }),
            }
          );

          const data = await response.json();
          console.log("User status data:", data);
          setUserStatus(data.status);

          // เก็บข้อมูลใน sessionStorage
          sessionStorage.setItem("loginby", "google");
          sessionStorage.setItem("userStatus", data.status);
          sessionStorage.setItem("userEmail", session.user.email);
          sessionStorage.setItem("userName", session.user.name);
          sessionStorage.setItem("userImage", session.user.image);
        } catch (error) {
          console.error("Error fetching user status:", error);
        }
      }
    };

    checkUserStatus();
  }, [session]);

  useEffect(() => {
    console.log("User status:", userStatus);
    if (userStatus === "ยืนยัน") {
      router.push("/todo");
    }
  }, [userStatus, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-black">Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <button
          onClick={() => signIn("google")}
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 mt-4"
        >
          Login with Google
        </button>
        <button
          type="button"
          onClick={() => setShowRegister(true)}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-8"
        >
          Register
        </button>
        {showRegister && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-black">Register</h2>
              <form onSubmit={handleRegisterSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={registerData.username}
                    onChange={handleRegisterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Register
                </button>
              </form>
              <button
                type="button"
                onClick={() => setShowRegister(false)}
                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mt-4"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
