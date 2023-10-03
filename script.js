// Get necessary DOM elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');
const fav = document.getElementById('fav');
const reset = document.getElementById('reset');

// Initialize an empty array to store favorite meals
const favoritesList = [];

// Function to fetch meals from the API
async function fetchMeals(searchQuery) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`);
    const data = await response.json();

    if (data.meals === null) {
      alert('No meals found for this search query.');
    } else {
      displaySearchResults(data.meals);
    }
  } catch (error) {
    console.error(error);
  }
}

// Event listener for the search button
searchButton.addEventListener('click', () => {
  const searchQuery = searchInput.value;
  fetchMeals(searchQuery);
});

// Function to display meal items on screen
function displaySearchResults(meals) {
  searchResults.innerHTML = '';

  meals.forEach((meal) => {
    const mealElement = document.createElement('div');
    mealElement.classList.add('meal');

    mealElement.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h2>${meal.strMeal}</h2>
      <ul>
        ${createIngredientList(meal)}
      </ul>
      <p class="description">${meal.strInstructions}</p>
      <button class="read-more-button">Read More</button>
      <button class="favorite-button"><i class="fas fa-heart"></i> Add to Favorites</button>
    `;

    const readMoreButton = mealElement.querySelector('.read-more-button');
    const description = mealElement.querySelector('.description');
    readMoreButton.addEventListener('click', () => {
      description.classList.toggle('show');
    });

    const favoriteButton = mealElement.querySelector('.favorite-button');
    favoriteButton.addEventListener('click', () => {
      addToFavorites(meal);
    });

    searchResults.appendChild(mealElement);
  });
}

// Function to create an ingredient list
function createIngredientList(meal) {
  let ingredientList = '';
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredientList += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
    } else {
      break;
    }
  }
  return ingredientList;
}

// Function to add a meal to favorites
function addToFavorites(meal) {
  if (!favoritesList.some((favMeal) => favMeal.idMeal === meal.idMeal)) {
    favoritesList.push(meal);
    alert(`${meal.strMeal} has been added to your favorites.`);
  } else {
    alert(`${meal.strMeal} is already in your favorites.`);
  }
}

// Event listener for the "Favorites" link
fav.addEventListener('click', showFav);

// Function to display favorite meals
function showFav() {
  searchResults.innerHTML = '';

  if (favoritesList.length === 0) {
    const noFavMessage = document.createElement('p');
    noFavMessage.innerText = 'You have no favorite meals.';
    searchResults.appendChild(noFavMessage);
  } else {
    favoritesList.forEach((meal) => {
      const mealElement = document.createElement('div');
      mealElement.classList.add('meal');

      mealElement.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h2>${meal.strMeal}</h2>
        <ul>
          ${createIngredientList(meal)}
        </ul>
        <button class="remove-button"><i class="fas fa-trash"></i> Remove from Favorites</button>
      `;

      const removeButton = mealElement.querySelector('.remove-button');
      removeButton.addEventListener('click', () => {
        removeFromFavorites(meal);
      });

      searchResults.appendChild(mealElement);
    });
  }
}

// Function to remove a meal from favorites
function removeFromFavorites(meal) {
  const mealIndex = favoritesList.findIndex((fav) => fav.idMeal === meal.idMeal);
  if (mealIndex !== -1) {
    favoritesList.splice(mealIndex, 1);
    showFav();
    alert(`${meal.strMeal} has been removed from your favorites.`);
  }
}

// Event listener for the "Reset" button
reset.addEventListener('click', () => {
  searchResults.innerHTML = '';
});
