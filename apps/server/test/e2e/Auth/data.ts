export const [email1, email2, email3, email4, email5, email6] = Array.from(
  Array(10).keys(),
).map((value) => `newuser${value + 1}@example.com`);

export const password = "strongPassword123";
