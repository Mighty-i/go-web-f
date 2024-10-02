export async function POST(req) {
  try {
    const response = await fetch("http://localhost:8088/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      return new Response(JSON.stringify({ message: "Logout successful" }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ message: "Failed to logout" }), {
        status: response.status,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
