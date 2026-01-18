const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Mock Data
let tasks = [
    { id: 1, title: 'Complete project proposal', status: 'In Progress' },
    { id: 2, title: 'Review team PRs', status: 'Pending' },
    { id: 3, title: 'Update documentation', status: 'Done' }
];

// GET /tasks
app.get('/tasks', (req, res) => {
    res.json({
        success: true,
        count: tasks.length,
        data: tasks
    });
});

app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
});
