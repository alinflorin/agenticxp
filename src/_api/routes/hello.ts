import axios from "axios";
import { FastifyInstance, FastifyPluginAsync } from "fastify";

export const helloRoute: FastifyPluginAsync = (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.get("/api/hello", {preValidation: fastify.authenticate}, async () => {
    const opaTest = await axios.post('http://localhost:8081/v1/data/main/authz', {input: {}});
    console.log(opaTest.data);
    return { message: "Hello from Fastifyxxx!!!" };
  });

  return Promise.resolve();
};

export default helloRoute;
