const express = require('express');
const router = express.Router();
const {
    createTodo,
    getTodos,
    getTodo,
    updateTodo,
    deleteTodo
} = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All routes are protected

router.route('/')
    .post(createTodo)
    .get(getTodos);

router.route('/:id')
    .get(getTodo)
    .put(updateTodo)
    .delete(deleteTodo);

module.exports = router;
