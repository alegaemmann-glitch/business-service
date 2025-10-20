import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "LOGIN_KEY"); // Replace LOGIN_KEY with your secret
    req.user = decoded; // decoded should include `id`
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
