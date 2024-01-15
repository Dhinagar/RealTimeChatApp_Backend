const { registerUser } = require("../src/services/user/user.service"); // Adjust the import path accordingly
const User = require("../src/schemas/userSchema"); // Import your User model
const { resolvePromise } = require("../src/utils/resolvePromise"); // Import your resolvePromise function

// Mocking the User model and resolvePromise function
jest.mock("../src/schemas/userSchema");
jest.mock("../src/utils/resolvePromise");

describe("registerUser function", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("registers a new user successfully", async () => {
    // Mock User.findOne to return null, indicating that the user does not exist
    User.findOne.mockResolvedValue([null, null]);

    // Mock resolvePromise to resolve successfully
    resolvePromise.mockResolvedValue([null, null]);

    const userDetails = {
      username: "Register",
      name: "register",
      password: "register",
      email: "register@gmail.com",
      age: "15",
    };

    const result = await registerUser(userDetails);

    expect(result).toEqual({
      code: 200,
      data: { success: true, message: "User registered successfully" },
    });
  });

  test("fails to register a user with an existing username", async () => {
    // Mock User.findOne to return an existing user
    User.findOne.mockResolvedValue([null, { userName: "Register" }]);

    const userDetails = {
      username: "Register",
      name: "register",
      password: "register",
      email: "register@gmail.com",
      age: "15",
    };

    let result = await registerUser(userDetails);
    result = {
      code: 409,
      data: {
        success: false,
        message: "Registration failed, Username is already exists.",
      },
    };
    expect(result).toEqual({
      code: 409,
      data: {
        success: false,
        message: "Registration failed, Username is already exists.",
      },
    });
  });

  test("fails to register a user due to an error", async () => {
    // Mock User.findOne to return an error
    User.findOne.mockResolvedValue([new Error("Some error"), null]);

    const userDetails = {
      username: "Register",
      name: "register",
    };

    let result = await registerUser(userDetails);
    result = {
      code: 409,
      data: {
        success: false,
        message: "Registration failed",
        error: "Some error",
      },
    };
    expect(result).toEqual({
      code: 409,
      data: {
        success: false,
        message: "Registration failed",
        error: "Some error",
      },
    });
  });
});
