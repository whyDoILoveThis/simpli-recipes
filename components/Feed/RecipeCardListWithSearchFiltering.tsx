import { fbGetAllRecipes } from "@/firebase/fbGetAllRecipes";
import React, { useEffect, useState, useCallback } from "react";
import RecipeCardList from "../ui/RecipeCardList";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Import ShadCN Pagination
import { useUserStore } from "@/hooks/useUserStore";
import { useAuth, useUser } from "@clerk/nextjs";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Search from "../icons/Search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import MyDropdownTrigger from "../ui/MyDropdownTrigger";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Timestamp } from "firebase/firestore";
import ItsDropdown from "../ui/its-dropdown";
import { BsThreeDots } from "react-icons/bs";
import ChevronsUpDown from "../icons/ChevronsUpDown";
import CloseButton from "../icons/CloseButton";

interface Props {
  filterFriends?: boolean;
  filterMine?: boolean;
  filterUser?: boolean;
  filterFavorites?: boolean;
  theUserUid?: string;
  handleEditRecipe?: (recipe: Recipe) => void;
  handleDeleteRecipe?: (recipeUid: string) => void;
}
const FriendsPosts = ({
  filterFriends = false,
  filterMine = false,
  filterUser = false,
  filterFavorites = false,
  theUserUid,
  handleEditRecipe,
  handleDeleteRecipe,
}: Props) => {
  const { dbUser, fetchUser } = useUserStore();
  const { user } = useUser();
  const { userId } = useAuth();

  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search input
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]); // State for filtered recipes
  const [currentPage, setCurrentPage] = useState<number>(1); // Pagination state
  const [showSearch, setShowSearch] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState<string>(""); // New state for category filtering
  const [sortOrder, setSortOrder] = useState<string>(""); // New state for sorting

  const breakfastCategorys = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Beverage",
    "other",
  ];
  const possibleSortOrders = ["Quickest", "Slowest", "Newest", "Oldest"];

  const recipesPerPage = 10; // Define how many recipes per page

  // Helper function to convert "1h 29m" to total minutes
  const convertToMinutes = (timeString: string) => {
    const regex = /(\d+)h\s*(\d+)m/; // Regex to capture hours and minutes
    const match = timeString.match(regex);

    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      return hours * 60 + minutes; // Convert to total minutes
    }

    return 0; // Return 0 if no match
  };

  // Helper function to get the timestamp in milliseconds
  const getTimestampInMilliseconds = (createdAt: Timestamp | Date) => {
    if (createdAt instanceof Date) {
      return createdAt.getTime(); // If it's a Date object, get the time in milliseconds
    } else if (
      createdAt &&
      typeof createdAt === "object" &&
      createdAt.seconds
    ) {
      return createdAt.seconds * 1000 + Math.floor(createdAt.nanoseconds / 1e6); // If it's a Firebase Timestamp, convert to milliseconds
    }
    return 0; // Fallback for unexpected formats
  };

  // Fetch friends and recipes combined to reduce duplication
  const fetchData = useCallback(async () => {
    if (userId && !dbUser) await fetchUser(userId, user);
    if (!dbUser || !dbUser.friends) return;

    const friendsList = dbUser.friends;
    const allRecipes = await fbGetAllRecipes();
    const favoritesList = dbUser.favoriteRecipes;

    // Apply filtering after fetching both friends and recipes
    const filtered = allRecipes
      .filter((recipe) => {
        const isFriendRecipe = friendsList.includes(recipe.creatorUid);
        const isMyRecipe = recipe.creatorUid === userId;
        const isUsersRecipe = recipe.creatorUid === theUserUid;
        const isFavoriteRecipe =
          recipe.uid && favoritesList?.includes(recipe.uid);
        const matchesSearchTerm =
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(searchTerm.toLowerCase())
          );

        if (filterFriends) {
          return isFriendRecipe && matchesSearchTerm;
        }
        if (filterFavorites) {
          return isFavoriteRecipe && matchesSearchTerm;
        }
        if (filterMine) {
          return isMyRecipe && matchesSearchTerm;
        }
        if (filterUser) {
          return isUsersRecipe && matchesSearchTerm;
        }

        return matchesSearchTerm;
      })
      .filter(
        (recipe) =>
          categoryFilter && categoryFilter !== "All Categorys"
            ? recipe.category === categoryFilter.toLowerCase()
            : true // Filter by category or show all
      )
      // Sorting logic
      .sort((a, b) => {
        if (sortOrder === "Quickest") {
          return convertToMinutes(a.totalTime) - convertToMinutes(b.totalTime); // Sort by cook time (ascending)
        } else if (sortOrder === "Slowest") {
          return convertToMinutes(b.totalTime) - convertToMinutes(a.totalTime); // Sort by cook time (descending)
        } else if (sortOrder === "Newest") {
          return (
            getTimestampInMilliseconds(b.createdAt) -
            getTimestampInMilliseconds(a.createdAt)
          ); // Sort by newest
        } else if (sortOrder === "Oldest") {
          return (
            getTimestampInMilliseconds(a.createdAt) -
            getTimestampInMilliseconds(b.createdAt)
          ); // Sort by oldest
        }
        return 0;
      });

    setFilteredRecipes(filtered);
  }, [userId, dbUser, searchTerm, categoryFilter, sortOrder, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Pagination logic
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  ); // Recipes for the current page

  const totalRecipes = filteredRecipes.length;
  const totalPages = Math.ceil(totalRecipes / recipesPerPage);

  return (
    <div className="flex flex-col items-center ">
      {/* Search Bar */}
      <div className="flex flex-col items-center mb-2 gap-2 w-full">
        <div
          className={`flex items-center w-full gap-2 ${
            showSearch && "justify-center"
          }`}
        >
          <div
            className={`border overflow-hidden rounded-full  transition-all duration-400 flex ${
              showSearch && "items-center w-full max-w-[180px]"
            }`}
          >
            <Input
              type="text"
              placeholder="Search recipes..."
              className={`w-[140px] ${
                !showSearch && "w-0 p-0 h-0 "
              } transition-all duration-500 border-none rounded-full`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term as user types
            />
            <Button
              onClick={() => setShowSearch(true)}
              className="flex items-center rounded-full border-0 p-3 border-l"
            >
              <Search />
              <p
                className={`ml-1 opacity-0 w-0 ${
                  !showSearch && "opacity-100 w-fit"
                }`}
              >
                Search
              </p>
            </Button>
          </div>
          {showSearch && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <ItsDropdown
                  menuClassNames="-translate-x-8"
                  theButton={
                    <Button className="p-0 w-[30px] h-[30px]">
                      <BsThreeDots className="text-slate-400" />
                    </Button>
                  }
                >
                  <ItsDropdown
                    theButton={
                      <button className="btn btn-ghost text-shadow flex gap-1 items-center">
                        Category
                        <span className="text-slate-300 text-sm text-opacity-60">
                          <ChevronsUpDown />
                        </span>
                      </button>
                    }
                  >
                    {breakfastCategorys.map((category, index) => (
                      <li
                        key={index}
                        className="btn btn-ghost"
                        onClick={() => {
                          setCategoryFilter(category);
                        }}
                      >
                        {category}
                      </li>
                    ))}
                  </ItsDropdown>
                  <ItsDropdown
                    theButton={
                      <button className="btn btn-ghost text-nowrap text-shadow flex gap-1 items-center">
                        Sort Order
                        <span className="text-slate-300 text-sm text-opacity-50">
                          <ChevronsUpDown />
                        </span>
                      </button>
                    }
                  >
                    {possibleSortOrders.map((sortOrder, index) => (
                      <li
                        key={index}
                        className="btn btn-ghost"
                        onClick={() => {
                          setSortOrder(sortOrder);
                        }}
                      >
                        {sortOrder}
                      </li>
                    ))}
                  </ItsDropdown>
                </ItsDropdown>

                <button
                  className="border rounded-full p-1 px-2 text-xs"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchTerm("");
                    setCategoryFilter("");
                    setSortOrder("");
                  }}
                >
                  ◀
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-1">
          {categoryFilter !== "" && categoryFilter !== "All Categorys" && (
            <div className="flex gap-2 items-center border rounded-full p-2">
              <div>{categoryFilter}</div>
              <button
                onClick={() => {
                  setCategoryFilter("");
                }}
                className="text-xl"
              >
                <CloseButton />
              </button>
            </div>
          )}
          {sortOrder !== "" && (
            <div className="flex gap-2 items-center border rounded-full p-2">
              <div>{sortOrder}</div>
              <button
                onClick={() => {
                  setSortOrder("");
                }}
                className="text-xl"
              >
                <CloseButton />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recipe List */}
      <div>
        {currentRecipes.length > 0 ? (
          <RecipeCardList
            recipes={currentRecipes}
            handleEditRecipe={handleEditRecipe}
            handleDeleteRecipe={handleDeleteRecipe}
          />
        ) : (
          <p>No recipes found.</p>
        )}
      </div>

      {/* Pagination Component */}
      <Pagination className="mt-4">
        <PaginationContent>
          {/* Previous Page Button */}
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>
          )}

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                isActive={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Next Page Button */}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default FriendsPosts;
