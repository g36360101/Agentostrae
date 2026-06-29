import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/http-exception.filter";
import { readEnvironment } from "./config/env";

const bootstrap = async () => {
  const environment = readEnvironment();
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({ origin: environment.CORS_ORIGIN, credentials: true });
  app.enableShutdownHooks();

  await app.listen(environment.API_PORT, environment.API_HOST);
  Logger.log(
    `API listening on http://${environment.API_HOST}:${environment.API_PORT}`,
    "Bootstrap",
  );
};

void bootstrap();
