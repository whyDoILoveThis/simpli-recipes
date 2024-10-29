import { Timestamp } from "@firebase/firestore";


declare global {
interface Recipe {
    uid: string | undefined;  // Unique identifier for the recipe
    creatorUid: string;
    title: string;
    createdAt: Timestamp | Date;  // Recipe creation date
    updatedAt?: Timestamp | Date;  // Optional last modified date
    notes?: string;
    photoUrl?: string;
    category: RecipeCategory | 'other';  // Using enum for category
    steps: string[];  // List of steps for the recipe
    ingredients: string[];  // List of ingredients
    totalTime: string;
    totalTimeTemp: number;
    comments: Comment[];  // Store comment IDs for scalability
    timesFavorited?: number;
}

enum RecipeCategory {
    Breakfast = 'breakfast',
    Lunch = 'lunch',
    Dinner = 'dinner',
    Dessert = 'dessert',
    Snack = 'snack',
    Beverage = 'beverage',
    Other = 'other'  // For recipes that don't fit the main categories
}

interface Comment {
    commentUid: string;
    userUid: string;
    comment: string;
    parentCommentId?: string | null;
    postedAt: Timestamp | Date;
    reactions?: Reaction[];
}

interface Reaction {
    reactionUid: string;
    userUid: string;
    theReaction?: PossibleReactions | null
    reactedAt: Timestamp | Date;
}

enum PossibleReactions {
    Like = 'like',
    RockOn = 'rock-on',
    Dislike = 'dislike',
    Love = 'love',
    Funny = 'funny',
    Angry = 'angry',
    FlipBird = 'flip-bird',
    None = 'none',
}
}

