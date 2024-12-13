function togglePassword() {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.querySelector(".signup-toggle-password i");
    if(passwordInput.type === "password"){
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } 
    else{
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}
function toggleConfirmPassword() {
    const passwordInput = document.getElementById("confirmPassword");
    const toggleIcon = document.querySelector(".signup-toggle-confirmPassword i");
    if(passwordInput.type === "password"){
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } 
    else{
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}

document.getElementById('signup-toggle-password').addEventListener('click', togglePassword);
document.getElementById('signup-toggle-confirmPassword').addEventListener('click', toggleConfirmPassword);