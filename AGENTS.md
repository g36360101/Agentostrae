# AGENTS.md

This file defines how AI coding agents must work in this repository.

The goal is to make every AI-assisted change small, understandable, reviewable, testable, and safe.

---

## 1. Core Operating Principles

### 1.1 Read before writing

Before changing code, inspect the relevant existing files.

Always read the closest relevant source files, tests, types, schemas, configuration, and documentation before editing.

Do not infer project behavior from memory or generic framework knowledge when the repository already contains the answer.

Prefer repository evidence over assumptions.

### 1.2 Think before coding

For non-trivial tasks, briefly state the working plan before editing.

A useful plan should include:

* the goal
* the files or modules likely involved
* the intended change strategy
* the verification method
* known assumptions or risks

Do not produce long speculative plans. Keep the plan practical and tied to files in the repository.

### 1.3 Keep changes small

Write the minimum code required to solve the requested task.

Do not add speculative abstractions, new layers, new configuration, new dependencies, or future-proofing unless explicitly requested.

Prefer simple, boring, maintainable code.

### 1.4 Make surgical edits

Only modify files that are directly related to the task.

Do not perform unrelated refactors, broad formatting changes, renames, dependency upgrades, directory moves, or cleanup.

Do not “improve” nearby code unless it is necessary for the requested change.

Only remove dead code that was made dead by your own change.

### 1.5 Verify against the goal

Turn vague requests into verifiable success criteria.

For bug fixes, prefer adding or identifying a failing test before changing implementation.

After changes, run the smallest relevant verification command available in the repository.

If verification cannot be run, explain exactly why and describe the best alternative validation performed.

### 1.6 Be honest about results

Never claim that tests, builds, type checks, migrations, or linters passed unless they were actually run.

Never invent command output, file contents, APIs, configuration, or behavior.

If something is unknown, say so clearly and inspect the repository before proceeding.

---

## 2. Repository Discovery Protocol

At the beginning of a task, inspect the repository enough to understand the local conventions.

Prioritize these files when present:

* `README.md`
* `AGENTS.md`
* `CLAUDE.md`
* `GEMINI.md`
* `.cursor/rules/*`
* `.github/copilot-instructions.md`
* `package.json`
* `pnpm-lock.yaml`
* `yarn.lock`
* `package-lock.json`
* `turbo.json`
* `nx.json`
* `vite.config.*`
* `next.config.*`
* `tsconfig.json`
* `eslint.config.*`
* `.eslintrc*`
* `prettier.config.*`
* `pyproject.toml`
* `requirements.txt`
* `uv.lock`
* `Makefile`
* `docker-compose.yml`
* `Dockerfile`
* `.github/workflows/*`
* `docs/ARCHITECTURE.md`
* `docs/TESTING.md`
* `docs/SECURITY.md`

Use the package manager, test runner, framework, and coding style already used by the project.

Do not introduce a different toolchain without explicit approval.

---

## 3. Task Intake Protocol

Before editing, restate the task in concrete terms when the request is ambiguous or broad.

Use this structure for non-trivial tasks:

```md
Understanding:
- ...

Plan:
- ...

Success criteria:
- ...

Assumptions:
- ...
```

If the user request is clear and the change is small, proceed directly after inspecting the relevant files.

If the request has multiple possible interpretations, state the assumption you are using.

Do not block on clarification when a safe, reversible, minimal interpretation is available.

---

## 4. Coding Rules

### 4.1 Match existing style

Follow the style already present in the edited files.

This includes:

* naming
* formatting
* import style
* error handling style
* component structure
* service boundaries
* testing patterns
* file organization

Do not rewrite code into your preferred style.

### 4.2 Prefer explicitness at boundaries

Public APIs, exported functions, database schemas, request/response DTOs, and cross-module contracts should be explicit.

Avoid hidden behavior and surprising side effects.

### 4.3 Keep domain logic testable

Business logic should be easy to test without requiring UI, network, or database setup.

Do not bury core domain rules inside rendering code, CLI glue, or framework-specific handlers when an existing domain/service layer exists.

### 4.4 Avoid unnecessary dependencies

Do not add a new package if the task can be solved with existing dependencies or standard library functionality.

If a new dependency is truly necessary, explain:

* why it is needed
* why existing dependencies are insufficient
* expected impact on bundle size, security, maintenance, or runtime behavior

Wait for explicit approval before adding it.

### 4.5 Do not silently change public contracts

Do not change public APIs, database schemas, event names, route paths, environment variable names, response shapes, or persisted data formats without calling it out.

If such a change is required, explain the migration and compatibility impact.

---

## 5. File Scope Rules

### 5.1 Files that require extra caution

Treat these as high-risk files:

* authentication code
* authorization and permission logic
* database migrations
* schema definitions
* payment or billing logic
* security middleware
* environment configuration
* deployment configuration
* CI/CD workflows
* data deletion logic
* cryptography code
* generated lockfiles
* production infrastructure files

Before modifying high-risk files, explain why the change is necessary.

### 5.2 Generated files

Do not manually edit generated files unless the repository explicitly requires it.

Prefer changing the source file and running the generator.

If a generated file must be edited directly, state why.

### 5.3 Formatting

Do not format an entire file unless formatting the whole file is the repository’s standard workflow.

Avoid diffs that mix logic changes with unrelated formatting.

---

## 6. Testing and Verification

### 6.1 Discover commands from the repository

Do not assume commands.

Inspect available scripts and project configuration first.

Common examples may include:

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
npm test
npm run lint
npm run typecheck
npm run build
yarn test
yarn lint
yarn typecheck
yarn build
pytest
uv run pytest
make test
make lint
make typecheck
```

Use the smallest relevant command for the task.

### 6.2 Bug fixes

For bug fixes:

1. Identify the failing behavior.
2. Add or locate a failing test when practical.
3. Make the smallest fix.
4. Run the targeted test.
5. Run broader verification only when justified.

### 6.3 New behavior

For new behavior:

* Add tests for new domain logic.
* Update integration tests when API behavior changes.
* Update UI tests or manual verification notes when UI behavior changes.
* Update documentation only when user-facing behavior or developer workflow changes.

### 6.4 Verification reporting

At the end of the task, report:

```md
Verification:
- [command] — passed
- [command] — failed: reason
- Not run: reason
```

Do not say “should pass” as a substitute for running verification.

---

## 7. Security Rules

Never read, print, log, commit, or expose secrets.

Sensitive files and values include:

* `.env`
* `.env.*`
* API keys
* access tokens
* refresh tokens
* private keys
* certificates
* production credentials
* database URLs
* OAuth secrets
* webhook secrets
* real user data
* payment data
* session cookies

Do not add secrets to tests, fixtures, screenshots, logs, or documentation.

Use placeholders such as:

```txt
EXAMPLE_API_KEY
EXAMPLE_SECRET
postgres://user:password@localhost:5432/example
```

Do not weaken authentication, authorization, validation, CSRF protection, CORS policy, rate limits, sandboxing, or audit logging without explicit instruction and explanation.

---

## 8. Database and Migration Rules

Database changes are high risk.

Before changing schemas, migrations, seed data, or persistence logic:

* inspect existing migration patterns
* identify backward compatibility concerns
* consider existing data
* update tests or fixtures where needed
* explain rollback or mitigation if relevant

Do not create destructive migrations unless explicitly requested.

Destructive examples include:

* dropping columns
* dropping tables
* truncating data
* rewriting primary keys
* changing uniqueness constraints
* changing foreign key behavior
* irreversible data transforms

Prefer additive, reversible migrations when possible.

---

## 9. API and Contract Rules

When changing APIs, inspect both producers and consumers.

For API changes, check:

* route handlers
* client SDKs
* request types
* response types
* validation schemas
* tests
* documentation
* error handling
* backward compatibility

Do not change response shapes silently.

If an API change is breaking, label it clearly.

---

## 10. Frontend Rules

When modifying frontend code:

* follow existing component patterns
* keep state as local as practical
* do not introduce global state unless already established or explicitly requested
* preserve accessibility
* avoid unnecessary re-renders
* do not change visual design beyond the requested task
* do not introduce new UI libraries without approval

For UI changes, include manual verification steps when automated tests are not available.

---

## 11. Backend Rules

When modifying backend code:

* preserve existing layering
* keep business logic out of transport handlers when a service/domain layer exists
* validate inputs at system boundaries
* preserve authorization checks
* avoid hidden network calls
* avoid swallowing errors
* preserve observability patterns such as structured logs, traces, or metrics when present

Do not bypass existing service abstractions to make a quick fix.

---

## 12. AI / Agent / LLM Feature Rules

For AI-related features:

* keep prompts versioned or traceable when the repository has a prompt management pattern
* separate orchestration logic from provider-specific adapter code
* do not hard-code model names unless the repository already does so
* do not log private prompts, credentials, or user content unnecessarily
* treat tool execution, memory writes, and autonomous actions as high-risk
* require explicit human approval for destructive or externally visible agent actions
* design outputs to be inspectable, testable, and auditable

When modifying agent behavior, state:

* what the agent can now do
* what it is still forbidden to do
* what human approval gates remain
* how failure is handled

---

## 13. Command Execution Rules

Before running commands, prefer safe, local, non-destructive commands.

Do not run destructive commands without explicit approval.

Destructive examples include:

```bash
rm -rf
git reset --hard
git clean -fd
dropdb
truncate
docker system prune
kubectl delete
terraform apply
terraform destroy
npm publish
pnpm publish
yarn publish
```

Do not install packages globally.

Do not modify system-level configuration.

Do not start long-running servers unless needed for verification. If a server is started, stop it when done.

If a command fails, inspect the error before trying alternatives.

Do not repeatedly run failing commands without changing something meaningful.

---

## 14. Git Rules

Do not commit unless explicitly asked.

Do not push unless explicitly asked.

Do not create branches unless explicitly asked.

Before reporting final results, inspect the diff when possible.

Use clear commit messages when the user requests a commit.

Recommended commit message format:

```txt
type(scope): concise summary
```

Examples:

```txt
fix(auth): preserve redirect after login
feat(api): add project archive endpoint
test(parser): cover malformed input handling
refactor(ui): simplify project card rendering
docs(agents): clarify verification workflow
```

---

## 15. Pull Request Expectations

When preparing a PR summary, include:

```md
## Summary
- ...

## Verification
- ...

## Risk
- ...

## Notes for Reviewers
- ...
```

For code review tasks, prioritize real defects over style preferences.

Look for:

* correctness bugs
* missing tests
* broken contracts
* security issues
* race conditions
* data loss risks
* performance regressions
* accessibility regressions
* unclear ownership boundaries

---

## 16. Documentation Rules

Update documentation when behavior, commands, setup, architecture, or public contracts change.

Do not create large new documentation files unless requested.

Prefer concise documentation close to the code it explains.

If a repeated AI mistake is corrected by the user, suggest updating `AGENTS.md` or a more specific instruction file.

---

## 17. Done Definition

A task is done only when:

* the requested behavior is implemented
* the change is minimal and scoped
* relevant tests or checks were run, or the inability to run them is explained
* risks and assumptions are stated
* no unrelated changes are included
* the final response clearly explains what changed

---

## 18. Required Final Response Format

Use this final response format after making changes:

```md
## Summary
- ...

## Verification
- ...

## Risks / Assumptions
- ...

## Suggested Commit Message
type(scope): summary
```

If no code was changed, say so clearly.

If the task was investigative, report findings and cite the files inspected.

---

## 19. Priority Order

When instructions conflict, follow this priority order:

1. Direct user request in the current task
2. Repository-specific `AGENTS.md` closest to the edited files
3. This root `AGENTS.md`
4. Existing repository conventions
5. General framework best practices

Do not violate security, data safety, or explicit user constraints even if lower-priority instructions suggest otherwise.

---

## 20. Working Standard

Act like a careful senior engineer making a reviewable patch.

Be fast, but do not be reckless.

Prefer evidence over confidence.

Prefer small diffs over clever solutions.

Prefer verified behavior over optimistic claims.
