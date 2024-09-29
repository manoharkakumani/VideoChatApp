import React, { useState } from "react";
import { signUp } from "../api/api";

const SignUp = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    let valid = true;
    if (!name) {
      setNameError(true);
      valid = false;
    }
    if (!email) {
      setEmailError(true);
      valid = false;
    }
    if (!password) {
      setPasswordError(true);
      valid = false;
    }
    if (!confirmPassword) {
      setConfirmPasswordError(true);
      valid = false;
    } else if (password !== confirmPassword) {
      setError("Passwords do not match");
      valid = false;
    }
    return valid;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await signUp({ name, email, password });
      if (response.status === 201) {
        setSuccess("User signed up successfully. You can now sign in.");
      } else {
        setError("Failed to sign up. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong with the server.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              className={`w-full p-3 border rounded ${
                nameError ? "border-red-500" : ""
              }`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(false);
              }}
              placeholder="Enter your name"
            />
            {nameError && <p className="text-red-500">Name is required</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className={`w-full p-3 border rounded ${
                emailError ? "border-red-500" : ""
              }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
              }}
              placeholder="Enter your email"
            />
            {emailError && <p className="text-red-500">Email is required</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className={`w-full p-3 border rounded ${
                passwordError ? "border-red-500" : ""
              }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              placeholder="Enter your password"
            />
            {passwordError && (
              <p className="text-red-500">Password is required</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              className={`w-full p-3 border rounded ${
                confirmPasswordError ? "border-red-500" : ""
              }`}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordError(false);
                setError("");
              }}
              placeholder="Confirm your password"
            />
            {confirmPasswordError && (
              <p className="text-red-500">Confirm password is required</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
