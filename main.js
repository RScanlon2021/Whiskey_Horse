// const whiskeyName = document.querySelector("h2");
const urlApi = "https://whiskey-horse-api.herokuapp.com/api/";

const searchBtn = document.querySelector("button");
const searchInput = document.querySelector("input");
const nameRes = document.querySelector(".name");
const typeRes = document.querySelector(".type");
const compositionRes = document.querySelector(".composition");
const ageRes = document.querySelector(".age");
const percentRes = document.querySelector(".percentage");
const originRes = document.querySelector(".origin");
const priceRes = document.querySelector(".price");
const searchWrapper = document.querySelector(".selection-wrapper");
const resultsWrapper = document.querySelector(".auto-results");
const resultsContainer = document.querySelector(".results-container");
const whiskeyArr = [];
let dropdownItemsArr = [];
let count = -1;
let active = -1;
let results = "";
let itemsSet = [];

function capitalizeWords(string) {
  return string.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
}

async function getWhiskey() {
  const whiskeyName = searchInput.value;
  try {
    const res = await fetch(`${urlApi}${whiskeyName}`);
    const data = await res.json();

    if (data.origin === "") {
      console.log("We're sorry but this whiskey is unavailible at the moment");
    } else {
      nameRes.innerText = capitalizeWords(whiskeyName);
      if (data.type === "Irish") {
        typeRes.innerText = `${data.type} 🇮🇪`;
      } else if (data.type === "Scotch") {
        typeRes.innerText = `${data.type} 🏴󠁧󠁢󠁳󠁣󠁴󠁿`;
      } else if (
        data.type === "Bourbon" ||
        data.type === "Rye" ||
        data.type === "Wheat"
      ) {
        typeRes.innerText = `${data.type} 🇺🇸`;
      } else if (data.type === "Japan") {
        typeRes.innerText = `${data.type} 🇯🇵`;
      } else if (data.type === "World") {
        typeRes.innerText = `${data.type} 🌍`;
      }

      compositionRes.innerText = data.composition;
      if (data.age === "N.A.S") {
        ageRes.innerText = `${data.age}`;
      } else {
        ageRes.innerText = `${data.age} Year Old`;
      }
      percentRes.innerText = `${data.percent}%`;
      originRes.innerText = data.origin;
      priceRes.innerText = `£${data.price.toFixed(2)}`;
    }
  } catch (error) {
    console.log(`Error`);
  }
}

///////////////////////////display and search function

async function predictiveSearch() {
  try {
    const res = await fetch(`${urlApi}`);
    const data = await res.json();

    whiskeyArr.push(Object.keys(data));
    let searchable = whiskeyArr[0];
    console.log(searchable);

    searchInput.addEventListener("keyup", (e) => {
      let listResults = [];
      let input = searchInput.value;
      if (input.length) {
        listResults = searchable.filter((item) => {
          return item.toLowerCase().includes(input.toLowerCase());
        });
      }
      renderResults(listResults.slice(0, 5));
    });
    function renderResults(listResults) {
      if (!listResults.length) {
        return searchWrapper.classList.remove("show");
      }
      const content = listResults
        .map((item) => {
          dropdownItemsArr.push(item);
          return `<li>${item}</li>`;
        })
        .join(" ");
      searchWrapper.classList.add("show");
      resultsWrapper.innerHTML = `<ul>${content}</ul>`;
    }
  } catch (error) {
    console.log(`Error`);
  }
}

//////////////////////////////Navigate dropdown menu with arrow keys

document.addEventListener("keydown", (e) => {
  itemsSet = [...new Set(dropdownItemsArr)];

  let input = searchInput.value;

  if (e.key === "ArrowDown") {
    if (input.length) {
      results = itemsSet.filter((item) => {
        return item.toLowerCase().includes(input.toLowerCase());
      });
      if (count < results.length - 1) {
        count++;
        ///////////////////////////HIGHLIGHT A CHANGE IN LIST ITEM
        if (results[count]) {
          console.log(`${results[count]} Highlighted`);

          return (resultsWrapper.firstChild.children[count].style.background =
            "#ececec");
        }
      }
    } else {
      itemsSet.clear();
    }
  } else if (e.key === "ArrowUp") {
    if (input.length) {
      results = itemsSet.filter((item) => {
        return item.toLowerCase().includes(input.toLowerCase());
      });
      if (count > 0) {
        count--;
        ///////////////////////////HIGHLIGHT A CHANGE IN LIST ITEM
        if (results[count]) {
          console.log(`${results[count]} Highlighted`);
          return (resultsWrapper.firstChild.children[count].style.background =
            "#ececec");
        }
      }
    }
  }
});

//////////////////////////////////////THIS IS SUPPOSED TO HIGHLIGHT A CHANGE IS LIST ITEM HOWEVER IT PREVENTS SEARCH FUNCTION FOR SOME REASON

// document.addEventListener("keydown", (e) => {
//   if (e.key === "ArrowDown") {
//     if (active < results.length - 1) {
//       active++;
//       resultsWrapper.firstChild.children[count].tabIndex = count;
//       resultsWrapper.firstChild.children[active].focus();
//     }
//   } else if (e.key === "ArrowUp") {
//     if (active > 0) {
//       active--;
//       resultsWrapper.firstChild.children[active].focus();
//     }
//   }
// });

predictiveSearch();
searchBtn.addEventListener("click", (e) => {
  getWhiskey();
  // e.preventDefault();
  searchInput.value = "";
});
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getWhiskey();
    // event.currentTarget.value = results[count];
    // event.preventDefault();
    event.currentTarget.value = "";
    // itemsSet.clear();
    console.log(itemsSet);
  }
});
