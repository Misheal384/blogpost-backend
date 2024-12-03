const db = require('../config/db');
const poolPromise = require('../config/db');


// Create a new blog post
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        // Check if title and content are provided
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        // Get the userId from the authenticated user
        const userId = req.user.userId; // This assumes `authenticateUser` middleware sets `userId` in req.user
        
        // Check if userId is present
        if (!userId) {
            return res.status(400).json({ message: 'User is not authenticated' });
        }

        console.log('Inserting post with title:', title, 'and content:', content);

        // Insert the post into the database with userId
        const [result] = await db.execute(
            'INSERT INTO blogposts (title, content, userId) VALUES (?, ?, ?)',
            [title, content, userId] // Now passing the correct userId
        );

        res.status(201).json({
            message: 'Post created successfully',
            postId: result.insertId,
        });
    } catch (error) {
        console.error('Error inserting post:', error);
        if (!res.headersSent) { // Prevent sending multiple responses
            res.status(500).json({ message: 'Error creating post', error: error.message });
        }
    }
};

  


   


// Get all blog posts
exports.getAllPosts = async (req, res) => {
    try {
        const [posts] = await db.execute('SELECT * FROM blogposts');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single blog post
exports.getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const [posts] = await db.execute('SELECT * FROM blogposts WHERE id = ?', [id]);
        if (posts.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(posts[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// Update a blog post
exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const [result] = await db.execute(
            'UPDATE blogposts SET title = ?, content = ? WHERE id = ?',
            [title, content, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    console.log("ID:", id);
console.log("Title:", title);
console.log("Content:", content);

};


exports.searchPosts = async (req, res) => {
    const { title } = req.query;

    // Log the received search query
    console.log('Search query:', title);

    try {
        const [rows] = await poolPromise.query(
            'SELECT * FROM blogposts WHERE LOWER(title) LIKE ?', 
            [`%${title.toLowerCase()}%`]
        );

        // Log the executed query for debugging
        console.log(`Query executed: SELECT * FROM blogposts WHERE LOWER(title) LIKE '%${title.toLowerCase()}%'`);

        if (rows.length === 0) {
            console.log('No posts found for query:', title);
            return res.status(404).json({ message: 'Post not found' });
        }

        console.log('Search results:', rows);
        res.json(rows);
    } catch (err) {
        console.error('Database query failed:', err); // Log full error object
        res.status(500).json({ error: 'Database query failed', details: err.message });
    }
};



// Protect this route: Only authenticated users can fetch their own posts
exports.getMyPosts = async (req, res) => {
    try {
      const userId = req.user.userId; // Extracted from the token
      console.log(`Fetching posts for user: ${userId}`);
  
      const [posts] = await db.execute('SELECT * FROM blogposts WHERE userId = ?', [userId]);
  
      if (posts.length === 0) {
        return res.status(404).json({ message: 'No posts found for this user' });
      }
  
      res.json(posts); // Only send the response once
    } catch (err) {
      console.error('Error fetching posts:', err);
      if (!res.headersSent) {  // Prevent sending response if headers are already sent
        return res.status(500).json({ error: err.message });
      }
    }
  };
  



// Delete a blog post
exports.deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute('DELETE FROM blogposts WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
