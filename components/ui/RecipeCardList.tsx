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
import ProxyImage from "../ProxyImage";
import { useUserStore } from "@/hooks/useUserStore";
import HeartEmpty from "../icons/HeartEmpty";

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
  const { dbUser } = useUserStore();
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(-999);
  const [viewingRecipe, setViewingRecipe] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [favoriteIndex, setFavoriteIndex] = useState(-999);
  const [loadedImages, setLoadedImages] = useState<string[] | undefined>([]);

  const handleFavorite = async (
    usersUid: string,
    recipeId: string,
    addToFavorites: boolean // NEW param
  ) => {
    try {
      await fbFavoriteRecipe(usersUid, recipeId, addToFavorites);

      if (addToFavorites) {
        toast({ title: "Added to Favorites! 💖", variant: "pink" });
      } else {
        toast({ title: "Removed from Favorites 💔", variant: "destructive" });
      }
    } catch (err) {
      console.log(err);
      setLoadingFavorite(false);
      setFavoriteIndex(-999);
    }
  };

  return (
    <div className="grid sm:grid-cols-2 place-items-center p-2 gap-4">
      {recipes.map((recipe, index) => {
        const isFavorited = dbUser?.favoriteRecipes?.includes(recipe.uid ?? "");

        return (
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
              <button
                onClick={async () => {
                  if (!recipe.uid || !userId) return;
                  setFavoriteIndex(index);
                  setLoadingFavorite(true);

                  if (isFavorited) {
                    await handleFavorite(userId, recipe.uid, false);
                  } else {
                    await handleFavorite(userId, recipe.uid, true);
                  }

                  // 🔄 Refresh user so favorites are updated after action
                  await useUserStore.getState().refetchUser();
                  setLoadingFavorite(false);
                  setFavoriteIndex(-999);
                }}
                className={`btn btn-w-icon btn-pink !bg-opacity-90 hover:!bg-opacity-75 !bg-pink-300 dark:!bg-pink-500 dark:hover:!bg-opacity-60 dark:!bg-opacity-75`}
              >
                {loadingFavorite && index === favoriteIndex ? (
                  <LoaderSpinner color="pink" />
                ) : isFavorited ? (
                  <Heart />
                ) : (
                  <HeartEmpty />
                )}
                <p>{recipe.timesFavorited ? recipe.timesFavorited : 0}</p>
              </button>
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
                <ProxyImage
                  width={200}
                  height={80}
                  src={recipe.photoUrl}
                  alt={recipe.photoUrl}
                  className="w-full"
                  onLoad={() => {
                    if (
                      recipe.photoUrl &&
                      loadedImages &&
                      !loadedImages.includes(recipe.photoUrl)
                    ) {
                      setLoadedImages((prev) => [
                        ...(prev ?? []).filter(
                          (img): img is string => typeof img === "string"
                        ),
                        recipe.photoUrl as string,
                      ]);
                    }
                  }}
                  styleBool={
                    loadedImages && loadedImages.includes(recipe.photoUrl)
                      ? true
                      : false
                  }
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
        );
      })}
    </div>
  );
};

export default RecipeCardList;
