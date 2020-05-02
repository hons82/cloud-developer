import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

const HttpStatus = require('http-status-codes');
const isImageUrl = require('is-image-url');

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get("/filteredimage/", async (req, res) => {
    const image_url = req.query.image_url as string;

    // Check if the image url is present in the request
    if (!image_url) {
      res.sendStatus(HttpStatus.BAD_REQUEST).send(`image_url query parameter missing`);
    }

    if (!isImageUrl(image_url)) {
      res.sendStatus(HttpStatus.UNPROCESSABLE_ENTITY).send(`${image_url} is not an image`);
    }

    try {
      const filteredpath = await filterImageFromURL(image_url);
      res.sendFile(filteredpath, () => deleteLocalFiles([filteredpath]));
    } catch(error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error, message: 'Oh no...' });
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();