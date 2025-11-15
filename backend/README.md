# Backend

## Setup

Setup .env file and put in your API keys:

```bash
cp .env.example .env
```

Edit the .env file with your credentials.

make sure uv is installed:

```bash
...
```

Install playwright:

```bash
uv run playwright install
```

Then run the server:

```bash
uv run fastapi dev pay/server.py
```
