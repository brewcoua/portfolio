# List recipes
default:
    @just --list

# Install deps and the git hooks
setup:
    pnpm install
    git config core.hooksPath .githooks

dev:
    pnpm dev

build:
    pnpm build

preview:
    pnpm preview

# Type-check and unit-test (run by the pre-commit hook)
check:
    pnpm check
    pnpm test:unit

# Build and copy a CV variant to out/ (main is /cv.pdf, others /cv/<variant>.pdf)
cv variant="main": build
    mkdir -p out
    cp {{ if variant == "main" { "build/cv.pdf" } else { "build/cv/" + variant + ".pdf" } }} out/{{variant}}.pdf
    @echo out/{{variant}}.pdf
