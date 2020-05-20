import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import { getAllTodos } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';

const logger = createLogger('getTodosHandler');

export const getTodosHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Get todos', event);
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];

  const todos = await getAllTodos(jwtToken);

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: todos,
    }),
  };
};

export const handler = middy(getTodosHandler).use(cors({ credentials: true }));
