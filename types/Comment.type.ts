interface Comment {
    commentId: string;  // Unique ID for the comment
    commenterUid: string;  // User's unique ID
    commentText: string;  // Content of the comment
    createdAt: Date;  // Timestamp for when the comment was made
    updatedAt?: Date;  // Optional timestamp for edits
    commenterName?: string;  // Optional for displaying user’s name directly
}
