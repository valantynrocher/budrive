import { AppModule } from "@/app.module";
import { AuthErrors, AuthSuccess, AuthToken } from "@budrive/validation";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { App } from "supertest/types";
import { email1, password } from "./data";
import { ErrorResponse } from "./types";

describe("Auth sign-in features (e2e)", () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true, // renvoie une erreur si une propriété non définie est présente
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST to /auth/sign-in", () => {
    const endpoint = "/auth/sign-in";

    describe("Success cases", () => {
      it("→ should sign in with valid credentials", async () => {
        await request(app.getHttpServer())
          .post(endpoint)
          .send({
            email: email1,
            password,
          })
          .expect(201);
      });

      it("→ should return a JWT access token", async () => {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send({
            email: email1,
            password,
          })
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe(AuthSuccess.SIGN_IN);

        // Check of 'set-cookie' headers cookies
        expect(response.headers["set-cookie"]).toEqual([
          expect.stringContaining(AuthToken.ACCESS_TOKEN_COOKIE_NAME),
          expect.stringContaining(AuthToken.REFRESH_TOKEN_COOKIE_NAME),
        ]);
      });

      it("→ should return user info without sensitive fields (e.g. password)", async () => {
        await request(app.getHttpServer())
          .post(endpoint)
          .send({
            email: email1,
            password,
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).not.toHaveProperty("password");
            expect(res.body).not.toHaveProperty("confirmPassword");
          });
      });
    });

    describe("Validation errors", () => {
      describe("email field", () => {
        it("→ should not allow missing email", async () => {
          await request(app.getHttpServer())
            .post(endpoint)
            .send({
              password,
            })
            .expect(400)
            .expect((res) => {
              expect((res.body as ErrorResponse).message).toContain(
                AuthErrors.EMAIL_REQUIRED,
              );
            });
        });

        it("→ should not allow invalid email format", async () => {
          await request(app.getHttpServer())
            .post(endpoint)
            .send({
              email: "testuser@example",
              password,
            })
            .expect(400)
            .expect((res) => {
              expect((res.body as ErrorResponse).message).toContain(
                AuthErrors.EMAIL_INVALID,
              );
            });
        });
      });

      describe("password field", () => {
        it("→ should not allow missing password", async () => {
          await request(app.getHttpServer())
            .post(endpoint)
            .send({
              email: email1,
            })
            .expect(400)
            .expect((res) => {
              expect((res.body as ErrorResponse).message).toContain(
                AuthErrors.PASSWORD_REQUIRED,
              );
            });
        });

        it("→ should not allow to short password (under 8 characters)", async () => {
          await request(app.getHttpServer())
            .post(endpoint)
            .send({
              email: email1,
              password: "123",
              confirmPassword: "123",
            })
            .expect(400)
            .expect((res) => {
              expect((res.body as ErrorResponse).message).toContain(
                AuthErrors.PASSWORD_TOO_SHORT,
              );
            });
        });
      });
    });

    describe("Authentication errors", () => {
      it("→ should not sign in with unregistered email", async () => {
        await request(app.getHttpServer())
          .post(endpoint)
          .send({
            email: "unregistered@example.com",
            password: "unregisteredPassword123",
          })
          .expect(401);
      });

      it("→ should not sign in with wrong password", async () => {
        await request(app.getHttpServer())
          .post(endpoint)
          .send({
            email: email1,
            password: "wrongPassword123",
          })
          .expect(401);
      });

      it("→ should return a generic error message for invalid credentials", async () => {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send({
            email: "unregistered@example.com",
            password: "unregisteredPassword123",
          })
          .expect(401);

        expect((response.body as ErrorResponse).message).toBe(
          AuthErrors.INVALID_CREDENTIALS,
        );
      });
    });

    describe("Security considerations", () => {});
  });
});
