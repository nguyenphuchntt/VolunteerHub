// Mock data for Social Feed

export const mockUsers = [
  {
    id: 1,
    name: "Robert Fox",
    username: "robert-fox",
    bio: "Software Engineer",
    avatar: "https://i.pravatar.cc/150?img=12",
    coverImage:
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Bessie Cooper",
    username: "bessie-cooper",
    bio: "Digital Marketer",
    avatar: "https://i.pravatar.cc/150?img=1",
    coverImage:
      "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=100&fit=crop",
  },
  {
    id: 5,
    name: "Jacob Jones",
    username: "jacob-jones",
    bio: "Sales Manager",
    avatar: "https://i.pravatar.cc/150?img=7",
    coverImage:
      "https://images.unsplash.com/photo-1557683304-679a1e9c45e2?w=400&h=100&fit=crop",
  },
];

export const mockPosts = [
  {
    id: 1,
    author: {
      id: 2,
      name: "Bessie Cooper",
      bio: "Digital Marketer",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    content:
      "In today's fast-paced, digitally driven world, digital marketing is not just a strategy. it's a necessity for businesses of all sizes. 📈",
    media: null,
    timestamp: "7 hours ago",
    likes: 24,
    isLiked: false,
    comments: [
      {
        id: 1,
        author: {
          id: 3,
          name: "Daniel Brown",
          bio: "Digital Marketer",
          avatar: "https://i.pravatar.cc/150?img=3",
        },
        content:
          "Fantastic post! Your content always brings a smile to my face. Keep up the great work! 👏",
        timestamp: "2 hours ago",
        isAuthor: false,
      },
      {
        id: 2,
        author: {
          id: 2,
          name: "Bessie Cooper",
          bio: "Digital Marketer",
          avatar: "https://i.pravatar.cc/150?img=1",
        },
        content: "Thank you for sharing your comment!",
        timestamp: "2 hours ago",
        isAuthor: true,
      },
      {
        id: 3,
        author: {
          id: 4,
          name: "David Martinez",
          bio: "Back-end Developer",
          avatar: "https://i.pravatar.cc/150?img=8",
        },
        content:
          "Your positivity is contagious! Thanks for brightening up my feed. Have a fantastic day!",
        timestamp: "2 hours ago",
        isAuthor: false,
      },
    ],
  },
  {
    id: 2,
    author: {
      id: 5,
      name: "Jacob Jones",
      bio: "Sales Manager",
      avatar: "https://i.pravatar.cc/150?img=7",
    },
    content:
      "Prepare to be dazzled by our latest collection! From trendy fashion to must-have gadgets, we've got something for everyone.",
    media:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=300&fit=crop",
    timestamp: "1 day ago",
    likes: 42,
    isLiked: true,
    comments: [],
  },
];

export const mockSuggestedFriends = [
  {
    id: 6,
    name: "Olivia Anderson",
    bio: "Financial Analyst",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 7,
    name: "Thomas Baker",
    bio: "Project Manager",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: 8,
    name: "Lily Lee",
    bio: "Graphic Designer",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: 9,
    name: "Andrew Harris",
    bio: "Data Scientist",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
];
