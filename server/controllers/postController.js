import Post from '../models/Post.js';
import User from '../models/User.js';

// Helper to format post structure to match frontend expectations
const formatPost = (post) => {
  const authorInfo = post.userId || { name: 'Anonymous', role: 'student', avatar: 'U' };
  
  // Format comments
  const formattedComments = (post.comments || []).map(c => {
    const commentAuthor = c.userId || { name: 'Anonymous', role: 'student', avatar: 'U' };
    return {
      id: c._id,
      author: commentAuthor.name,
      authorRole: commentAuthor.role,
      avatar: commentAuthor.avatar || commentAuthor.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
      content: c.content,
      timestamp: formatRelativeTime(c.createdAt || c.timestamp || new Date())
    };
  });

  return {
    id: post._id,
    title: post.title,
    content: post.content,
    author: authorInfo.name,
    authorRole: authorInfo.role,
    authorAvatar: authorInfo.avatar || authorInfo.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
    likes: (post.likes || []).length,
    likedByCurrentUser: false,
    commentsCount: (post.comments || []).length,
    timestamp: formatRelativeTime(post.createdAt || post.timestamp || new Date()),
    comments: formattedComments
  };
};

const formatRelativeTime = (date) => {
  if (typeof date === 'string' && !Date.parse(date)) return date; // Return original if mock string like "2 hours ago"
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

// @desc    Get all forum posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const { search, sort, authorRole } = req.query;
    const query = {};

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { title: { $regex: term, $options: 'i' } },
        { content: { $regex: term, $options: 'i' } },
      ];
    }

    let posts = await Post.find(query)
      .populate('userId', 'name role avatar')
      .populate('comments.userId', 'name role avatar');

    if (authorRole && authorRole !== 'all') {
      posts = posts.filter((p) => p.userId?.role === authorRole);
    }

    if (sort === 'likes') {
      posts.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    } else {
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const formatted = posts.map((p) => {
      const f = formatPost(p);
      if (req.user) {
        f.likedByCurrentUser = p.likes.some(
          (id) => id.toString() === req.user._id.toString()
        );
      }
      return f;
    });

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('userId', 'name role avatar')
      .populate('comments.userId', 'name role avatar');

    if (post) {
      const formatted = formatPost(post);
      if (req.user) {
        formatted.likedByCurrentUser = post.likes.includes(req.user._id);
      }
      return res.json(formatted);
    } else {
      return res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create forum post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = new Post({
      title,
      content,
      userId: req.user._id,
      likes: [],
      comments: []
    });

    const createdPost = await post.save();
    
    // Populate user info for immediate response
    const populated = await Post.findById(createdPost._id).populate('userId', 'name role avatar');
    
    return res.status(201).json(formatPost(populated));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Like / unlike forum post
// @route   POST /api/posts/:id/like
// @access  Private
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      const likeIndex = post.likes.indexOf(req.user._id);
      if (likeIndex !== -1) {
        // Already liked, so unlike
        post.likes.splice(likeIndex, 1);
      } else {
        // Add like
        post.likes.push(req.user._id);
      }

      await post.save();
      return res.json({
        likes: post.likes.length,
        likedByCurrentUser: post.likes.includes(req.user._id)
      });
    } else {
      return res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to forum post
// @route   POST /api/posts/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await Post.findById(req.params.id);

    if (post) {
      post.comments.push({
        userId: req.user._id,
        content
      });

      await post.save();

      // Retrieve full updated post with populates
      const updatedPost = await Post.findById(post._id)
        .populate('userId', 'name role avatar')
        .populate('comments.userId', 'name role avatar');

      const formatted = formatPost(updatedPost);
      if (req.user) {
        formatted.likedByCurrentUser = updatedPost.likes.includes(req.user._id);
      }
      return res.status(201).json(formatted);
    } else {
      return res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
