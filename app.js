require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const indexRouter = require('./routes/index');

// Serve static assets (css, js, images) from /public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Routes
app.use('/', indexRouter);

// 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`NextGen Developer server running → http://localhost:${PORT}`);
});
