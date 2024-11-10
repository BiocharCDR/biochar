export const publicPaths = [
  "/",
  "/signin(.*)", // --means any path after signin will be handled by the same component
  "/signup(.*)", // --means any path after signup will be handled by the same component
  "/auth/callback",
];
export const protectedPaths = [
  "/home",
  "/projects",
  "/action-list",
  "/timeline",
  "/ai-copilot",
];
