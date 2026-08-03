# Study Tasks — Local-First Todo Application


## Running It

### Environment

- Node.js v22.19.0
- npm v10.9.3

Node 22 or later is required. The version matters: `better-sqlite3` is pinned
to v11 because it ships prebuilt binaries for Node 22, so no C++ compiler or
build tools are needed.

### Install

```bash
git clone https://github.com/KeamogetsweModiakgotla/Lab1-SDP.git
cd Lab1-SDP
npm install
```

### Run

```bash
npm run dev
```

Then open http://localhost:3000

The database file `tasks.db` is created automatically in the project root on
first run, with an empty task list. It is not committed to the repository, so
a clean clone starts with no tasks.

### Test

```bash
npm test
```

Runs seven tests via Node's built-in test runner. They execute against a
throwaway database (`test-tasks.db`) selected through the `TASKS_DB`
environment variable, which is created and deleted per run — your own
`tasks.db` is never touched.

---

