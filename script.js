
function showError(input, errorElement, message) {
  errorElement.textContent = message;
  input.style.borderColor = "#a51d16";
}

function clearError(input, errorElement) {
  errorElement.textContent = "";
  input.style.borderColor = "";
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("buildsphere_users")) || [];
  } catch {
    return [];
  }
}


const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");
    const emailError = document.getElementById("loginEmailError");
    const passwordError = document.getElementById("loginPasswordError");

    clearError(email, emailError);
    clearError(password, passwordError);

    let valid = true;
    const cleanEmail = email.value.trim().toLowerCase();

    if (!cleanEmail) {
      showError(email, emailError, "Please enter your email.");
      valid = false;
    } else if (!validEmail(cleanEmail)) {
      showError(email, emailError, "Please enter a valid email.");
      valid = false;
    }

    if (!password.value) {
      showError(password, passwordError, "Please enter your password.");
      valid = false;
    } else if (password.value.length < 6) {
      showError(
        password,
        passwordError,
        "Password must contain at least 6 characters."
      );
      valid = false;
    }

    if (!valid) return;

    const user = getUsers().find(
      (item) =>
        item.email === cleanEmail &&
        item.password === password.value
    );

    if (!user) {
      showError(
        password,
        passwordError,
        "Incorrect email or password. Please sign up first if you are new."
      );
      return;
    }

    localStorage.setItem("buildsphere_logged_in", "true");
    localStorage.setItem("buildsphere_name", user.name);

    window.location.href = "/";
  });
}


const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("signupName");
    const email = document.getElementById("signupEmail");
    const password = document.getElementById("signupPassword");
    const confirmPassword = document.getElementById("confirmPassword");

    const nameError = document.getElementById("signupNameError");
    const emailError = document.getElementById("signupEmailError");
    const passwordError = document.getElementById("signupPasswordError");
    const confirmPasswordError =
      document.getElementById("confirmPasswordError");

    clearError(name, nameError);
    clearError(email, emailError);
    clearError(password, passwordError);
    clearError(confirmPassword, confirmPasswordError);

    let valid = true;
    const cleanEmail = email.value.trim().toLowerCase();

    if (!name.value.trim()) {
      showError(name, nameError, "Please enter your name.");
      valid = false;
    }

    if (!cleanEmail) {
      showError(email, emailError, "Please enter your email.");
      valid = false;
    } else if (!validEmail(cleanEmail)) {
      showError(email, emailError, "Please enter a valid email.");
      valid = false;
    }

    if (!password.value) {
      showError(password, passwordError, "Please create a password.");
      valid = false;
    } else if (password.value.length < 6) {
      showError(
        password,
        passwordError,
        "Password must contain at least 6 characters."
      );
      valid = false;
    }

    if (!confirmPassword.value) {
      showError(
        confirmPassword,
        confirmPasswordError,
        "Please confirm your password."
      );
      valid = false;
    } else if (password.value !== confirmPassword.value) {
      showError(
        confirmPassword,
        confirmPasswordError,
        "Passwords do not match."
      );
      valid = false;
    }

    if (!valid) return;

    const users = getUsers();

    if (users.some((item) => item.email === cleanEmail)) {
      showError(email, emailError, "This email is already registered.");
      return;
    }

    users.push({
      name: name.value.trim(),
      email: cleanEmail,
      password: password.value
    });

    localStorage.setItem("buildsphere_users", JSON.stringify(users));

    alert("Account created! Please log in.");
    window.location.href = "/login.html";
  });
}
