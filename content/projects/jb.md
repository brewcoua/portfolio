---
title: JetBrains CLI
subtitle: Rust CLI for JetBrains IDE lifecycle management
abstract: |
  A robust CLI tool for installing, updating, and configuring JetBrains IDEs from the command line. Built with Rust for high performance, it features concurrent downloads, progress tracking, and background updates with system notifications.
status: completed
kind: personal
featured: true
date: 2023-03
duration: 3 weeks
thumbnail: /thumbnails/jb.png
role: "[[roles/solo-developer]]"
tech:
  - "[[technologies/rust]]"
  - "[[technologies/tokio]]"
  - "[[technologies/clap]]"
  - "[[technologies/linux]]"
  - "[[technologies/reqwest]]"
  - "[[technologies/flume]]"
  - "[[technologies/flate2]]"
skills:
  - "[[skills/systems-programming]]"
  - "[[skills/concurrent-programming]]"
  - "[[skills/cli-tooling]]"
links:
  - type: github
    url: https://github.com/brewcoua/jb
highlights:
  - Optimized throughput using Rust's async model and zero-cost abstractions
  - Implemented concurrent downloads with progress tracking
  - Multi-threaded archive extraction with checksum verification
  - Built background update checks with system notifications
  - Terminal UI with real-time progress and throughput indicators
  - Thread-safe channels (Flume) for parallel download and extraction
---

JB CLI is a Rust command-line tool for installing, updating, and configuring JetBrains IDEs on Linux, written to replace the official Toolbox app on my own machines.

## Features

- `install`, `uninstall`, and `list` JetBrains IDEs from the terminal
- `link`/`unlink` installed IDEs on the PATH and generate `.desktop` entries
- `auto` mode checks for updates in the background and raises desktop notifications
- Self-`update` the CLI, and inspect the environment with `info` and `meta` (JSON output)
- Configure the tools, icons, and binary directories with flags or the `JB_TOOLS_DIR`,
  `JB_ICONS_DIR`, and `JB_BINARIES_DIR` environment variables

## Implementation

- Concurrent streaming downloads with progress bars and human-readable sizes
- SHA-256 checksum verification of each archive before extraction with flate2 and tar
- Async runtime on Tokio, thread-safe channels via Flume, and concurrent shared state via DashMap
- HTTP through Reqwest over rustls, argument parsing with clap, notifications via notify-rust
