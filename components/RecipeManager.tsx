import { useEffect, useState } from "react";
import { useUserData } from "@/hooks/useUserData"; // Assuming this hook provides dbUser
import { fbAddRecipe } from "@/firebase/fbAddRecipe";
import { fbDeleteRecipe } from "@/firebase/fbDeleteRecipe";
import { fbUpdateRecipe } from "@/firebase/fbUpdateRecipe";
import { Button } from "./ui/button";
import RecipeForm from "./RecipeForm";
import { BsThreeDots } from "react-icons/bs";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function RecipeManager() {
  const { dbUser } = useUserData();
  const [recipes, setRecipes] = useState<Recipe[]>([]); // Local state for recipes
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editing, setEditing] = useState(false);
  const [newRecipeData, setNewRecipeData] = useState<Partial<Recipe>>({});
  const [adding, setAdding] = useState(false); // State for adding recipes

  useEffect(() => {
    if (dbUser?.recipes) {
      setRecipes(dbUser.recipes); // Initialize local recipes state
    }
  }, [dbUser]);

  // 🛠️ Ensure no empty submission
  const handleAddRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipeData.title || newRecipeData.title.trim() === "") {
      alert("Please provide a recipe title."); // Simple validation
      return;
    }

    if (dbUser?.userId) {
      const newRecipe: Recipe = {
        uid: generateUniqueId(), // Create a unique ID for the new recipe
        title: newRecipeData.title || "",
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: newRecipeData.notes || "",
        photoUrl: newRecipeData.photoUrl || "",
        category: newRecipeData.category || "other",
        steps: newRecipeData.steps || [],
        ingredients: newRecipeData.ingredients || [],
        comments: [],
      };

      await fbAddRecipe(dbUser.userId, newRecipe);

      setRecipes((prevRecipes) => [...prevRecipes, newRecipe]); // Update local state
      setAdding(false);
      setNewRecipeData({}); // Reset form after successful add
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setNewRecipeData({ ...recipe }); // Populate form with selected recipe data
    setEditing(true);
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
    if (confirmed && dbUser?.userId) {
      await fbDeleteRecipe(dbUser.userId, recipeId);
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.uid !== recipeId)
      );
    }
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
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe.uid === selectedRecipe.uid ? updatedRecipe : recipe
        )
      );

      setEditing(false);
      setSelectedRecipe(null);
      setNewRecipeData({}); // Clear form after successful update
    }
  };

  const generateUniqueId = () => {
    return "recipe_" + Math.random().toString(36).substr(2, 9);
  };

  return (
    <div className="border p-2 flex flex-col justify-center items-center m-4 rounded-3xl">
      <h2>Your Recipes</h2>
      <div className="flex flex-col gap-4">
        {recipes.map((recipe) => (
          <Drawer>
            <DrawerTrigger>
              <h2>{recipe.title}</h2>
              {recipe.photoUrl && recipe.photoUrl !== "" && (
                <Image
                  width={200}
                  height={80}
                  src={recipe.photoUrl}
                  alt={recipe.photoUrl}
                />
              )}
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                <DrawerDescription>
                  This action cannot be undone.
                </DrawerDescription>
              </DrawerHeader>

              <div
                key={recipe.uid}
                className={`${
                  (adding && "blur-md") ||
                  (editing && selectedRecipe !== recipe && "blur-md")
                } recipe-item relative border rounded-2xl m-2 p-3 max-w-[300px]`}
              >
                <ul className="m-4">
                  {recipe.ingredients.map((ingr, index) => (
                    <li key={index}>{ingr}</li>
                  ))}
                </ul>
                <ol className="flex flex-col gap-4">
                  {recipe.steps.map((step, index) => (
                    <li key={index}>
                      <b>Step{index + 1}:</b> <br /> {step}
                    </li>
                  ))}
                </ol>
                <div className="flex gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="absolute right-3 top-2 border rounded-full p-1 focus:outline-none text-slate-400">
                      <BsThreeDots />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleEditRecipe(recipe)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          recipe.uid && handleDeleteRecipe(recipe.uid)
                        }
                        className="bg-red-700 dark:hover:bg-red-900"
                      >
                        DELETE
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ))}
      </div>
      <Button
        className={`text-3xl p-0 w-[30px] h-[30px] rounded-full ${
          editing && "blur-md"
        }`}
        onClick={() => setAdding(true)}
      >
        +
      </Button>
      {adding && (
        <RecipeForm
          mode="add"
          recipeData={newRecipeData} // initial new recipe data state
          setNewRecipeData={setNewRecipeData}
          onSubmit={handleAddRecipe}
          onCancel={() => setAdding(false)}
        />
      )}
      {editing && selectedRecipe && (
        <RecipeForm
          mode="edit"
          recipeData={newRecipeData} // populate with selected recipe
          setNewRecipeData={setNewRecipeData}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      )}
    </div>
  );
}
