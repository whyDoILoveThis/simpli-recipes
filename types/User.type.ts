interface User {
    userId: MaybeString;
    fullName: MaybeString;
    fullNameLower: MaybeString;  // For search functionality
    photoUrl: MaybeString;
    email: MaybeString;
    recipes?: Recipe[];  // Store recipe UIDs for scalability
    friends?: string[];  // Array of friend UIDs
    friendRequests?: FriendRequest[];  // Clearer field for friend requests
    favoriteRecipes?: string[];  // Array of favorite recipe UIDs
    bio?: string;  // Optional user bio
    isVerified?: boolean;  // For verified users (e.g., chefs)
    createdAt: Date;  // Timestamp of account creation
    updatedAt?: Date;  // Timestamp of last profile update
}

interface FriendRequest {
    requesterId: string;  // The ID of the user who sent the request
    status: 'pending' | 'accepted' | 'rejected';  // Status of the friend request
    sentAt: Date;  // Timestamp when the request was sent
    respondedAt?: Date;  // Optional timestamp for when the request was accepted/rejected
}

