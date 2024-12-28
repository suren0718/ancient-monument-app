// Function to show the login modal
function showLoginModal() {
  document.getElementById("login-modal").style.display = "flex";
}

// Function to close the login modal
function closeLoginModal() {
  document.getElementById("login-modal").style.display = "none";
}

// Function to show the signup modal
function showSignupModal() {
  document.getElementById("signup-modal").style.display = "flex";
}

// Function to close the signup modal
function closeSignupModal() {
  document.getElementById("signup-modal").style.display = "none";
}

document.querySelectorAll(".modal-content").forEach((element) =>
  element.addEventListener("click", function (event) {
    event.stopPropagation();
  })
);

// Handle login form submission
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    axios
      .post("http://127.0.0.1:5000/api/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        alert("Login successful");
        localStorage.setItem("authEmail", response.data.email);
        setFavourites(response.data.favouriteMonuments);
        toggleNav();
        closeLoginModal();
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        } else {
          alert("An error occurred. Please try again.");
        }
      });
  });

// Handle signup form submission
document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const newEmail = document.getElementById("newEmail").value;
    const newPassword = document.getElementById("newPassword").value;

    axios
      .post("http://127.0.0.1:5000/api/signup", {
        email: newEmail,
        password: newPassword,
      })
      .then((response) => {
        alert("Signup successful");
        localStorage.setItem("authEmail", response.data.email);
        setFavourites(response.data.favouriteMonuments);
        toggleNav();
        closeSignupModal();
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        } else {
          alert("An error occurred. Please try again.");
        }
      });
  });

// Function to handle monument search
function searchMonument() {
  const searchTerm = document.getElementById("search-box").value;

  if (searchTerm.trim() === "") {
    displayAll();
  }

  axios
    .get(`http://127.0.0.1:5000/api/search?q=${searchTerm.trim()}`)
    .then((response) => {
      // Assuming the API returns a list of monuments matching the search term
      console.log(response.data);
      displayMonuments(response.data);
    })
    .catch((error) => {
      console.error("Error searching for monuments:", error);
      alert("Monument search failed. Please try again.");
    });
}

const setFavourites = (fav) => {
  localStorage.setItem("favouriteMonuments", JSON.stringify(fav));
  displayAll();
};

// Function to dynamically display monuments on the page (assumes the response contains an array of monuments)
function displayMonuments(monuments) {
  const container = document.querySelector(".monuments-container");
  container.innerHTML = "";

  if (monuments.length === 0) {
    container.innerHTML = "<p>No monuments found</p>";
    return;
  }

  monuments
    .sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    })
    .forEach((monument) => {
      const monumentDiv = document.createElement("div");
      monumentDiv.classList.add("monument");
      monumentDiv.id = monument._id;
      fill = getFavourites().includes(monument._id) ? "red" : "white";
      monumentDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill=${fill}><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/></svg>
      <img src="${monument.imageURL}" alt="${monument.name}">
      <h2>${monument.name}</h2>
      <p>${monument.description}</p>
  `;

      container.appendChild(monumentDiv);
    });
  document.querySelectorAll("svg").forEach((element) => {
    element.addEventListener("click", () => {
      toggleFav(element.parentElement.id);
    });
  });
}

const displayAll = () => {
  axios
    .get("http://127.0.0.1:5000/api")
    .then((response) => displayMonuments(response.data));
};

const toggleNav = () => {
  if (localStorage.getItem("authEmail")) {
    document.querySelector(".nav-right").innerHTML = `
        <button onclick="logout()">Logout</button>
        <button>About Us</button>`;
  } else {
    document.querySelector(
      ".nav-right"
    ).innerHTML = `<button onclick="showLoginModal()">Login</button>
        <button onclick="showSignupModal()">Sign Up</button>
        <button>About Us</button>`;
  }
};

const logout = () => {
  localStorage.clear();
  alert("Logged Out Successfully");
  toggleNav();
  displayAll();
};

const toggleFav = (id) => {
  const svg = document.querySelector(`#${CSS.escape(id)} svg`);
  if (!isFavourite(id)) {
    axios
      .post("http://127.0.0.1:5000/api/addFavourite", {
        email: localStorage.getItem("authEmail"),
        id: id,
      })
      .then((response) => {
        addFavourite(id);
        svg.setAttribute("fill", "red");
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        }
      });
  } else {
    axios
      .post("http://127.0.0.1:5000/api/removeFavourite", {
        email: localStorage.getItem("authEmail"),
        id: id,
      })
      .then((response) => {
        removeFavourite(id);
        svg.setAttribute("fill", "white");
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        }
      });
  }
};

const isFavourite = (id) => {
  return getFavourites().includes(id);
};

const getFavourites = () => {
  return JSON.parse(localStorage.getItem("favouriteMonuments")) || [];
};

const addFavourite = (id) => {
  const favourites = getFavourites();
  favourites.push(id);
  localStorage.setItem("favouriteMonuments", JSON.stringify(favourites));
};

const removeFavourite = (id) => {
  const favourites = getFavourites().filter((item) => item !== id);
  localStorage.setItem("favouriteMonuments", JSON.stringify(favourites));
};

document.addEventListener("DOMContentLoaded", () => {
  displayAll();
  toggleNav();
});

console.log(
  localStorage.getItem("favouriteMonuments"),
  localStorage.getItem("authEmail")
);
