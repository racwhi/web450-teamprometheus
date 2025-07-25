/**
 * Author: Professor Krasso, Marshall Huckins and Rachel White
 * Date: 7 August 2024
 * File: app.js
 * Description: Application setup. Autogenerated using Express generator.
 */

// require statements
const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const { notFoundHandler, errorHandler } = require('./error-handler');

const indexRouter     = require('./routes/index');
const taskRouter      = require('./routes/tasks');
const projectRouter   = require('./routes/projects');

const app = express();

// ─── UNCONDITIONAL MONGODB CONNECT ────────────────────────────────────────────
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`MongoDB connected to "${mongoose.connection.name}"`))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // stop if we can’t connect
  });
// ────────────────────────────────────────────────────────────────────────────────

// CORS middleware with preflight OPTIONS handling
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Standard Express middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Route definitions
app.use('/api', indexRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/projects', projectRouter);

// Serve Angular static files (Angular 17+ puts build in "browser" subfolder)
app.use(express.static(path.join(__dirname, '../../tms-client/dist/tms-client/browser')));

// Fallback to Angular's index.html for unknown frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../tms-client/dist/tms-client/browser/index.html'));
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
