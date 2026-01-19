const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Mock Data
const tasks = [
  { id: 1, title: 'Complete project proposal', status: 'In Progress', assignee: 'Alex' },
  { id: 2, title: 'Review team PRs', status: 'Pending', assignee: 'Sam' },
  { id: 3, title: 'Update documentation', status: 'Done', assignee: 'Alex' },
  { id: 4, title: 'Ship onboarding emails', status: 'Pending', assignee: 'Maya' }
];

app.get('/tasks', (req, res) => {
  const { status, assignee } = req.query;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const offset = req.query.offset ? Number(req.query.offset) : 0;

  if (!Number.isInteger(limit) || !Number.isInteger(offset) || limit < 0 || offset < 0) {
    return res.status(400).json({
      success: false,
      message: 'limit and offset must be non-negative integers.'
    });
  }

  let results = tasks;

  if (status) {
    results = results.filter((task) => task.status.toLowerCase() === status.toLowerCase());
  }

  if (assignee) {
    results = results.filter((task) => task.assignee.toLowerCase() === assignee.toLowerCase());
  }

  const paged = results.slice(offset, offset + limit);

  res.json({
    success: true,
    count: paged.length,
    data: paged,
    pagination: {
      total: results.length,
      limit,
      offset,
      hasMore: offset + limit < results.length
    }
  });
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
