"use client";

import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import SendIcon from "../icons/SendIcon";
import { useUserStore } from "@/hooks/useUserStore";
import { useAuth, useUser } from "@clerk/nextjs";
import { v4 } from "uuid";
import { fbAddRecipe } from "@/firebase/fbAddRecipe";
import LoaderSpinner from "../ui/LoaderSpinner";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import SaveIcon from "../icons/SaveIcon";
import fetchRecipeImage from "@/lib/fetchRecipeImage";
import ImageCarousel from "./ImageCarousel";
import UnsplashLogo from "../icons/UnsplashLogo";
import GoogleColorLogo from "../icons/GoogleColorLogo";
import GoogleSolidLogo from "../icons/GoogleSolidLogo";
import RecipeCardBubble from "../ui/RecipeCardBubble";
import Hourglass from "../icons/Hourglass";
import Breakfast from "../icons/category icons/Breakfast";
import Lunch from "../icons/category icons/Lunch";
import Dinner from "../icons/category icons/Dinner";
import Dessert from "../icons/category icons/Dessert";
import Snack from "../icons/category icons/Snack";
import Beverage from "../icons/category icons/Beverage";
import Other from "../icons/category icons/Other";
import AiTextarea from "./AiTextarea";
import OcrRecognition from "./OcrRecognition";

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface Step {
  step_number: number;
  instruction: string;
}

const RecipeInputForm = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [recipe, setRecipe] = useState<any | null>({
    title: "Recipe Name",
    ingredients: [],
    steps: [],
  });
  const [usingOcr, setUsingOcr] = useState(false);
  const [ocrResult, setOcrResult] = useState("");
  const [loadingAiRes, setLoadingAiRes] = useState(false);
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [recipeSaved, setRecipeSaved] = useState(false);
  const [disableSendBtn, setDisableSendBtn] = useState(false);
  const [usingUnsplash, setUsingUnsplash] = useState(true);
  const [imgSearchIndex, setImgSearchIndex] = useState(1);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentImgUrl, setCurrentImgUrl] = useState("");
  const [googleImgUrl, setGoogleImgUrl] = useState("");
  const { dbUser, fetchUser } = useUserStore();
  const { user } = useUser();
  const { userId } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisableSendBtn(true);
    if (savingRecipe) return;
    if (!prompt.trim()) {
      alert("Please enter a recipe idea.");
      return;
    }
    await handleUnsplashSearch();
    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setRecipe(data.recipe);
      setLoadingAiRes(false);
      setDisableSendBtn(false);
    } catch (error) {
      setLoadingAiRes(false);
      setDisableSendBtn(false);
      console.error("❌ Error:", error);
      alert("An error occurred while fetching the recipe.");
    }
  };

  const handleUnsplashSearch = async () => {
    if (recipe.title !== null && recipe.title) {
      setImageUrls(await fetchRecipeImage(recipe.searchTerm));
    }
  };

  useEffect(() => {
    setCurrentImgUrl(imageUrls[0]);
  }, [imageUrls]);

  useEffect(() => {
    if (user && userId) {
      fetchUser(userId, user);
    }
  }, []);

  useEffect(() => {
    if (user && userId) {
      fetchUser(userId, user);
    }
  }, [user, userId]);

  // 🛠️ Ensure no empty submission
  const handleAddRecipe = async (e: React.FormEvent) => {
    // Define the types for the recipe components

    console.log(dbUser);
    e.preventDefault();
    if (recipeSaved) return;

    if (dbUser?.userId && userId) {
      // 1️⃣ Extract steps as an array of instructions
      const stepInstructions: string[] = recipe.steps.map(
        (step: Step) => step.instruction
      );

      // 2️⃣ Combine ingredient properties into a single string
      const formattedIngredients: string[] = recipe.ingredients.map(
        (ingredient: Ingredient) => {
          return `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`;
        }
      );

      console.log(imageUrls);

      const newRecipe: Recipe = {
        uid: v4(), // Create a unique ID for the new recipe
        creatorUid: userId,
        title: recipe.title || "",
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: recipe.notes || "",
        photoUrl: usingUnsplash
          ? currentImgUrl
          : !usingUnsplash
          ? googleImgUrl
          : "",
        category: recipe.category || "other",
        steps: stepInstructions || [],
        ingredients: formattedIngredients || [],
        totalTime: recipe.totalCookTime || "",
        totalTimeTemp: recipe.totalTimeTemp || 0,
        comments: [],
      };
      console.log(newRecipe);

      await fbAddRecipe(dbUser.userId, newRecipe);
      setSavingRecipe(false);
      setRecipeSaved(true);
      toast({
        title: "Recipe Saved 🙏",
        variant: "green",
      });
    } else {
      alert("missing userid");
      setRecipeSaved(false);
      setSavingRecipe(false);
    }
  };

  console.log(googleImgUrl);

  useEffect(() => {
    setPrompt(ocrResult);
  }, [ocrResult]);

  useEffect(() => {
    setCurrentImgUrl(imageUrls[imgSearchIndex]);
  }, [imgSearchIndex]);

  const handleNextImg = async () => {
    setImgSearchIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    console.log(currentImgUrl);
  };
  const handlePrevImg = async () => {
    setImgSearchIndex(
      (prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length
    );
  };

  console.log(imageUrls);

  return (
    <div className="p-4 pb-8">
      <div className="flex gap-2 justify-center">
        <button
          type="button"
          onClick={() => {
            setUsingOcr(false);
            setOcrResult("");
          }}
          className={`btn ${!usingOcr && "btn-selected"}`}
        >
          Textarea
        </button>
        <button
          type="button"
          onClick={() => {
            setUsingOcr(true);
          }}
          className={`btn ${usingOcr && "btn-selected"}`}
        >
          OCR
        </button>
      </div>
      <form
        className="flex gap-1 items-end m-4"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        {usingOcr && (
          <div className="w-full">
            <OcrRecognition ocrResult={ocrResult} setOcrResult={setOcrResult} />
            {ocrResult && (
              <AiTextarea
                prompt={prompt}
                setPrompt={setPrompt}
                disableSendBtn={disableSendBtn}
                loadingAiRes={loadingAiRes}
                setLoadingAiRes={setLoadingAiRes}
                setSavingRecipe={setSavingRecipe}
                setRecipeSaved={setRecipeSaved}
              />
            )}
          </div>
        )}
        {!usingOcr && ocrResult === "" && (
          <AiTextarea
            prompt={prompt}
            setPrompt={setPrompt}
            disableSendBtn={disableSendBtn}
            loadingAiRes={loadingAiRes}
            setLoadingAiRes={setLoadingAiRes}
            setSavingRecipe={setSavingRecipe}
            setRecipeSaved={setRecipeSaved}
          />
        )}
      </form>
      {recipe && !loadingAiRes && (
        <div className="flex flex-col items-center">
          <form
            className="max-w-[350px] bg-black bg-opacity-20 dark:bg-white dark:bg-opacity-10 p-2 rounded-xl flex flex-col justify-end"
            onSubmit={handleAddRecipe}
          >
            {!recipeSaved && (
              <div className="flex flex-col mb-6">
                <span className="flex flex-col gap-1 items-center">
                  <p>
                    <b>Search image with </b>
                  </p>
                  <span className="flex items-center gap-1">
                    <button
                      type="button"
                      className={`flex items-center btn ${
                        usingUnsplash && "btn-unsplash"
                      } font-bold`}
                      onClick={() => {
                        setUsingUnsplash(true);
                        imageUrls.length <= 1 &&
                          imageUrls[0] === "" &&
                          handleUnsplashSearch();
                      }}
                    >
                      <span className="-translate-y-[2px]">
                        <UnsplashLogo />
                      </span>
                      Unsplash
                    </button>
                    or
                    <button
                      type="button"
                      className={`flex items-center btn ${
                        !usingUnsplash && "btn-google"
                      } font-bold`}
                      onClick={() => {
                        setUsingUnsplash(false);
                      }}
                    >
                      {!usingUnsplash ? (
                        <GoogleColorLogo />
                      ) : (
                        <GoogleSolidLogo />
                      )}
                      oogle
                    </button>
                  </span>
                </span>
              </div>
            )}
            {recipe.searchTerm && recipe.SearchTerm !== null && (
              <p>Img Search Term - {recipe.searchTerm}</p>
            )}
            {imageUrls &&
            !recipeSaved &&
            usingUnsplash &&
            recipe.title !== "Recipe Name" ? (
              <div>
                <span className="flex gap-2 mb-1">
                  <button
                    type="button"
                    onClick={handlePrevImg}
                    className="carousel-btn btn btn-round"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImg}
                    className="carousel-btn btn btn-round"
                  >
                    ▶
                  </button>
                </span>
                <img src={currentImgUrl} alt="unsplash stock image" />
              </div>
            ) : (
              recipe.title &&
              recipe.title !== null &&
              recipe.title !== "Recipe Name" &&
              !usingUnsplash && (
                <ImageCarousel
                  recipeSaved={recipeSaved}
                  theImgUrl={googleImgUrl}
                  setTheImgUrl={setGoogleImgUrl}
                  theQuery={recipe.searchTerm}
                />
              )
            )}
            <div>
              <h2 className="text-center font-bold">{recipe.title}</h2>
              {recipeSaved && <span className="tag tag-green">Saved ✔</span>}
            </div>
            {recipe.title !== "Recipe Name" && (
              <div className="w-full gap-8 flex items-center justify-center my-3">
                <RecipeCardBubble text={"ingredients"} color="orange">
                  {recipe.ingredients && recipe.ingredients.length}
                </RecipeCardBubble>
                <RecipeCardBubble text={recipe.totalCookTime} color="purple">
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
            )}

            <ul className="mt-4 p-2 bg-black bg-opacity-15 dark:bg-white dark:bg-opacity-10 rounded-lg">
              <h3 className="font-bold text-lg">Ingredients</h3>
              {recipe.ingredients.map((ing: any, index: number) => (
                <li key={index}>
                  {ing.quantity} {ing.unit} {ing.name}
                </li>
              ))}
            </ul>
            <ol className="flex flex-col gap-6 mt-4 p-4 bg-black bg-opacity-15 dark:bg-white dark:bg-opacity-10 rounded-lg">
              {!recipe.steps && <h3 className="font-bold text-lg">Steps</h3>}
              {recipe.steps.map((step: any, index: number) => (
                <li key={index}>
                  <b>Step {index + 1}</b> <br /> {step.instruction}
                </li>
              ))}
            </ol>
            {recipe.notes && (
              <div>
                <h3 className="text-lg font-bold">Notes:</h3>
                <p>{recipe.notes}</p>
              </div>
            )}
            {recipe.title &&
              recipe.title !== null &&
              recipe.title !== "Recipe Name" && (
                <Button
                  variant={"green"}
                  type="submit"
                  className={`m-4 ${
                    savingRecipe || (recipeSaved && "cursor-default")
                  }`}
                  onClick={() => {
                    !recipeSaved && setSavingRecipe(true);
                  }}
                >
                  {savingRecipe ? (
                    <LoaderSpinner />
                  ) : recipeSaved && !savingRecipe ? (
                    "Saved ✔"
                  ) : (
                    <div className="flex items-center gap-1 text-xl">
                      <SaveIcon />
                      Save
                    </div>
                  )}
                </Button>
              )}
          </form>
        </div>
      )}
    </div>
  );
};

export default RecipeInputForm;
