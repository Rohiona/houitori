.PHONY: setup dev test lint format format-check build clean

setup:
	git config core.hooksPath .githooks

dev:
	docker compose up

test:
	docker compose run --rm web pnpm test:run

lint:
	docker compose run --rm web pnpm lint

format:
	docker compose run --rm web pnpm format

format-check:
	docker compose run --rm web pnpm format:check

build:
	docker compose run --rm web pnpm build

clean:
	docker compose down --rmi local --volumes
