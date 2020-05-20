// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'b9deznifob'
const region = 'eu-central-1'
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-gq96odlf.eu.auth0.com',                   // Auth0 domain
  clientId: 'C6E1tKV8841zNBzyvzh2YZIlnxVeFqtO',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}