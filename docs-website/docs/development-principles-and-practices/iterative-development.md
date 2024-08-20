# Iterative Development

Use iterative approach to development, which allows to continuously improve the codebase and adapt to changing requirements.

### Guidelines:

1. **Code Multiple Drafts**: 
   - Don't overthink your initial code. (Note: This doesn't mean intentionally writing poor code; if your natural coding style is already good, that's even better.)
   - Write quick code to make it work, don't focus on tests or architecture initially.
   - By doing this, you'll gain an overview of what's needed, dependencies, and potential obstacles.


2. **Refinement Process**:
   - After the initial draft, create a better version.
   - You can either remake the code from scratch or refine what you've already coded.
   - Points to verify:
     - Are variables understandable? Have you avoided magic numbers/values?
     - Are there too many nested blocks?
     - Does the code have too much responsibility? Consider separating into multiple methods or files (but be cautious of premature abstraction).
     - Is the code easily testable? Even if you won't be writing tests immediately, consider how the code could be tested. This often leads to better architecture and design.
       
       > Note: Not every method needs to be tested, and project resources may not always allow for comprehensive testing. However, thinking about testability often results in better architecture. Be mindful that some areas, like frequently changing component designs, may not benefit from extensive testing. The goal is to structure your code in a way that would make testing straightforward if needed in the future.

     - See the [Code Review Process](/docs/collaboration/code-review-process) for exaustive guidelines.
