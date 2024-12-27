// Function to show the login modal
function showLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
}

// Function to close the login modal
function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

// Function to show the signup modal
function showSignupModal() {
    document.getElementById('signup-modal').style.display = 'flex';
}

// Function to close the signup modal
function closeSignupModal() {
    document.getElementById('signup-modal').style.display = 'none';
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    axios.post('/api/login', {
        email: email,
        password: password
    })
    .then(response => {
        alert('Login successful');
        closeLoginModal();
        // Handle the successful login response here, such as redirecting the user
    })
    .catch(error => {
        console.error('Error logging in:', error);
        alert('Login failed. Please try again.');
    });
});

// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const newEmail = document.getElementById('newEmail').value;
    const newPassword = document.getElementById('newPassword').value;

    axios.post('/api/signup', {
        email: newEmail,
        password: newPassword
    })
    .then(response => {
        alert('Signup successful');
        closeSignupModal();
        // Handle the successful signup response here, such as logging the user in automatically
    })
    .catch(error => {
        console.error('Error signing up:', error);
        alert('Signup failed. Please try again.');
    });
});

// Function to handle monument search
function searchMonument() {
    const searchTerm = document.getElementById('search-box').value;

    if (searchTerm.trim() === '') {
        alert('Please enter a search term.');
        return;
    }

    axios.get(`/api/search?query=${searchTerm}`)
    .then(response => {
        // Assuming the API returns a list of monuments matching the search term
        displayMonuments(response.data);
    })
    .catch(error => {
        console.error('Error searching for monuments:', error);
        alert('Monument search failed. Please try again.');
    });
}

// Function to dynamically display monuments on the page (assumes the response contains an array of monuments)
function displayMonuments(monuments) {
    const container = document.querySelector('.monuments-container');
    container.innerHTML = ''; // Clear the current monument display

    if (monuments.length === 0) {
        container.innerHTML = '<p>No monuments found</p>';
        return;
    }

    monuments.forEach(monument => {
        const monumentDiv = document.createElement('div');
        monumentDiv.classList.add('monument');

        monumentDiv.innerHTML = `
            <img src="${monument.imageUrl}" alt="${monument.name}">
            <h2>${monument.name}</h2>
            <p>${monument.description}</p>
        `;

        container.appendChild(monumentDiv);
    });
}
