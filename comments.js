// Create web server
const express = require('express');
const app = express();
const port = 3000;

// Import the file system module
const fs = require('fs');

// Import the body-parser module
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Import the comments.json file
const comments = require('./comments.json');

// GET /comments
app.get('/comments', (req, res) => {
    res.json(comments);
});

// POST /comments
app.post('/comments', (req, res) => {
    const newComment = req.body;
    comments.push(newComment);

    fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
        if (err) {
            res.status(500).json({error: 'Error writing to file'});
            return;
        }

        res.json(newComment);
    });
});

// DELETE /comments/:id
app.delete('/comments/:id', (req, res) => {
    const id = req.params.id;
    const commentIndex = comments.findIndex(comment => comment.id == id);

    if (commentIndex === -1) {
        res.status(404).json({error: 'Comment not found'});
        return;
    }

    comments.splice(commentIndex, 1);

    fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
        if (err) {
            res.status(500).json({error: 'Error writing to file'});
            return;
        }

        res.json({success: true});
    });
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});