import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";
const client = jwksClient({
    jwksUri: `https://fitting-seagull-75.clerk.accounts.dev/.well-known/jwks.json`,
});

function getKey(header: any, callback: any) {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) return callback(err, null);
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    });
  }

  export async function verifyToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
        if (err) {
          reject("Invalid token");
        } else {
          resolve(decoded); // Contains userId, email, etc.
        }
      });
    });
  }