
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJeG8uzBmOfFCQMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1ncTk2b2RsZi5ldS5hdXRoMC5jb20wHhcNMjAwNTE3MTkyNTE0WhcN
MzQwMTI0MTkyNTE0WjAkMSIwIAYDVQQDExlkZXYtZ3E5Nm9kbGYuZXUuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq8YxAQrBRhuK+2Zy
CO6h0apBcBJSsVhsTJ1WGaCzCnk92qczq22QBB4HWSV47sng1kXnlY2v03nS7Wl1
f79inZbOTNFe4i1HXn4BP4ggDFoRJcoN7j04yUn3KsDwXTuafLKoEqAUYk9DwBdN
q9pimlSqGr7AALv5EYYlpSRjTcroxcLd8ZLYASWHOXUs7ZYKJn28gA9ICyZ+t7C3
Mg7VXLWUNqgt60hsiZCOoGCFV1YQoO4G5vWaODMKnCXRmFnv+A9InfDoaDID+UXX
T9s+vXx2DaozDMQJ/EcqZOqyAIZGKgWVqrtXnEI298ha40oKyB44Ni5X2SyUt+cf
HRnuPQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQ4YLy6qEbz
6LGMbW4myBB/e3FOwzAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AGHaUnOHSX3LfZa58FF8tIHQwaqCb/exmQMOIbKL3rGbMB0wNUByhUFwd3kO7c9o
VAw72amaqa8sWILvNJeGvtCaObPpFyvuTYaxURm2hNNZQIbCBrsdjsCbCuxoS115
N1jNJVigTOCt+kFxQsQwTUxIcISoRoGkTimb4i9fdFPj5OVakpgZhY1NF+QbLURl
GUth+LtFfa96lXDBDv8YVk6Y58O/Sy+6llZu5LweSDr0ET9RJ4/sFByWBDbK0Vqr
+p1bML7pZFIhsgUguQSwkyy04DpwChVFpcxsS2p1fS0cdnd17jihEJhp9trcg3tr
KFk/I+fR2YAYIc9SL4ibPto=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}
