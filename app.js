// const { start } = require("repl");

// ******************************
// *SELECTORS*
// ******************************
const header = document.querySelector("header");
const body = document.getElementsByTagName("BODY")[0];
const searchBar = document.querySelector(`#searchBar`);
const searchContainer = document.querySelector(`.search-container`);
const bannerContainer = document.querySelector(`.hero-banner-container`);
const projectContainer = document.querySelector(`.project-container`);
const projectList = document.querySelector(`.project-list`);
const projectPage = document.querySelector(`.project-page-container`);
const projectPageContainer = document.querySelector(`.project-page`);
const pagination = document.querySelector(`.pagination-ul`);
const footer = document.querySelector("footer");
const requestBar = document.querySelector(".request-bar");
const requestButton = document.querySelector(".request-button");
const modalOverlay = document.querySelector(".modal-overlay");
const requestModal = document.querySelector(".request-modal-container");
let likeProject = [];
const cards = 6;
let mtx = [];

// ******************************
// *CLASSES*
// ******************************

class App {
  constructor() {
    this.loadProjects();
    console.log("Trollolol");
  }

  // PARSE CSV FILE AND PRODUCE MATRIX
  // Page is the current page. Cards is the number of cards/page
  async loadProjects() {
    const response = await fetch("test.csv");
    const data = await response.text();

    // Split data into rows and get rid of the header row
    let rows = await data.split("\n").slice(1);

    // Convert row of commas into an array. Matrix formed (multiple rows of arrays)
    mtx = await rows.map((row) => row.split(`,`));

    this.runMatrix(mtx, 1);
  }

  // RUN THE MATRIX (CREATE CARDS + PAGINATION)
  runMatrix(mtx = mtx, currentPage) {
    // Sets the cards to show on a currentPage
    let startCard = (currentPage - 1) * cards;
    let endCard = startCard + cards;

    let totalPages = Math.ceil(mtx.length / cards);

    // Filters to the card for a currentPage
    const displayedCards = mtx.slice(startCard, endCard);

    this.createProjectCard(displayedCards);

    // Create pagination at bottom of currentPage
    this.paginate(totalPages, currentPage);
  }

  // READS MATRIX AND ADDS HTML CARDS
  createProjectCard(mtx) {
    projectList.innerHTML = "";

    // For each row (array), create a HTML card
    mtx.forEach((project) => {
      const htmlString = `
    <li class="project-card-container">
        <img
        src="${project[3]}"
        alt=""
        class="project-card-img"
        />
        <div class="project-card-text-container">
        <div>
        <p class="project-card-id" style="display: none;">${project[0]}</p>
        <h2 class="project-card-title">${project[1]}</h2>
        <p class="project-card-eta">Est. ${project[2]}</p>
        </div>
        <i class="far fa-heart"></i>
        </div>
    </li>`;

      projectList.insertAdjacentHTML(`beforeend`, htmlString);
    });

    likeProject = document.querySelectorAll(".fa-heart");

    // FAVOURITE PROJECTS
    // Putting it here for now since it only works after items load
    likeProject.forEach(function (item) {
      // Activate heart if it is in local storage
      // Gets the ID of the project card
      const id =
        item.closest("div div").firstElementChild.firstElementChild.innerText;

      for (let i = 0; i < localStorage.length; i++) {
        if (id == localStorage.key(i)) {
          item.classList.remove("far");
          item.classList.add("fas");
          item.classList.add("heart");
        }
      }

      item.addEventListener("click", function () {
        item.classList.toggle("far");
        item.classList.toggle("fas");
        item.classList.toggle("heart");

        // Checks whether the project was saved and adds/removes from local storage
        if (item.classList.contains("heart")) {
          localStorage.setItem(id, id);
        } else {
          localStorage.removeItem(id, id);
        }
      });
    });

    const projectCard = document.querySelectorAll(`.project-card-container`);

    // Project Page Load on Click

    projectCard.forEach(function (card) {
      card.addEventListener(`click`, function (e) {
        if (e.target.classList.contains("fa-heart")) return;

        const id = card.querySelector(".project-card-id").innerHTML;

        let project = {};

        for (let i = 0; i < mtx.length; i++) {
          console.log(i);
          if (id === mtx[i][0]) {
            project = mtx[i];
          }
        }

        const htmlString = `
        <div class="project-page-container">
        <div class="project-page-content-container">
          <img
            class="project-page-image"
            src="${project[3]}"
            alt=""
          />
          <div class="project-page-text-container">
            <h1>${project[1]}</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque
              nulla aliquid earum ducimus sit maxime aperiam dignissimos
              reprehenderit nam! Aliquid, veritatis quos! Eum, doloribus odit.
            </p>
            <p class="project-page-eta">Est. ETA: <br />12/12/2022</p>
          </div>
        </div>
  
        <div class="project-page-timeline-container">
          <ul class="project-page-timeline">
            <li class="timeline-active">By 20/10/21<br />GB Completed</li>
            <li>By 20/10/21<br />GB Completed</li>
            <li>By 20/10/21<br />GB Completed</li>
            <li>By 20/10/21<br />GB Completed</li>
            <li>By 20/10/21<br />GB Completed</li>
          </ul>
        </div>
  
        <div class="project-page-support-form-container">
          <form action="" class="support-form">
            <h2>Contact Owner</h2>
            <label for="email"></label>
            <input
              type="email"
              placeholder="Enter email..."
              name="email"
              required
            />
  
            <label for="project"></label>
            <textarea
              rows="5"
              name="project"
              placeholder="Enter project name..."
              required
            ></textarea>
            <div class="support-form-button-container">
              <button type="submit" class="support-form-button">Submit</button>
            </div>
          </form>
        </div>
      </div>`;

        projectPageContainer.insertAdjacentHTML(`beforeend`, htmlString);

        modalOverlay.classList.toggle("hidden");
      });
    });
  }

  // PAGINATION
  paginate(totalPages, currentPage) {
    let buttons = ``;
    let activeButton;
    let beforePage = currentPage - 1;
    let afterPage = currentPage + 1;

    // Adds previous button
    if (currentPage > 1) {
      buttons += `<li class="pagination-prev" onclick="mainApp.runMatrix(mtx, ${
        currentPage - 1
      })"><i class="fas fa-chevron-left"></i></li>`;
    }

    // Adds three page numbers at all times
    for (let page = beforePage; page <= afterPage; page++) {
      if (page > totalPages) {
        continue;
      }

      if (page == 0) {
        page = page + 1;
      }

      // Makes center page active and highlighted
      if (page == currentPage) {
        activeButton = `active`;
      } else {
        activeButton = ``;
      }

      buttons += `<li class="pagination-number ${activeButton}" onclick="mainApp.runMatrix(mtx, ${page})"><span>${page}</span></li>`;
    }

    // Adds next button
    if (currentPage < totalPages) {
      buttons += `<li class="pagination-next" onclick="mainApp.runMatrix(mtx, ${
        currentPage + 1
      })"><i class="fas fa-chevron-right" ></i></li>`;
    }

    pagination.innerHTML = buttons;
  }
}

const mainApp = new App();

// ******************************
// *EVENT LISTENERS*
// ******************************

// LOAD PROJECTS - SEARCH BAR
searchBar.addEventListener(`keyup`, (e) => {
  // Remove all cards
  projectList.innerHTML = "";

  // Make case insensitive
  const searchString = e.target.value.toLowerCase();

  // Returns a matrix of filtered projects
  if (searchString === "") {
    mainApp.loadProjects();
  } else {
    mtx = mtx.filter((project) =>
      project[1].toLowerCase().includes(searchString)
    );
    mainApp.runMatrix(mtx, 1);
  }

  // Scroll up every time you type a key
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

// Request Bar - remove at bottom

const reqObsOpt = {
  root: null,
  threshold: 1,
};

const fixRequestBar = function (entries) {
  const [entry] = entries;

  if (entry.isIntersecting) {
    requestBar.classList.add("display-none");
  } else {
    requestBar.classList.remove("display-none");
  }
};

const requestObserver = new IntersectionObserver(fixRequestBar, reqObsOpt);

requestObserver.observe(footer);

// Search Bar - fix on scroll

const searchObsOpt = {
  root: null,
  threshold: 0,
};

const fixSearchContainer = function (entries) {
  const [entry] = entries;

  // Since "fixed" results in overlap, we have to adjust the margin for the banner as well
  if (!entry.isIntersecting) {
    searchContainer.classList.add("search-fixed");
    bannerContainer.style.marginTop = `6rem`;
  } else {
    searchContainer.classList.remove("search-fixed");
    bannerContainer.style.marginTop = `0`;
  }
};

const searchObserver = new IntersectionObserver(
  fixSearchContainer,
  searchObsOpt
);

searchObserver.observe(header);

// Request form - general function to unhide
const showRequestForm = function () {
  modalOverlay.classList.remove("hidden");
  requestModal.classList.remove("hidden");
};

// Request form - general function to hide
const hideRequestForm = function () {
  modalOverlay.classList.add("hidden");
  requestModal.classList.add("hidden");
  projectPageContainer.innerHTML = "";
};

// Request form - button activation to unhide
requestBar.addEventListener(`click`, showRequestForm);

// Request form - button activation to hide
modalOverlay.addEventListener(`click`, hideRequestForm);
document.addEventListener(`keydown`, function (e) {
  if (e.key === "Escape" && !requestModal.classList.contains("hidden"))
    hideRequestForm();
});

const account = document.querySelector(".account");
console.log(account);

account.addEventListener("click", function () {
  this.classList.toggle("far");
  this.classList.toggle("fas");
  this.classList.toggle("activeUser");

  if (this.classList.contains("activeUser")) {
    console.log(mtx);
    mtx = mtx.filter(favourited);
    mainApp.runMatrix(mtx, 1);
  } else {
    mainApp.loadProjects();
  }
});

function favourited(project) {
  for (let i = 0; i < localStorage.length; i++) {
    if (project[0] == localStorage.key(i)) {
      return true;
    }
  }

  return false;
}
