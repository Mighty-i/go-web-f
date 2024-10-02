export async function POST(req) {
    try {
      const body = await req.json();
  
      // ทำการเรียก API ภายนอกเพื่อทำการ login
      const response = await fetch("http://localhost:8088/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        return new Response(
          JSON.stringify({ message: "Login failed" }),
          { status: response.status }
        );
      }
  
      const data = await response.json();
  
      // ส่งข้อมูลกลับไปยัง client
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      console.error("Error:", error.message);
      return new Response(
        JSON.stringify({ message: "Internal Server Error" }),
        { status: 500 }
      );
    }
  }