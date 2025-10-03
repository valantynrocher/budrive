import { AppModule } from "@/app.module";
import { SignUpDto, AuthErrors } from "@budrive/validation";
import { MailService } from "@/mail/mail.service";
import { PrismaService } from "@/prisma/prisma.service";
import {
  ConflictException,
  INestApplication,
  ValidationPipe,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { App } from "supertest/types";
import { ErrorResponse } from "test/types/error-response";

describe("Auth features (e2e)", () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let mailService: MailService;

  const [email1, email2, email3, email4, email5, email6] = Array.from(
    Array(10).keys(),
  ).map((value) => `newuser${value + 1}@example.com`);

  const password = "strongPassword123";

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

    prisma = app.get(PrismaService);
    mailService = app.get(MailService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST to /auth/sign-up", () => {
    const endpoint = "/auth/sign-up";

    describe("Success cases", () => {
      it("→ should create a new user with valid credentials", async () => {
        await request(app.getHttpServer())
          .post(endpoint)
          .send({
            email: email1,
            password,
            confirmPassword: password,
          })
          .expect(201)
          .expect((res) => {
            expect((res.body as SignUpDto).email).toBe(email1);
          });
      });

      it("→ should hash the password in database after sign-up", async () => {
        await request(app.getHttpServer())
          .post(endpoint)
          .send({ email: email2, password, confirmPassword: password })
          .expect(201);

        const user = await prisma.user.findUnique({ where: { email: email2 } });

        expect(user).toBeDefined();
        expect(user!.passwordHash).not.toBe(password);
        expect(user!.passwordHash).toMatch(/^\$2[aby]\$/);
      });

      it("→ should return the created user without sensitive fields (e.g. password)", async () => {
        await request(app.getHttpServer())
          .post(endpoint)
          .send({
            email: email3,
            password,
            confirmPassword: password,
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).not.toHaveProperty("password");
            expect(res.body).not.toHaveProperty("confirmPassword");
          });
      });

      it("should send a confirmation email after signup", async () => {
        const spy = jest.spyOn(mailService, "sendEmailConfirmation");

        await request(app.getHttpServer())
          .post(endpoint)
          .send({
            email: email4,
            password,
            confirmPassword: password,
          })
          .expect(201);

        expect(spy).toHaveBeenCalledWith(
          email4,
          expect.any(String), // le token
        );
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
              email: email4,
            })
            .expect(400)
            .expect((res) => {
              expect((res.body as ErrorResponse).message).toContain(
                AuthErrors.PASSWORD_REQUIRED,
              );
            });
        });

        it("→ should not allow password that not match with confirmPassword", async () => {
          await request(app.getHttpServer())
            .post(endpoint)
            .send({
              email: email5,
              password,
              confirmPassword: "strongPassword",
            })
            .expect(400)
            .expect((res) => {
              expect((res.body as ErrorResponse).message).toContain(
                AuthErrors.CONFIRM_PASSWORD_NOT_MATCH,
              );
            });
        });

        it("→ should not allow to short password (under 8 characters)", async () => {
          await request(app.getHttpServer())
            .post(endpoint)
            .send({
              email: email6,
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

    describe("Conflict errors", () => {
      it("→ should not allow duplicate email", async () => {
        await request(app.getHttpServer())
          .post(endpoint)
          .send({
            email: email1,
            password,
            confirmPassword: password,
          })
          .expect(409);
      });

      it("→ should return the correct error message on duplicate email", async () => {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send({
            email: email1,
            password,
            confirmPassword: password,
          });

        expect((response.body as ConflictException).message).toBe(
          AuthErrors.EMAIL_ALREADY_EXISTS,
        );
      });
    });

    describe("Security considerations", () => {
      //  TODO, but not yet
    });
  });

  describe("POST /auth/confirm", () => {
    const endpoint = "/auth/confirm";

    describe("Success cases", () => {
      it("→ should confirm the user and return a JWT when token is valid", async () => {
        const userToVerify = await prisma.user.findUnique({
          where: { email: email1 },
        });

        if (!userToVerify) {
          fail("userToVerify has not been found in the database");
        }

        const tokenRecord = await prisma.emailVerificationToken.findFirst({
          where: { userId: userToVerify.id },
        });

        if (!tokenRecord) {
          fail("tokenRecord for the user has not been found in the database");
        }

        const confirmRes = await request(app.getHttpServer())
          .post(endpoint)
          .send({ token: tokenRecord.token })
          .expect(201);

        expect(confirmRes.body).toHaveProperty("accessToken");

        // 4. vérifier que user est bien isVerified en DB
        const user = await prisma.user.findUnique({
          where: { id: userToVerify.id },
        });
        expect(user?.isVerified).toBe(true);
      });
    });

    describe("Error cases", () => {
      it("→ should fail if token is invalid", async () => {
        const res = await request(app.getHttpServer())
          .post("/auth/confirm")
          .send({ token: "not-a-real-token" })
          .expect(400);

        expect((res.body as ErrorResponse).message).toMatch(
          AuthErrors.TOKEN_INVALID_EXPIRED,
        );
      });

      it("→ should fail if token is expired", async () => {
        const userToVerify = await prisma.user.findUnique({
          where: {
            email: email2,
          },
        });

        if (!userToVerify) {
          fail("userToVerify has not been found in the database");
        }

        // 2. récup token généré en DB
        const expiredTokenRecord = await prisma.emailVerificationToken.update({
          where: { userId: userToVerify.id },
          data: {
            expiresAt: new Date(Date.now() - 1000),
          },
        });

        const res = await request(app.getHttpServer())
          .post("/auth/confirm")
          .send({ token: expiredTokenRecord.token })
          .expect(400);

        expect((res.body as ErrorResponse).message).toMatch(
          AuthErrors.TOKEN_INVALID_EXPIRED,
        );
      });
    });
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

        expect(response.body).toHaveProperty("accessToken");
        const token = (response.body as { accessToken: string })
          .accessToken as unknown;
        expect(typeof token).toBe("string");
        expect((token as string).split(".")).toHaveLength(3);
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
