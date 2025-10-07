import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import * as fs from "fs";
import * as path from "path";

async function bootstrap() {
  const rootDir = path.resolve(__dirname, "../../..");
  const certsDir = path.join(rootDir, "certs");

  const httpsOptions = {
    key: fs.readFileSync(path.join(certsDir, "localhost-key.pem")),
    cert: fs.readFileSync(path.join(certsDir, "localhost.pem")),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
    cors: {
      origin: "https://localhost:3000",
      credentials: true,
    },
  });

  // L'origine de votre client Next.js en développement
  const clientOrigin = process.env.CLIENT_ORIGIN!;

  app.enableCors({
    origin: clientOrigin,
    // IMPORTANT : Autoriser les cookies
    credentials: true,
    // Autoriser les méthodes HTTP que vous utilisez
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    // Autoriser les headers spécifiques si vous en utilisez, sinon laissez par défaut
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, // renvoie une erreur si une propriété non définie est présente
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
