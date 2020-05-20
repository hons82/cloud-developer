import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import * as uuid from 'uuid';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import { createLogger } from '../../utils/logger';
import { setAttachmentUrl } from '../../businessLogic/todos';

const XAWS = AWSXRay.captureAWS(AWS);

let options: AWS.S3.Types.ClientConfiguration = {
  signatureVersion: 'v4',
};
if (process.env.IS_OFFLINE) {
  options = {
      ...options,
      endpoint: 'localhost:8001',
  };
}

const s3 = new XAWS.S3(options);
const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);

const logger = createLogger('generateUploadUrlHandler');

export const generateUploadUrlHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Generate upload url', event);
  const todoId = event.pathParameters.todoId
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];

  const imageId = uuid.v4();

  setAttachmentUrl(todoId, `https://${bucketName}.s3.amazonaws.com/${imageId}`, jwtToken);

  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: urlExpiration,
  });

  return {
    statusCode: 201,
    body: JSON.stringify({
      uploadUrl,
    }),
  };
}

export const handler = middy(generateUploadUrlHandler).use(cors({ credentials: true }));