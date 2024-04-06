const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const { MongoClient, ServerApiVersion } = require("mongodb");
// mongodb+srv://kavinsde:<password>@cluster0.9coc7my.mongodb.net/
const uri =
  "mongodb+srv://kavinsde:kavinsde@cluster0.9coc7my.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

const path = require("path");

app.use(
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist/"))
);

app.use(
  express.static(path.join(__dirname, "../node_modules/@popperjs/core/dist/"))
);

app.use(express.static(path.join(__dirname, "../node_modules/jquery/dist/")));

app.use(express.static(path.join(__dirname, "../frontend/src/")));

app.get("/", (req, res) => {
  const indexPath = path.join(
    __dirname,
    "..",
    "frontend",
    "public",
    "index.html"
  );
  res.sendFile(indexPath);
});

app.get("/login", (req, res) => {
  const indexPath = path.join(
    __dirname,
    "..",
    "frontend",
    "public",
    "login.html"
  );
  res.sendFile(indexPath);
});

app.get("/register", (req, res) => {
  const indexPath = path.join(
    __dirname,
    "..",
    "frontend",
    "public",
    "register.html"
  );
  res.sendFile(indexPath);
});

app.get("/chat", (req, res) => {
  const indexPath = path.join(
    __dirname,
    "..",
    "frontend",
    "public",
    "chat.html"
  );
  res.sendFile(indexPath);
});

app.get("/logout", (req, res) => {
  const indexPath = path.join(
    __dirname,
    "..",
    "frontend",
    "public",
    "register.html"
  );
  res.sendFile(indexPath);
});

const main = io.of("/");

main.on("connection", (socket) => {
  socket.on("join", (data) => {
    socket.join(data.room);
    main.in(data.room).emit("message", `New user joined ${data.room} room!`);
  });

  socket.on("message", (data) => {
    console.log(`Message: ${data.msg}`);
    main.in(data.room).emit("message", data.msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    main.emit("message", "user disconnected");
  });
});

const register = io.of("/register");

register.on("connection", (socket) => {
  socket.on("user", (user) => {
    console.log(user);
    console.log(user.hashedPassword);
  });
});
