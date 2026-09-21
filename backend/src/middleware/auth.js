import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  const authorization = req.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;
  if (!token)
    return res.status(401).json({ message: "Authentication required" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "admin")
      return res.status(403).json({ message: "Admin access required" });
    req.admin = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
