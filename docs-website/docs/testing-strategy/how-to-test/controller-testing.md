### Controller Testing

1. **Focus**: Unit tests for controllers should focus on the content of the method, such as verifying the correct type of DTO returned and exceptions thrown.

2. **Limitations**: Controller unit tests can't test behavior of decorators and guards (e.g., permissions, public/protected routes, HTTP codes).

3. **Complex Permissions**: Test complex permissions that can't be defined with the permission decorator (e.g., when a user can access their own resource but not others').