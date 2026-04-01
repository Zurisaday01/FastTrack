# Build Stage
FROM --platform=linux/arm64 golang:1.26.0 AS builder

WORKDIR /app

# Install migrate (arm64)
RUN wget -O /tmp/migrate.tar.gz \
    https://github.com/golang-migrate/migrate/releases/download/v4.18.1/migrate.linux-arm64.tar.gz \
    && tar -xzf /tmp/migrate.tar.gz -C /usr/local/bin \
    && rm /tmp/migrate.tar.gz

# Copy Go modules and dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application for linux/arm64
RUN CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o main ./cmd/api/

# Final Stage
FROM --platform=linux/arm64 alpine:3.23

RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY wait-for-db.sh ./wait-for-db.sh
RUN chmod +x ./wait-for-db.sh

COPY --from=builder /app/main .
COPY --from=builder /usr/local/bin/migrate /usr/local/bin/migrate
COPY migrations ./migrations

EXPOSE 8080

CMD ["./main"]