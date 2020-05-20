import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'
import { Jwt } from './Jwt';

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}


export function findSigningKeys(keys){
  return keys
        .filter(key => key.use === 'sig' // JWK property `use` determines the JWK is for signing
                    && key.kty === 'RSA' // We are only supporting RSA (RS256)
                    && key.kid           // The `kid` must be present to be useful for later
                    && ((key.x5c && key.x5c.length) || (key.n && key.e)) // Has useful public keys
        ).map(key => {
          return { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0])};
        });
}

export function getCertificate(keys, jwt: Jwt){
  const signingKey = keys.find(key => key.kid === jwt.header.kid);
  console.log('signing key ', signingKey);
  return signingKey.publicKey;
}

/**
 * If you wanted to use `n` and `e` from JWKS check out node-jwks-rsa's implementation:
 * https://github.com/auth0/node-jwks-rsa/blob/master/src/utils.js#L35-L57
 */

export function certToPEM(cert) {
  cert = cert.match(/.{1,64}/g).join('\n');
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
  return cert;
}