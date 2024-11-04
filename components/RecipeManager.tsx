import { useEffect, useState } from "react";
import { useUserStore } from "@/hooks/useUserStore"; // Assuming this hook provides dbUser
import { useAuth } from "@clerk/nextjs";
import { v4 } from "uuid";
import { useRecipeStore } from "@/hooks/userRecipeStore";
import { fbGetUsersRecipes } from "@/firebase/fbGetUsersRecipes";
import { fbAddRecipe } from "@/firebase/fbAddRecipe";
import { fbUpdateRecipe } from "@/firebase/fbUpdateRecipe";
import { fbDeleteRecipe } from "@/firebase/fbDeleteRecipe";
import RecipeCardList from "./ui/RecipeCardList";
import RecipeForm from "./RecipeForm";
import { Button } from "./ui/button";
import Popover from "./Popover";
import Plus from "./icons/Plus";
import RecipeCardListWithSearchFiltering from "./Feed/RecipeCardListWithSearchFiltering";

export default function RecipeManager() {
  const { dbUser, refetchUser } = useUserStore();
  const { userId } = useAuth();
  const { recipes, setRecipes } = useRecipeStore(); // Local state for recipes
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editing, setEditing] = useState(false);
  const [newRecipeData, setNewRecipeData] = useState<Partial<Recipe>>({});
  const [adding, setAdding] = useState(false); // State for adding recipes

  // Get the users recipes on render
  useEffect(() => {
    if (dbUser?.recipes) {
      const getRecipes = async () => {
        dbUser.recipes && setRecipes(await fbGetUsersRecipes(dbUser.recipes)); // Initialize local recipes state}
      };

      getRecipes();
    }
  }, []);

  // Get the users recipes if the when the dbUser changes
  useEffect(() => {
    if (dbUser?.recipes) {
      const getRecipes = async () => {
        dbUser.recipes && setRecipes(await fbGetUsersRecipes(dbUser.recipes)); // Initialize local recipes state}
      };

      getRecipes();
    }
  }, [dbUser]);

  // 🛠️ Ensure no empty submission
  const handleAddRecipe = async (e: React.FormEvent) => {
    console.log(dbUser);
    e.preventDefault();
    if (!newRecipeData.title || newRecipeData.title.trim() === "") {
      alert("Please provide a recipe title."); // Simple validation
      return;
    }

    if (dbUser?.userId && userId) {
      const newRecipe: Recipe = {
        uid: v4(), // Create a unique ID for the new recipe
        creatorUid: userId,
        title: newRecipeData.title || "",
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: newRecipeData.notes || "",
        photoUrl: newRecipeData.photoUrl || "",
        category: newRecipeData.category || "other",
        steps: newRecipeData.steps || [],
        ingredients: newRecipeData.ingredients || [],
        totalTime: newRecipeData.totalTime || "",
        totalTimeTemp: newRecipeData.totalTimeTemp || 0,
        comments: [],
      };

      await fbAddRecipe(dbUser.userId, newRecipe);

      setRecipes([...recipes, newRecipe]); // Update local state
      setAdding(false);
      setNewRecipeData({}); // Reset form after successful add
      refetchUser();
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setNewRecipeData({ ...recipe }); // Populate form with selected recipe data
    setEditing(true);
  };

  // 🛠️ Ensure no empty update submission
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipeData.title || newRecipeData.title.trim() === "") {
      alert("Recipe title cannot be empty.");
      return;
    }

    if (selectedRecipe && dbUser?.userId) {
      const updatedRecipe: Recipe = {
        ...selectedRecipe,
        ...newRecipeData, // Merge form data with existing recipe
        updatedAt: new Date(),
      };

      await fbUpdateRecipe(dbUser.userId, updatedRecipe);
      setRecipes(
        recipes.map((recipe) =>
          recipe.uid === selectedRecipe.uid ? updatedRecipe : recipe
        )
      );

      setEditing(false);
      setSelectedRecipe(null);
      setNewRecipeData({}); // Clear form after successful update
      refetchUser();
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
    if (confirmed && dbUser?.userId) {
      await fbDeleteRecipe(dbUser.userId, recipeId);
      setRecipes(recipes.filter((recipe) => recipe.uid !== recipeId));
      refetchUser();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center m-4 mt-0 ">
      <h2 className="text-center font-bold mb-6 mt-8">Your Recipes</h2>

      <RecipeCardListWithSearchFiltering
        filterMine={true}
        handleEditRecipe={handleEditRecipe}
        handleDeleteRecipe={handleDeleteRecipe}
      />
      <Button
        className={`text-xl p-4 mt-4 w-[25px] h-[25px] ${editing && "blur-md"}`}
        onClick={() => setAdding(true)}
      >
        <Plus />
      </Button>
      {adding && (
        <Popover>
          <div className="py-4 max-w-[430px] overflow-y-auto">
            <RecipeForm
              mode="add"
              recipeData={newRecipeData} // initial new recipe data state
              setNewRecipeData={setNewRecipeData}
              onSubmit={handleAddRecipe}
              onCancel={() => setAdding(false)}
            />
          </div>
        </Popover>
      )}
      {editing && selectedRecipe && (
        <Popover zIndex="100">
          <div className="py-4 w-full max-w-[430px] overflow-y-auto">
            <RecipeForm
              mode="edit"
              recipeData={newRecipeData} // populate with selected recipe
              setNewRecipeData={setNewRecipeData}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(false)}
            />
          </div>
        </Popover>
      )}
    </div>
  );
}
