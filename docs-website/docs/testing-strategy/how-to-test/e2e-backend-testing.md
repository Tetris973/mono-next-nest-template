# E2E Backend Testing

1. **Focus**: End-to-end tests for backend should simulate real-world scenarios and test the entire flow of actions. For example, test creating an account and then logging in with that account.

2. **Happy Path Priority**: Write mostly happy path tests that cover the main user flows and expected behaviors of the system.

3. **Integration Verification**: Verify aspects of the code that can't be tested in unit tests, such as:
   - Protection of endpoints by authentication (guards)
   - Correct HTTP status codes
   - Proper handling of complex permissions

4. **Real Database Usage**: Always use a real database with data inside for these tests. This data can be fake or seeded, but should represent realistic scenarios.

5. **Data Shape**: While the exact shape of the data should have been verified in unit tests, E2E tests should still ensure that the overall structure and content of the responses are correct.

6. **Full App Testing**: Run these tests with the whole application running to ensure all components, including middleware, guards, and interceptors, are functioning correctly in tandem.

Remember: The goal of E2E backend testing is to verify that all components of the application work together correctly from the perspective of the API consumer.