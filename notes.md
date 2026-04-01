Stage 1 — Build stage

You start with a full Go environment (golang:1.26.0) that has the compiler and everything you need.

You copy your source code and all dependencies (go.mod, go.sum).

You run go build -o main . → this produces a single binary executable called main.

This binary is just the finished program. It doesn’t need Go to run, it’s self-contained.

Think of it as: you baked a cake (binary) in the kitchen (build stage).

Stage 2 — Runtime stage

You start with a tiny image like alpine:3.23 — no Go compiler, no source code, nothing else.

You copy only the binary from the build stage into this image.

You also copy any scripts or migrations your app needs.

You run the binary (CMD ["./main"]) — this is your API actually running for real.

Think of it as: you’re now just serving the cake (binary) on a plate (runtime image). You don’t need the oven or mixer anymore.

Key point

You never rebuild in the runtime stage. You only run what was already built.

The runtime stage is much smaller because it doesn’t include compilers, source code, or libraries you only needed to build.

So yes, you “run it again” in a sense, but it’s not compiling again — it’s just executing the finished binary.

1 stage: Built the binary file
2 stage: Executes the binary file