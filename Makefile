.PHONY: dev test lint build clean

dev:
	docker compose up

test:
	docker compose run --rm web pnpm test:run

lint:
	docker compose run --rm web pnpm lint

build:
	docker compose run --rm web pnpm build

clean:
	docker compose down --rmi local --volumes
