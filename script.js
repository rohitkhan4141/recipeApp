//selector
const burgerMenu = document.querySelector(".burger-menu");
const backdrop = document.querySelector(".backdrop");
const sectionLeft = document.querySelector(".section-left");
const container = document.querySelector(".container");

burgerMenu.addEventListener("click",()=>{
    sectionLeft.classList.add("section-left--test");
    backdrop.style.display = "block";
    container.classList.add("container-smallScreen");

})
backdrop.addEventListener("click",()=>{
    sectionLeft.classList.remove("section-left--test");
    backdrop.style.display = "none";
    container.classList.remove("container-smallScreen");
})

const overview = document.querySelector(".section-left__items li:nth-child(1)");
const recipe = document.querySelector(".section-left__items li:nth-child(2)");
const uiContainer = document.querySelector(".section-right-bottom");
const allList = document.querySelectorAll(".section-left__item");
const modalContent = document.querySelector(".modal__content");
const modalButton = document.getElementById("modal__button");
const input = document.getElementById("input");
const search = document.getElementById("search");
const recipeHeading = document.querySelector(".recepie__card h2");
const recipeImage = document.querySelector(".recepie__card img");
const recipeContainer = document.querySelector(".section-right-bottom");
const errorHandlr = document.querySelector(".err");
const getRecipe = document.querySelectorAll(".btn-recipe");


for(let i = 0; i < allList.length; i++){
    allList[i].addEventListener("click", function(){
        let current = document.querySelector(".active")
        if(current){
          current.classList.remove('active')
        }
        this.classList.add('active')
    })
}

recipeContainer.addEventListener("click",(event)=>{
    getMealDetailes(event);
})

overview.addEventListener("click", ()=>{
    fetchBySearch("");

})

recipe.addEventListener("click",()=>{
    uiContainer.innerHTML = "";
    input.disabled = false;
})

modalButton.addEventListener("click",()=>{
    modalButton.parentElement.parentElement.classList.remove("show");
})

search.addEventListener("click",searchRecipe)
input.addEventListener("keypress",(event)=>{
    if(event.key === "Enter"){
        searchRecipe();
        
    }
})


//functions

function getMealDetailes (e){
    if(e.target.classList.contains("btn-recipe")){
        let mealItem = e.target.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.id}`)
        .then((res)=>res.json())
        .then(({meals})=>popup(meals[0]))
        console.log(mealItem);
    }
}

function popup(mealData){
    console.log(mealData)
    const ingredients = [];
    for(let i= 1; i<=20; i++){
        if(mealData["strIngredient"+i]){
            ingredients.push(`${mealData["strIngredient"+i]}- ${mealData["strMeasure"+i]}`);
            
        }else{
            break;
        }
    }
    console.log(ingredients)
    let mealDetails = `<div class="modal-inner">
    <div class="modal">
       <img src=${mealData.strMealThumb} alt="">
       <h2>${mealData.strMeal}</h2>
       <p>${mealData.strInstructions}</p>
       <h3>Ingredients</h3>
       <ul class="ingredient-lists">
       ${ingredients.map(ingredient => `
         <li>${ingredient}</li>`
         ).join("")}
        </ul>
    </div>
</div>`
    modalContent.innerHTML =  mealDetails;
    modalContent.parentElement.parentElement.classList.add("show");
}


function fetchBySearch(queryStr){
    const queryString = queryStr;
    const baseUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${queryString}`;
    fetch(baseUrl)
    .then((res)=> res.json())
    .then(({meals}) =>printTheMealToUI(meals))
    .catch(err=>InputFieldError(err))
}

function printTheMealToUI (meals){
    let filteredMeals;
    if(meals.length > 20){
        filteredMeals = meals.slice(0,20);
    }
    filteredMeals = meals;
    if(filteredMeals){
        recipeContainer.innerHTML = "";
        filteredMeals.forEach(element => {
            recipeContainer.innerHTML += `<div class="recepie__card" id=${element.idMeal}>
             <img src=${element.strMealThumb} alt="">
             <h2>${element.strMeal}</h2>
             <button class="btn btn-recipe">Get Recepie</button>
           </div>`
         });
    } 
}

function searchRecipe(){
    const inputVal = input.value;
    if(inputVal === ""){
        recipeContainer.innerHTML = `<div class="err">
        <h3>Search For just Chicken, Beef,Egg</h3>
      </div>`
        return;
    }
    fetchBySearch(inputVal)
}

function InputFieldError(){
    recipeContainer.innerHTML = "";    
    recipeContainer.innerHTML = `<div class="err">
    <h3>Search For just Chicken, Beef,Egg</h3>
  </div>`
}



