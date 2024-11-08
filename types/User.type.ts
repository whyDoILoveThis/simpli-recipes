import { Timestamp } from "@firebase/firestore";
declare global{
interface User {
    userId: MaybeString;
    fullName: MaybeString;
    fullNameLower: MaybeString;  // For search functionality
    photoUrl: MaybeString;
    email: MaybeString;
    recipes?: string[];  // Store recipe UIDs for scalability
    friends?: string[];  // Array of friend UIDs
    friendRequests?: FriendRequest[];  // Clearer field for friend requests
    sentFriendRequests?: SentFriendRequest[];
    favoriteRecipes?: string[];  // Array of favorite recipe UIDs
    bio?: string;  // Optional user bio
    isVerified?: boolean;  // For verified users (e.g., chefs)
    createdAt: Date;  // Timestamp of account creation
    updatedAt?: Date;  // Timestamp of last profile update
}

interface FriendRequest {
    requesterId: string;  // The ID of the user who sent the request
    status: 'pending' | 'accepted' | 'rejected';  // Status of the friend request
    sentAt: Timestamp;  // Timestamp when the request was sent
    respondedAt?: Timestamp;  // Optional timestamp for when the request was accepted/rejected
}
interface SentFriendRequest {
    userUid: string;  // The ID of the user who sent the request
    status: 'pending' | 'accepted' | 'rejected';  // Status of the friend request
    sentAt: Timestamp;  // Timestamp when the request was sent
    respondedAt?: Timestamp;  // Optional timestamp for when the request was accepted/rejected
}
}
