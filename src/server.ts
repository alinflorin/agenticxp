import Fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { existsSync } from 'fs';
import { stat } from 'fs/promises';
import { helloRoute } from './api/hello';

const fastify = Fastify({
  logger: true,
});

// Register API routes
fastify.register(helloRoute);

// Serve static files from the /dist/client directory
fastify.register(fastifyStatic, {
  root: path.resolve('./dist/client'),
  prefix: '/',
  wildcard: false, // disables directory listing, necessary
});

// Handle SPA routing
fastify.get('/*', async (req, reply) => {
  const indexFilePath = "./dist/client/index.html";
  try {
    // Check if the file exists and is a file
    if (!existsSync(indexFilePath) || !(await stat(indexFilePath)).isFile()) {
      reply.status(404).send('SPA not found');
      return;
    }

    // Send the index.html file
    reply.sendFile('./dist/client/index.html');
  } catch (err) {
    console.error('Error serving index.html:', err);
    reply.status(500).send('Internal Server Error');
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server listening on port 3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();