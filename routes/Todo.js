const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

/**
 * Todo API Routes
 * POST /api/todos - Create a new todo
 * GET /api/todos - Retrieve all todos for logged-in user
 * GET /api/todos/:id - Retrieve a specific todo by ID
 * PUT /api/todos/:id - Update a specific todo
 * DELETE /api/todos/:id - Delete a specific todo
 */

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new todo
 *     security:
 *       - BearerAuth: []
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *     responses:
 *       201:
 *         description: Todo created successfully
 *       400:
 *         description: Invalid request
 * 
 *   get:
 *     summary: Get all todos for logged-in user
 *     security:
 *       - BearerAuth: []
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: List of todos
 *       500:
 *         description: Server error
 * 
 * /todos/{id}:
 *   get:
 *     summary: Get a specific todo
 *     security:
 *       - BearerAuth: []
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo found
 *       404:
 *         description: Todo not found
 * 
 *   put:
 *     summary: Update a todo
 *     security:
 *       - BearerAuth: []
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       404:
 *         description: Todo not found
 * 
 *   delete:
 *     summary: Delete a todo
 *     security:
 *       - BearerAuth: []
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       404:
 *         description: Todo not found
 */

// Create a new todo
router.post('/', auth, async (req, res) => {
  try {
    const todo = new Todo({ ...req.body, user: req.user.id });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all todos for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single todo by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a todo
router.put('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;