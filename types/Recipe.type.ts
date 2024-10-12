interface Recipe {
    uid: string;  // Unique identifier for the recipe
    title: string;
    createdAt: Date;  // Recipe creation date
    updatedAt?: Date;  // Optional last modified date
    notes?: string;
    photoUrl?: string;
    category: RecipeCategory;  // Using enum for category
    steps: string[];  // List of steps for the recipe
    ingredients: string[];  // List of ingredients
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
}
