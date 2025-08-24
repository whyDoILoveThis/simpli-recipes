import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Image from "next/image";
import { fbUploadImage } from "@/firebase/fbUploadImage";
import Minus from "./icons/Minus";
import Plus from "./icons/Plus";
import { Slider } from "@/components/ui/slider";
import { convertTime } from "@/lib/utils";
import Upload from "./icons/Upload";
import ImageSearcher from "./ImageSearcher";
import { fbDeleteImage } from "@/firebase/firebaseDeleteImage";
import LoaderSpinner from "./ui/LoaderSpinner";
import FloatingOrbs from "./ui/FloatingOrbs";

enum RecipeCategory {
  Breakfast = "breakfast",
  Lunch = "lunch",
  Dinner = "dinner",
  Dessert = "dessert",
  Snack = "snack",
  Beverage = "beverage",
  Other = "other", // For recipes that don't fit the main categories
}

interface RecipeFormProps {
  mode: "add" | "edit"; // Mode for form (add/edit)
  recipeData: Recipe | Partial<Recipe>; // Recipe data for the form
  setNewRecipeData: React.Dispatch<React.SetStateAction<Partial<Recipe>>>;
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    formData: Recipe | Partial<Recipe>
  ) => void; // Submit handler
  onCancel?: () => void; // Cancel handler
}

export default function RecipeForm({
  mode,
  recipeData,
  setNewRecipeData,
  onSubmit,
  onCancel,
}: RecipeFormProps) {
  const [formData, setFormData] = useState<Recipe | Partial<Recipe>>(
    recipeData
  );
  const [ingredientInput, setIngredientInput] = useState<string>("");
  const [stepInput, setStepInput] = useState<string>("");
  const [image, setImage] = useState<File | null>(null); // State for file upload
  const [base64Url, setBase64Url] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageSearch, setImageSearch] = useState(false);
  const [imageSearchTerm, setImageSearchTerm] = useState("");
  const [currentImgUrlCopy, setCurrentImgUrlCopy] = useState("");
  const [deletingImage, setDeletingImage] = useState(false);
  const initialSearchTerm = recipeData.title || "";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      // Use FileReader to read and display the image
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setBase64Url(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to add an ingredient
  const addIngredient = () => {
    if (ingredientInput.trim() !== "") {
      setFormData({
        ...formData,
        ingredients: [...(formData.ingredients || []), ingredientInput],
      });
      setIngredientInput(""); // Clear input field
    }
  };

  // Function to delete an ingredient
  const deleteIngredient = (index: number) => {
    const updatedIngredients = formData.ingredients?.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  // Function to add a step
  const addStep = () => {
    if (stepInput.trim() !== "") {
      setFormData({
        ...formData,
        steps: [...(formData.steps || []), stepInput],
      });
      setStepInput(""); // Clear step text area
    }
  };

  // Function to delete a step
  const deleteStep = (index: number) => {
    const updatedSteps = formData.steps?.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: updatedSteps });
  };

  // Function to handle category selection
  const handleCategoryChange = (category: RecipeCategory) => {
    setFormData({ ...formData, category });
  };

  const uploadAndGetUrl = async () => {
    console.log("ulpading image");
    if (!image) return;
    if (imageUrl) {
      setDeletingImage(true);
      await fbDeleteImage(imageUrl);
      setDeletingImage(false);
    }

    const tempImageUrl = await fbUploadImage(image);
    setImageUrl(tempImageUrl);
    setBase64Url(tempImageUrl); // Update base64Url with the new image URL
    setFormData({
      ...formData,
      photoUrl: tempImageUrl,
    });
  };

  useEffect(() => {
    uploadAndGetUrl();
  }, [image]);

  // Updated onSubmit to include formData
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      image &&
      image !== null &&
      image !== undefined &&
      base64Url &&
      base64Url !== null &&
      base64Url !== undefined &&
      base64Url !== ""
    ) {
      if (recipeData.photoUrl && recipeData.photoUrl !== "") {
        await fbDeleteImage(recipeData.photoUrl);
      }
      await uploadAndGetUrl();
    }

    onSubmit(e, formData);
  };

  useEffect(() => {
    setNewRecipeData(formData); // Set form data when recipeData changes
  }, [formData]);

  useEffect(() => {
    setFormData({
      ...formData,
      totalTime:
        (formData.totalTimeTemp && convertTime(formData.totalTimeTemp)) || "0",
    });
  }, [formData.totalTimeTemp]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(
        source.droppableId === "ingredients"
          ? formData.ingredients || []
          : formData.steps || []
      );
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      if (source.droppableId === "ingredients") {
        setFormData({ ...formData, ingredients: items });
      } else {
        setFormData({ ...formData, steps: items });
      }
    }
  };

  useEffect(() => {
    if (currentImgUrlCopy && currentImgUrlCopy !== "") {
      setFormData({
        ...formData,
        photoUrl: currentImgUrlCopy,
      });
    }
  }, [currentImgUrlCopy]);

  const onSearch = () => {};

  console.log(formData);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <article className=" w-full p-4 flex flex-col items-center">
        <div className="w-fit relative rounded-3xl overflow-hidden">
          <FloatingOrbs
            className="blur-3xl rounded-3xl overflow-hidden absolute inset-0 -z-10"
            count={7}
          />

          <form
            onSubmit={handleSubmit}
            className={`z-10 ${mode}-recipe-form flex flex-col gap-8 p-4 max-w-[400px]  bg-black bg-opacity-0 dark:bg-white dark:bg-opacity-10 rounded-3xl`}
          >
            <h3 className="text-2xl font-bold mb-4">
              {mode === "add" ? "Add Recipe" : "Edit Recipe"}
            </h3>
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold">Image</h4>
              <span className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setImageSearch(false);
                    setBase64Url("");
                    setCurrentImgUrlCopy("");
                    setImage(null);
                  }}
                  className={`btn ${!imageSearch && "btn-selected"}`}
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (imageUrl && imageUrl !== "") {
                      fbDeleteImage(imageUrl);
                      setImageUrl("");
                    }
                    setImageSearch(true);
                  }}
                  className={`btn ${imageSearch && "btn-selected"}`}
                >
                  Image Search
                </button>
              </span>
            </div>
            {deletingImage ? (
              <div>
                <LoaderSpinner />
              </div>
            ) : (
              <>
                {imageSearch ? (
                  <ImageSearcher
                    initialSearchTerm={recipeData.title}
                    setCurrentImgUrlCopy={setCurrentImgUrlCopy}
                  />
                ) : (
                  <div className="input">
                    {base64Url !== "" && (
                      <Image
                        width={200}
                        height={80}
                        src={base64Url}
                        alt={base64Url}
                      />
                    )}
                    <div className=" flex justify-center relative">
                      <span className="text-7xl">
                        <div className="border-dashed border-2 bg-white bg-opacity-5  text-slate-300 rounded-xl p-1 px-6 border-slate-500">
                          <Upload />
                        </div>
                      </span>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className=" w-full h-full cursor-pointer absolute top-0 opacity-0"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
            {/* Recipe Title */}
            <div>
              <h4 className="font-semibold mb-2">Title</h4>
              <Input
                className="mb-4"
                placeholder="Title"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            {/* Recipe Category Selection */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Category</h4>
              {Object.values(RecipeCategory).map((category) => (
                <div key={category} className="flex items-center gap-2">
                  <Checkbox
                    id={category}
                    checked={formData.category === category}
                    onCheckedChange={() =>
                      handleCategoryChange(category as RecipeCategory)
                    }
                  />
                  <label htmlFor={category} className="capitalize">
                    {category}
                  </label>
                </div>
              ))}
            </div>
            {/* Ingredients Section */}
            <div>
              <h4 className="font-semibold mb-1">Ingredients</h4>
              <Droppable droppableId="ingredients" key="ingredients">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`mb-4 p-2 rounded-2xl ${
                      snapshot.isDraggingOver
                        ? "bg-gray-200 dark:bg-slate-950 dark:bg-opacity-20"
                        : ""
                    }`}
                  >
                    {formData.ingredients &&
                      formData.ingredients.length > 0 &&
                      formData.ingredients.map((ingredient, index) => (
                        <Draggable
                          key={`ingredient-${index}`}
                          draggableId={`ingredient-${index}-${ingredient}`}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center gap-4 mb-1 border border-slate-700 rounded-3xl w-fit p-2"
                            >
                              <span className="cursor-move">⋮⋮</span>
                              <span>{ingredient}</span>
                              <Button
                                className="p-2 w-[30px] h-[30px]"
                                type="button"
                                onClick={() => deleteIngredient(index)}
                              >
                                <Minus />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            {/* Add Ingredient Input */}
            <div className="flex justify-center items-center gap-2 mb-4">
              <Input
                placeholder="Add Ingredient"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
              />
              <Button
                type="button"
                className={`text-xl p-1 w-[25px] h-[25px]
            `}
                onClick={addIngredient}
              >
                <Plus />
              </Button>
            </div>
            {/* Steps Section */}
            <div>
              <h4 className="font-semibold mb-2">Steps</h4>
              <Droppable droppableId="steps" type="group" key="steps">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`mb-4 p-2 rounded-2xl ${
                      snapshot.isDraggingOver
                        ? "bg-gray-200 dark:bg-slate-950 dark:bg-opacity-20"
                        : ""
                    }`}
                  >
                    {formData.steps &&
                      formData.steps.length > 0 &&
                      formData.steps.map((step, index) => (
                        <Draggable
                          key={`step-${index}`}
                          draggableId={`step-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center gap-4 mb-1 border border-slate-700 rounded-3xl w-fit p-2"
                            >
                              <span className="cursor-move">⋮⋮</span>
                              <span>
                                <strong>Step {index + 1}:</strong> {step}
                              </span>
                              <Button
                                className="p-2 w-[30px] h-[30px]"
                                type="button"
                                onClick={() => deleteStep(index)}
                              >
                                <Minus />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            {/* Add Step Textarea */}
            <div className="flex items-center gap-2 mb-4">
              <Textarea
                placeholder="Add Step"
                value={stepInput}
                onChange={(e) => setStepInput(e.target.value)}
              />
              <Button
                type="button"
                className={`text-xl p-1 w-[25px] h-[25px] `}
                onClick={addStep}
              >
                <Plus />
              </Button>
            </div>
            {/* Time Slider */}
            <div className="flex flex-col gap-1">
              <label htmlFor="timeSlider">
                <h4 className="font-semibold mb-2">
                  Total Time:{" "}
                  {recipeData.totalTimeTemp &&
                    convertTime(recipeData.totalTimeTemp)}
                </h4>
              </label>
              <Slider
                id="timeSlider"
                min={1}
                max={500}
                step={1}
                defaultValue={
                  (formData.totalTimeTemp && [formData.totalTimeTemp]) || [0]
                }
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    totalTimeTemp: value[0],
                  })
                }
              />
            </div>
            {/* Notes Section */}
            <div>
              <h4 className="font-semibold mb-2">Notes</h4>
              <Textarea
                className="mb-4"
                placeholder="Notes (optional)"
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
            {/* Buttons */}
            <div className="flex gap-4">
              <Button type="submit" variant="green">
                {mode === "add" ? "Add Recipe" : "Update Recipe"}
              </Button>
              {onCancel && (
                <Button type="button" variant="destructive" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>
      </article>
    </DragDropContext>
  );
}
