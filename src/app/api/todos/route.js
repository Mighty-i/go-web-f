export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userName = url.searchParams.get("userName");
    if (!userName) {
      return new Response(
        JSON.stringify({ error: "userName query parameter is required" }),
        {
          status: 400,
        }
      );
    }
    const response = await fetch(
      `http://localhost:8080/api/todos?userName=${encodeURIComponent(userName)}`
    );
    if (!response.ok) {
      console.error(`Failed to fetch todos. Status: ${response.status}`);
      return new Response(
        JSON.stringify({ error: "Failed to fetch todos from external API" }),
        {
          status: response.status,
        }
      );
    }
    const todos = await response.json();
    return new Response(JSON.stringify(todos));
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to fetch todos due to internal error" }),
      {
        status: 500,
      }
    );
  }
}

export async function POST(req) {
  const body = await req.json();
  await fetch("http://localhost:8080/api/CreateTodo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return new Response(null, { status: 201 });
}

export async function PUT(req) {
  const body = await req.json();
  // const id = req.nextUrl.pathname.split("/").pop(); // ดึง id จาก URL

  if (body.title) {
    const response = await fetch(`http://localhost:8080/api/updatetitle`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ message: "Failed to update todo" }),
        {
          status: 500,
        }
      );
    }

    return new Response(null, { status: 200 });
  } else {
    // ถ้าไม่มี title ให้ใช้โค้ดอีกอัน
    const response = await fetch(`http://localhost:8080/api/UpdateDone`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ message: "Failed to update todo" }),
        {
          status: 500,
        }
      );
    }

    return new Response(null, { status: 200 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json(); // ดึงข้อมูลจาก body ของ request
    // const { id } = body; // ดึงค่า id จาก body

    const response = await fetch(`http://localhost:8080/api/DeleteTodo`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete. Status: ${response.status}`);
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to delete todo" }), {
      status: 500,
    });
  }
}
