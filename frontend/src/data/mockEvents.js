// Mock data for Events and Event Feed

export const mockEvents = [
  {
    id: 1,
    title: "Beach Cleanup Drive",
    description:
      "Join us for a community beach cleanup to protect our ocean and marine life. All supplies provided!",
    fullDescription:
      "Make a difference this weekend by joining our beach cleanup initiative. We'll be cleaning the coastline, collecting plastic waste, and raising awareness about ocean conservation. This is a great opportunity to meet like-minded people while contributing to environmental protection. All cleaning supplies, gloves, and bags will be provided. Don't forget to bring sunscreen and water!",
    coverImage:
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&h=400&fit=crop",
    date: "2025-11-10",
    time: "09:00 AM",
    endTime: "12:00 PM",
    location: "Santa Monica Beach, CA",
    status: "completed", // upcoming, ongoing, completed
    category: "Environment",
    tags: ["cleanup", "ocean", "community", "volunteer"],
    host: {
      id: 10,
      name: "Green Earth Foundation",
      avatar: "https://i.pravatar.cc/150?img=20",
      type: "organization",
    },
    participants: [
      {
        user: {
          id: 1,
          name: "Robert Fox",
          avatar: "https://i.pravatar.cc/150?img=12",
        },
        role: "Team Leader",
      },
      {
        user: {
          id: 2,
          name: "Bessie Cooper",
          avatar: "https://i.pravatar.cc/150?img=1",
        },
        role: "Volunteer",
      },
    ],
    stats: {
      interested: 89,
      going: 156,
      shares: 23,
    },
  },
  {
    id: 2,
    title: "Food Bank Distribution",
    description:
      "Help distribute food packages to families in need. Volunteers needed for sorting and packing.",
    fullDescription:
      "Our monthly food bank distribution event needs dedicated volunteers to help sort, pack, and distribute food packages to families facing food insecurity. We serve over 500 families each month and your help makes a real difference. Tasks include organizing donations, packing boxes, and assisting with distribution. No experience necessary - we'll provide training on-site.",
    coverImage:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=400&fit=crop",
    date: "2025-11-05",
    time: "08:00 AM",
    endTime: "11:00 AM",
    location: "Central Community Center, NYC",
    status: "completed",
    category: "Community Service",
    tags: ["food", "charity", "helping", "community"],
    host: {
      id: 11,
      name: "City Food Bank",
      avatar: "https://i.pravatar.cc/150?img=21",
      type: "organization",
    },
    participants: [
      {
        user: {
          id: 1,
          name: "Robert Fox",
          avatar: "https://i.pravatar.cc/150?img=12",
        },
        role: "Volunteer",
      },
    ],
    stats: {
      interested: 45,
      going: 78,
      shares: 12,
    },
  },
  {
    id: 3,
    title: "Tree Planting Campaign",
    description:
      "Plant 1000 trees in one day! Be part of our reforestation effort to combat climate change.",
    fullDescription:
      "Join our ambitious goal to plant 1,000 trees in a single day as part of our citywide reforestation initiative. This event is suitable for all ages and fitness levels. We'll provide all tools, saplings, and guidance from professional arborists. Together, we can make our city greener and create a lasting positive impact on our environment for generations to come.",
    coverImage:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop",
    date: "2025-11-15",
    time: "07:00 AM",
    endTime: "01:00 PM",
    location: "Riverside Park, Portland",
    status: "upcoming",
    category: "Environment",
    tags: ["trees", "planting", "climate", "nature"],
    host: {
      id: 12,
      name: "Eco Warriors",
      avatar: "https://i.pravatar.cc/150?img=22",
      type: "organization",
    },
    participants: [],
    stats: {
      interested: 234,
      going: 342,
      shares: 67,
    },
  },
];

// Event categories for filtering
export const eventCategories = [
  { id: "all", name: "All Events", icon: "🌟" },
  { id: "environment", name: "Environment", icon: "🌱" },
  { id: "community-service", name: "Community Service", icon: "🤝" },
  { id: "education", name: "Education", icon: "📚" },
  { id: "health-wellness", name: "Health & Wellness", icon: "❤️" },
  { id: "animal-welfare", name: "Animal Welfare", icon: "🐾" },
];

// Mock posts specific to events (extending mockPosts structure)
export const getEventPosts = (eventId) => {
  const eventPosts = {
    1: [
      // Beach Cleanup Drive posts
      {
        id: 101,
        eventId: 1,
        author: {
          id: 2,
          name: "Sarah Johnson",
          bio: "Environmental Activist",
          avatar: "https://i.pravatar.cc/150?img=5",
        },
        content:
          "So excited for the beach cleanup this Saturday! Who else is joining? Let's make our beaches beautiful again! 🌊🧹",
        media: null,
        timestamp: "2 hours ago",
        likes: 18,
        isLiked: true,
        comments: [
          {
            id: 1,
            author: {
              id: 3,
              name: "Mike Chen",
              bio: "Volunteer",
              avatar: "https://i.pravatar.cc/150?img=8",
            },
            content: "Count me in! I'll bring some friends too! 🙌",
            timestamp: "1 hour ago",
            isAuthor: false,
          },
        ],
      },
      {
        id: 102,
        eventId: 1,
        author: {
          id: 10,
          name: "Green Earth Foundation",
          bio: "Environmental Organization",
          avatar: "https://i.pravatar.cc/150?img=20",
        },
        content:
          "Reminder: We'll provide all cleanup supplies, but please bring your own water bottle and sunscreen. See you Saturday at 9 AM! ☀️",
        media:
          "https://images.unsplash.com/photo-1622495805798-d0e5e8e56e4b?w=600&h=300&fit=crop",
        timestamp: "5 hours ago",
        likes: 42,
        isLiked: false,
        comments: [],
      },
    ],
    2: [
      // Food Bank Distribution posts
      {
        id: 201,
        eventId: 2,
        author: {
          id: 11,
          name: "City Food Bank",
          bio: "Non-Profit Organization",
          avatar: "https://i.pravatar.cc/150?img=21",
        },
        content:
          "Thank you to all our amazing volunteers! Together we're making a difference in our community. 🙏❤️",
        media: null,
        timestamp: "1 day ago",
        likes: 56,
        isLiked: true,
        comments: [],
      },
    ],
    3: [
      // Tree Planting Campaign posts
      {
        id: 301,
        eventId: 3,
        author: {
          id: 12,
          name: "Eco Warriors",
          bio: "Environmental Group",
          avatar: "https://i.pravatar.cc/150?img=22",
        },
        content:
          "We're halfway to our goal of 500 volunteers! Join us in planting 1000 trees and creating a greener future! 🌳",
        media:
          "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&h=300&fit=crop",
        timestamp: "3 hours ago",
        likes: 89,
        isLiked: false,
        comments: [
          {
            id: 1,
            author: {
              id: 7,
              name: "Emma Wilson",
              bio: "Nature Lover",
              avatar: "https://i.pravatar.cc/150?img=9",
            },
            content:
              "This is amazing! Bringing my whole family to participate! 🌱👨‍👩‍👧‍👦",
            timestamp: "2 hours ago",
            isAuthor: false,
          },
        ],
      },
    ],
  };

  return eventPosts[eventId] || [];
};
