import Image from "next/image";
import { useState } from "react";
import Popover from "../Popover";
import CloseButton from "../icons/CloseButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import RecipeCardOpen from "./RecipeCardOpen";
import UserProfileTag from "./UserProfileTag/UserProfileTag";
import { fbGetUserById } from "@/firebase/fbGetUserById";
import Link from "next/link";
import { Button } from "./button";
import MyDropdownTrigger from "./MyDropdownTrigger";
import { fbFavoriteRecipe } from "@/firebase/fbFavoriteRecipe";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";
import Heart from "../icons/Heart";
import LoaderSpinner from "./LoaderSpinner";

interface Props {
  recipes: Recipe[];
  handleEditRecipe?: (recipe: Recipe) => void;
  handleDeleteRecipe?: (recipeUid: string, recipeName: string) => void;
}

const RecipeCardList = ({
  recipes,
  handleEditRecipe,
  handleDeleteRecipe,
}: Props) => {
  const { userId } = useAuth();
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(-999);
  const [viewingRecipe, setViewingRecipe] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [favoriteIndex, setFavoriteIndex] = useState(-999);

  const handleFavorite = async (usersUid: string, recipeId: string) => {
    setLoadingFavorite(true);
    try {
      await fbFavoriteRecipe(usersUid, recipeId);
      toast({ title: "Added to Favorites!💖", variant: "pink" });
      setLoadingFavorite(false);
      setFavoriteIndex(-999);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="grid sm:grid-cols-2 items-center p-2 gap-4">
      {recipes.map((recipe, index) => (
        <div
          key={recipe.uid}
          className={`
              ${selectedRecipeIndex !== index && viewingRecipe && "invisible"}
              recipe-item relative border rounded-2xl overflow-hidden w-fit flex flex-col items-center`}
        >
          {/* Recipe Buttons */}
          <div
            className={`absolute max-w-[245px] z-[1] left-0 p-2  ${
              viewingRecipe && " z-lowest"
            }`}
          >
            <UserProfileTag dbUserId={recipe.creatorUid} />
          </div>
          <div
            className={`absolute right-2 top-2 z-10  ${
              viewingRecipe && " z-lowest"
            }`}
          >
            <Button
              onClick={() => {
                recipe.uid && userId && handleFavorite(userId, recipe.uid);
                setFavoriteIndex(index);
              }}
              className={`flex gap-1 backdrop-blur-lg`}
              variant={"pink"}
            >
              {loadingFavorite && index === favoriteIndex ? (
                <LoaderSpinner />
              ) : (
                <Heart />
              )}
              <p>{recipe.timesFavorited ? recipe.timesFavorited : 0}</p>
            </Button>
          </div>
          {/** Recipe Card */}
          <article
            className=" w-full h-full min-w-[280px] min-h-[150px] relative cursor-pointer"
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
                className="w-full"
              />
            )}
            <h2 className="absolute bottom-0 w-full text-center font-bold text-slate-100 shadow-bottom ">
              {recipe.title}
            </h2>
          </article>

          {/** Recipe Open Pop*/}
          {selectedRecipeIndex === index && (
            <Popover zIndex="59">
              <div className="flex flex-col items-center gap-2 absolute right-2 top-4">
                <button
                  className="text-3xl z-[60]"
                  onClick={() => {
                    setSelectedRecipeIndex(-999);
                    setViewingRecipe(false);
                  }}
                >
                  <CloseButton />
                </button>
                {handleEditRecipe && handleDeleteRecipe && (
                  <DropdownMenu>
                    <MyDropdownTrigger />
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleEditRecipe(recipe)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          recipe.uid &&
                          handleDeleteRecipe(recipe.uid, recipe.title)
                        }
                        className="bg-red-700 dark:hover:bg-red-900"
                      >
                        DELETE
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <RecipeCardOpen recipe={recipe} />
            </Popover>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecipeCardList;
