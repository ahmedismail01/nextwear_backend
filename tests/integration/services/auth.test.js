const authService = require("../../../src/services/authService");
const dummyUser = {
  email: "ahmed@test.com",
  password: "12345678",
  firstName: "Ahmed",
  lastName: "Ali",
  phoneNumber: "1234567890",
};

test("authService should be defined", () => {
  expect(authService).toBeDefined();
});

describe("authService", () => {
  user = null;

  it("must be defined", () => {
    expect(authService).toBeDefined();
  });

  it("should create new user", async () => {
    user = await authService.register(dummyUser);
    expect(user).toHaveProperty("email", dummyUser.email);
    expect(user).toHaveProperty("firstName", dummyUser.firstName);
    expect(user).toHaveProperty("lastName", dummyUser.lastName);
    expect(user).toHaveProperty("phoneNumber", dummyUser.phoneNumber);
    expect(user).not.toHaveProperty("password");
  });

  it("should not create user with existing email", async () => {
    await expect(authService.register(dummyUser)).rejects.toThrow(
      "User already exists",
    );
  });

  it("should login user", async () => {
    const loggedInUser = await authService.login(
      dummyUser.email,
      dummyUser.password,
    );
    expect(loggedInUser).toHaveProperty("email", dummyUser.email);
    expect(loggedInUser).toHaveProperty("firstName", dummyUser.firstName);
    expect(loggedInUser).toHaveProperty("lastName", dummyUser.lastName);
    expect(loggedInUser).toHaveProperty("phoneNumber", dummyUser.phoneNumber);
    expect(loggedInUser).not.toHaveProperty("password");
  });
  it("should not login with wrong password", async () => {
    await expect(
      authService.login(dummyUser.email, "wrongpassword"),
    ).rejects.toThrow("Invalid credentials");
  });

  it("should not login with non-existing email", async () => {
    await expect(
      authService.login("nonexistent@test.com", dummyUser.password),
    ).rejects.toThrow("Invalid credentials");
  });

  it("should create token and verify it", async () => {
    const token = await authService.generateToken({ userId: String(user.id) });
    expect(token).toBeDefined();

    const decoded = await authService.verifyToken(token);
    expect(decoded).toHaveProperty("userId", String(user.id));
  });

  it("should not verify invalid token", async () => {
    await expect(authService.verifyToken("invalidtoken")).rejects.toThrow(
      "Invalid token",
    );
  });
});
