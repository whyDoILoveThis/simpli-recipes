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
    comments: string[];  // Store comment IDs for scalability
}

enum RecipeCategory {
    Breakfast = 'breakfast',
    Lunch = 'lunch',
    Dinner = 'dinner',
    Dessert = 'dessert',
    Snack = 'snack',
    Beverage = 'beverage',
    Other = 'other'  // For recipes that don't fit the main categories
}}

