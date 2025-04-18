/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/hello.ts
export async function helloRoute(fastify: any) {
    fastify.get('/api/hello', async () => {
      return { message: 'Hello from Fastify!!!' };
    });
  }