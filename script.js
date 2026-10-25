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

        if (email.value.trim() === "") {
            showError(email, emailError, "Please enter your email.");
            valid = false;
        } else if (!validEmail(email.value.trim())) {
            showError(email, emailError, "Please enter a valid email.");
            valid = false;
        }

        if (password.value.trim() === "") {
            showError(password, passwordError, "Please enter your password.");
            valid = false;
        } else if (password.value.length < 6) {
            showError(password, passwordError, "Password must contain at least 6 characters.");
            valid = false;
        }

        if (valid) {
            alert("Login successful!");
            loginForm.reset();
        }
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
        const confirmPasswordError = document.getElementById("confirmPasswordError");

        clearError(name, nameError);
        clearError(email, emailError);
        clearError(password, passwordError);
        clearError(confirmPassword, confirmPasswordError);

        let valid = true;

        if (name.value.trim() === "") {
            showError(name, nameError, "Please enter your name.");
            valid = false;
        }

        if (email.value.trim() === "") {
            showError(email, emailError, "Please enter your email.");
            valid = false;
        } else if (!validEmail(email.value.trim())) {
            showError(email, emailError, "Please enter a valid email.");
            valid = false;
        }

        if (password.value === "") {
            showError(password, passwordError, "Please create a password.");
            valid = false;
        } else if (password.length < 6) {
            showError(password, passwordError, "Password must contain at least 6 characters.");
            valid = false;
        }

        if (confirmPassword.value === "") {
            showError(confirmPassword, confirmPasswordError, "Please confirm your password.");
            valid = false;
        } else if (password.value !== confirmPassword.value) {
            showError(confirmPassword, confirmPasswordError, "Passwords do not match.");
            valid = false;
        }

        if (valid) {
            alert("Account created successfully!");
            signupForm.reset();
        }
    });
}
