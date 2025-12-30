.PHONY: setup dev test lint format format-check build clean

setup:
	git config core.hooksPath .githooks

dev:
	docker compose up -d

test:
	docker compose exec web pnpm test:run

lint:
	docker compose exec web pnpm lint

format:
	docker compose exec web pnpm format

format-check:
	docker compose exec web pnpm format:check

build:
	docker compose exec web pnpm build

clean:
	docker compose down --rmi local --volumes
