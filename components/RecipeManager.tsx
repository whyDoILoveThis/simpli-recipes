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

import Popover from "./Popover";
import CloseButton from "./icons/CloseButton";
import Plus from "./icons/Plus";
import Hourglass from "./icons/Hourglass";
import Other from "./icons/category icons/Other";
import Breakfast from "./icons/category icons/Breakfast";
import Lunch from "./icons/category icons/Lunch";
import Dinner from "./icons/category icons/Dinner";
import Dessert from "./icons/category icons/Dessert";
import Snack from "./icons/category icons/Snack";
import Beverage from "./icons/category icons/Beverage";

export default function RecipeManager() {
  const { dbUser } = useUserData();
  const [recipes, setRecipes] = useState<Recipe[]>([]); // Local state for recipes
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editing, setEditing] = useState(false);
  const [newRecipeData, setNewRecipeData] = useState<Partial<Recipe>>({});
  const [adding, setAdding] = useState(false); // State for adding recipes
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(-999);
  const [viewingRecipe, setViewingRecipe] = useState(false);

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
        totalTime: newRecipeData.totalTime || "",
        totalTimeTemp: newRecipeData.totalTimeTemp || 0,
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
        {recipes.map((recipe, index) => (
          <div
            key={recipe.uid}
            className={`
              ${selectedRecipeIndex !== index && viewingRecipe && " invisible"}
              recipe-item relative border rounded-2xl max-w-[300px] flex flex-col items-center`}
          >
            <article
              className=" w-full h-full cursor-pointer p-2"
              onClick={() => {
                setSelectedRecipeIndex(index);
                setViewingRecipe(true);
              }}
            >
              {recipe.photoUrl && recipe.photoUrl !== "" && (
                <Image
                  width={200}
                  height={80}
                  src={recipe.photoUrl}
                  alt={recipe.photoUrl}
                />
              )}
              <h2 className="text-center">{recipe.title}</h2>
            </article>
            {selectedRecipeIndex === index && (
              <Popover zIndex="59">
                <article className="max-w-[280px] overflow-y-auto p-4 flex flex-col items-center">
                  <div className="flex flex-col items-center gap-2 absolute right-6 top-14">
                    <button
                      className="text-3xl"
                      onClick={() => {
                        setSelectedRecipeIndex(-999);
                        setViewingRecipe(false);
                      }}
                    >
                      <CloseButton />
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="border border-slate-700 rounded-full p-1 focus:outline-none text-slate-600">
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
                  {recipe.photoUrl && recipe.photoUrl !== "" && (
                    <Image
                      width={200}
                      height={80}
                      src={recipe.photoUrl}
                      alt={recipe.photoUrl}
                    />
                  )}
                  <h2>{recipe.title}</h2>
                  <div className="flex gap-2 items-center">
                    <div className="flex flex-col items-center justify-center border rounded-full p-2 min-w-[80px] min-h-[80px] bg-orange-500 bg-opacity-35 border-orange-500 text-orange-100">
                      <p className="text-3xl leading-none mb-1">
                        {recipe.ingredients && recipe.ingredients.length}
                      </p>
                      <p className="text-xs">ingredients</p>
                    </div>
                    <div className="flex gap-1 flex-col items-center justify-center border rounded-full p-2 min-w-[80px] min-h-[80px] bg-pink-500 bg-opacity-35 border-pink-500 text-pink-100">
                      <Hourglass />
                      <p className="text-sm">{recipe.totalTime}</p>
                    </div>

                    <div className="flex flex-col items-center justify-center border rounded-full p-2 min-w-[80px] min-h-[80px] bg-blue-500 bg-opacity-35 border-blue-500 text-blue-100">
                      <p className="text-3xl leading-none mb-1">
                        {recipe.category === "breakfast" && <Breakfast />}
                        {recipe.category === "lunch" && <Lunch />}
                        {recipe.category === "dinner" && <Dinner />}
                        {recipe.category === "dessert" && <Dessert />}
                        {recipe.category === "snack" && <Snack />}
                        {recipe.category === "beverage" && <Beverage />}
                        {recipe.category === "other" && <Other />}
                      </p>
                      <p className="text-xs">
                        {recipe.category && recipe.category}
                      </p>
                    </div>
                  </div>
                  <ul className="m-4">
                    <b>Ingredients:</b>
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
                  <div className="flex flex-col gap-1">
                    <b>notes:</b>
                    <p>{recipe.notes && recipe.notes}</p>
                  </div>
                </article>
              </Popover>
            )}
          </div>
        ))}
      </div>
      <Button
        className={`text-xl p-4 mt-4 w-[25px] h-[25px] ${editing && "blur-md"}`}
        onClick={() => setAdding(true)}
      >
        <Plus />
      </Button>
      {adding && (
        <Popover zIndex="99">
          <div className="py-4 max-w-[320px] overflow-y-auto">
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
          <div className="py-4 max-w-[320px] overflow-y-auto">
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
