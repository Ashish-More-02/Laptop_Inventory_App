// Shared, pure validation helpers.
// Each returns an error message string, or "" when the value is valid.

export function validateEmail(email) {
  const emailRegex = /^\S+@\S+\.\S{2,3}$/;

  if (!emailRegex.test(email)) {
    return "Invalid email, please try again";
  }
  return "";
}

export function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

  if (!passwordRegex.test(password)) {
    return "Invalid password, a password should have at least 6 characters, 1 uppercase, 1 lowercase, 1 special char and 1 number";
  }
  return "";
}
