// Bun server to serve the p5.js game
const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    // Serve index.html for root path
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(Bun.file("index.html"), {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Serve compiled game bundle
    if (url.pathname === "/game.js") {
      return new Response(Bun.file("dist/main.js"), {
        headers: { "Content-Type": "application/javascript" },
      });
    }

    // Serve legacy sketch.js (for backwards compatibility during migration)
    if (url.pathname === "/sketch.js") {
      return new Response(Bun.file("sketch.js"), {
        headers: { "Content-Type": "application/javascript" },
      });
    }

    // Serve p5.js from node_modules
    if (url.pathname === "/p5.js" || url.pathname === "/p5.min.js") {
      return new Response(Bun.file("node_modules/p5/lib/p5.min.js"), {
        headers: { "Content-Type": "application/javascript" },
      });
    }

    // Serve background SVG
    if (url.pathname === "/background.svg") {
      return new Response(Bun.file("background.svg"), {
        headers: { "Content-Type": "image/svg+xml" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`🎮 Game server running at http://localhost:${server.port}`);
