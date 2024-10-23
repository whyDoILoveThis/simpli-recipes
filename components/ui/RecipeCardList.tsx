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

interface Props {
  recipes: Recipe[];
  handleEditRecipe?: (recipe: Recipe) => void;
  handleDeleteRecipe?: (recipeUid: string) => void;
}

const RecipeCardList = ({
  recipes,
  handleEditRecipe,
  handleDeleteRecipe,
}: Props) => {
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(-999);
  const [viewingRecipe, setViewingRecipe] = useState(false);
  return (
    <div className="grid sm:grid-cols-2 items-center p-2 gap-4">
      {recipes.map((recipe, index) => (
        <div
          key={recipe.uid}
          className={`
              ${selectedRecipeIndex !== index && viewingRecipe && " invisible"}
              recipe-item relative border rounded-2xl  w-fit flex flex-col items-center`}
        >
          <div className="absolute left-0 p-2">
            <Link href={`/profile/${recipe.creatorUid}`}>
              <UserProfileTag dbUserId={recipe.creatorUid} />
            </Link>
          </div>
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
              <div className="flex flex-col items-center gap-2 absolute right-2 top-4">
                <button
                  className="text-3xl"
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
                          recipe.uid && handleDeleteRecipe(recipe.uid)
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
