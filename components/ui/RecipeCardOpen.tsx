import Image from "next/image";
import React, { useEffect, useState } from "react";
import Breakfast from "../icons/category icons/Breakfast";
import Lunch from "../icons/category icons/Lunch";
import Dinner from "../icons/category icons/Dinner";
import Dessert from "../icons/category icons/Dessert";
import Snack from "../icons/category icons/Snack";
import Beverage from "../icons/category icons/Beverage";
import Other from "../icons/category icons/Other";
import Hourglass from "../icons/Hourglass";
import UserProfileTag from "./UserProfileTag/UserProfileTag";
import RecipeCardBubble from "./RecipeCardBubble";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import Heart from "../icons/Heart";
import { Button } from "./button";
import { BsFillShareFill } from "react-icons/bs";
import { FaPager } from "react-icons/fa";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { HiLink } from "react-icons/hi2";
import { fbFavoriteRecipe } from "@/firebase/fbFavoriteRecipe";
import { useAuth } from "@clerk/nextjs";
import { Input } from "./input";
import Plus from "../icons/Plus";
import { fbAddComment } from "@/firebase/fbAddComment";
import DateAndTime from "./DateAndTime";
import { fbGetComments } from "@/firebase/fbGetComments";
import { fbDeleteComment } from "@/firebase/fbDeleteComment";
import CommentCard from "./CommentCard";
import CommentCardSkeleton from "./CommentCardSkeleton";

const RecipeCardOpen = ({ recipe }: { recipe: Recipe }) => {
  const { userId } = useAuth();
  const { toast } = useToast();
  const recipeLink = `${window.location.origin}/recipe/${recipe.uid}`;
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[] | null>();
  const [commentFetchTrigger, setCommentFetchTrigger] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [selectedCommentIndex, setSelectedCommentIndex] = useState(-999);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  useEffect(() => {
    const g = async () => {
      recipe.uid && setComments(await fbGetComments(recipe.uid));
    };
    g();
  }, []);

  useEffect(() => {
    const g = async () => {
      recipe.uid && setComments(await fbGetComments(recipe.uid));
    };
    g();
  }, [commentFetchTrigger]);

  const shareRecipe = async () => {
    let hasShare = false;
    if (navigator.share) {
      try {
        hasShare = true;
        await navigator.share({
          title: recipe.title, // Title of the recipe
          url: recipeLink, // Recipe link
        });
        console.log("Recipe shared successfully!");
      } catch (error) {
        console.error("Error sharing recipe:", error);
      }
    }
  };

  const copyLink = () => {
    // Fallback for browsers that don't support Web Share API
    navigator.clipboard
      .writeText(recipeLink)
      .then(() => {
        console.log("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
    toast({
      title: "🔗 Link Copied 😁",
      variant: "blue",
    });
  };

  const handleFavorite = async (usersUid: string, recipeId: string) => {
    setLoadingFavorite(true);
    try {
      await fbFavoriteRecipe(usersUid, recipeId);
      toast({ title: "Added to Favorites!💖", variant: "pink" });
      setLoadingFavorite(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddComment = async (recipeId: string) => {
    if (commentText.trim() === "") return;
    setLoadingComment(true);
    try {
      userId && (await fbAddComment(recipeId, userId, commentText));
      toast({
        title: "Comment added! 😁",
        variant: "blue",
      });
      setCommentFetchTrigger(!commentFetchTrigger);
      setCommentText("");
      setLoadingComment(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteComment = async (recipeId: string, commentUid: string) => {
    try {
      await fbDeleteComment(recipeId, commentUid);
      toast({
        title: "Comment deleted! ❌",
        variant: "red",
      });
      setCommentFetchTrigger(!commentFetchTrigger);
    } catch (err) {
      console.log("!!!!!!!! delete comment err::", err);
    }
  };

  return (
    <article className="w-full overflow-y-auto flex flex-col items-center">
      {recipe.photoUrl && recipe.photoUrl !== "" && (
        <div className="p-8">
          <Image
            className="rounded-2xl"
            width={300}
            height={80}
            src={recipe.photoUrl}
            alt={recipe.photoUrl}
          />
        </div>
      )}
      <h2 className="mb-4 text-4xl font-bold text-center">{recipe.title}</h2>
      <div className="mb-2 flex items-center gap-2">
        <UserProfileTag dbUserId={recipe.creatorUid} />
      </div>
      <div className="flex gap-1 mb-4">
        {
          <Button
            onClick={() => {
              recipe.uid && userId && handleFavorite(userId, recipe.uid);
            }}
            className="btn-round"
            variant={"pink"}
          >
            <Heart />
          </Button>
        }
        {
          <Link href={`/recipe/${recipe.uid}`}>
            <Button className="btn-round p-0">
              <FaPager width={"20px"} />
            </Button>
          </Link>
        }
        {
          <Button
            onClick={() => {
              copyLink();
            }}
            className="btn-round p-0"
          >
            <HiLink width={"px"} />
          </Button>
        }
        {
          <Button
            onClick={() => {
              shareRecipe() || copyLink();
            }}
            className="btn-round p-0"
          >
            <BsFillShareFill />
          </Button>
        }
      </div>
      <div className="gap-8 flex items-center">
        <RecipeCardBubble text={"ingredients"} color="orange">
          {recipe.ingredients && recipe.ingredients.length}
        </RecipeCardBubble>
        <RecipeCardBubble text={recipe.totalTime} color="purple">
          <div className="p-1">
            <Hourglass />
          </div>
        </RecipeCardBubble>
        <RecipeCardBubble text={recipe.category} color="blue">
          {recipe.category === "breakfast" && <Breakfast />}
          {recipe.category === "lunch" && <Lunch />}
          {recipe.category === "dinner" && <Dinner />}
          {recipe.category === "dessert" && <Dessert />}
          {recipe.category === "snack" && <Snack />}
          {recipe.category === "beverage" && <Beverage />}
          {recipe.category === "other" && <Other />}
        </RecipeCardBubble>
      </div>
      <Tabs
        defaultValue="ingredients"
        className=" mt-4 flex w-full flex-col items-center"
      >
        <TabsList className="rounded-full">
          <TabsTrigger value="ingredients">ingredients</TabsTrigger>
          <TabsTrigger value="steps">steps</TabsTrigger>
        </TabsList>
        <TabsContent value="ingredients">
          <ul className=" max-w-[400px] list-disc flex flex-col gap-2 m-4">
            <b className="text-xl">Ingredients:</b>
            {recipe.ingredients.map((ingr, index) => (
              <li key={index}>{ingr}</li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="steps">
          <ol className="flex flex-col gap-4 max-w-[300px]">
            {recipe.steps.map((step, index) => (
              <li key={index}>
                <b>Step{index + 1}:</b> <br /> {step}
              </li>
            ))}
          </ol>
        </TabsContent>
      </Tabs>
      {recipe.notes && (
        <div className="flex flex-col gap-1 mt-4">
          <b>notes:</b>
          <p>{recipe.notes}</p>
        </div>
      )}
      <div className="my-4">
        <div className="flex flex-col gap-2 items-center justify-center">
          {comments && comments.length > 0 ? (
            <div className="flex flex-col items-center">
              <h2 className="mb-2">Comments &#40;{comments.length}&#41;</h2>
              {comments.map((comment, index) => {
                return (
                  <div className="w-full" key={index}>
                    {comment.parentCommentId === null && (
                      <div
                        onClick={() => {
                          setSelectedCommentIndex(index);
                        }}
                        className="flex flex-col items-center w-full"
                      >
                        <CommentCard
                          recipe={recipe}
                          comment={comment}
                          handleDeleteComment={handleDeleteComment}
                          commentFetchTrigger={commentFetchTrigger}
                          setCommentFetchTrigger={setCommentFetchTrigger}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              {loadingComment && <CommentCardSkeleton />}
            </div>
          ) : (
            <p>No comments </p>
          )}
          <div className="flex gap-1 items-center border rounded-full p-1">
            <Input
              className="border-none"
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
              }}
            />
            <Button
              onClick={() => {
                recipe.uid && handleAddComment(recipe.uid);
                comments?.length &&
                  setSelectedCommentIndex(comments.length - 1);
              }}
              className="btn-round text-2xl"
            >
              <Plus />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default RecipeCardOpen;
