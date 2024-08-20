# Repository Testing

1. **Integration Tests**: Repository tests should be integration or E2E tests, not unit tests, as they interact with the database.

2. **Avoid Mocking Database**: Don't mock the database in repository tests, as this would recreate database behavior, which can be counterproductive and may become out of sync with actual database behavior.