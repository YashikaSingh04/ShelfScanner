const jwksClient = require("jwks-rsa");
const jwt        = require("jsonwebtoken");

const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// ── Verify Cognito JWT token ─────────────────────────────────
async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err.message);
        return res.status(401).json({ error: "Invalid token" });
      }

      // Attach user info to request
      req.user = {
        userId: decoded.sub,
        email:  decoded.email,
      };

      next();
    });

  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Authentication error" });
  }
}

module.exports = { verifyToken };