APP_SERVICE=app
MIGRATIONS_PATH=/app/migrations

.PHONY: migrate-up migrate-down migrate-version migrate-force check-db-url seed rebuild

# Compile all file from the api directory and run the server
run-api:
	go run cmd/api/*.go

check-db-url:
	@echo "Checking DATABASE_DSN in container..."
	docker compose run --rm --entrypoint="" $(APP_SERVICE) sh -c 'echo "DATABASE_DSN=$$DATABASE_DSN"'

migrate-up:
	docker compose run --rm --entrypoint="" $(APP_SERVICE) sh -c '/usr/local/bin/migrate -source file://$(MIGRATIONS_PATH) -database "$$DATABASE_DSN" up'

migrate-down:
	docker compose run --rm --entrypoint="" $(APP_SERVICE) sh -c '/usr/local/bin/migrate -source file://$(MIGRATIONS_PATH) -database "$$DATABASE_DSN" down 1'

migrate-force:
	@read -p "Force version: " v; \
	docker compose run --rm --entrypoint="" $(APP_SERVICE) sh -c "/usr/local/bin/migrate -database \"\$$DATABASE_DSN\" force $$v"

backup:
	@mkdir -p backups
	docker compose exec db pg_dump -U admin fasttrackdb > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup created in backups/ directory"

restore:
	@read -p "Enter backup filename (e.g., backup_20260208_123456.sql): " f; \
	docker compose exec -T db psql -U admin -d fasttrackdb < backups/$$f
	@echo "✅ Database restored"

list-db-tables:
	docker compose exec db psql -U admin -d fasttrackdb -c '\dt'

rebuild:
	docker compose down
	docker compose build app --no-cache app
	docker compose up -d
	@echo "✅ Rebuild complete!"