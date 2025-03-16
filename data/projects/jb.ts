import { Project, ProjectStatus } from "@/types";

const title = "JetBrains CLI";

const abstract = "A robust CLI tool for installing, updating, and configuring JetBrains IDEs from the command line. Built with Rust for high performance, it features concurrent downloads, progress tracking, and background updates with system notifications.";

const description = `JB CLI is a high-performance command-line interface tool that simplifies the management of JetBrains IDEs on Linux systems. Built entirely in Rust, it leverages modern concurrency patterns and efficient resource handling to provide a seamless experience.

1. **Core Features**
   - Install and uninstall JetBrains IDEs directly from the terminal
   - Concurrent downloads and extraction of multiple IDEs
   - Real-time progress bars with download speed indicators
   - Background update checking with system notifications
   - Automatic checksum verification for downloaded archives
   - Configure installation directories and desktop entries

2. **Technical Implementation**
   - Built with Rust for performance, safety, and reliability
   - Uses clap-rs for robust command-line argument parsing
   - Implements tokio for asynchronous operations and concurrency
   - Leverages flume for thread-safe communication channels
   - Employs flate2 and tar for efficient archive decompression
   - Utilizes reqwest with rustls for secure HTTP requests
   - Implements terminal UI with dynamic progress indicators

3. **Advanced Capabilities**
   - Multi-threaded downloads for maximum throughput
   - Background service for update checking with configurable intervals
   - Desktop notifications for available updates
   - Secure TLS implementation with rustls
   - Graceful error handling with detailed diagnostics
   - Memory-efficient processing of large archive files

The tool demonstrates modern systems programming techniques, using Rust's ownership model and zero-cost abstractions to create a lightweight yet powerful utility. It handles concurrent operations efficiently, allowing users to download and install multiple IDEs simultaneously without performance degradation.

This project showcases practical applications of concurrent programming patterns [[1]](#ref-1) while addressing the specific needs of developers who work with JetBrains products [[2]](#ref-2).`;

const technologies = [
  "Rust",
  "Tokio",
  "Clap-rs",
  "Reqwest",
  "Flume",
  "Flate2",
  "Linux",
  "Async Programming"
];

const highlights = [
  "Implemented concurrent downloads with progress tracking",
  "Built background update service with system notifications",
  "Created multi-threaded archive extraction with checksum verification",
  "Designed thread-safe communication channels for parallel processing",
  "Developed terminal UI with real-time progress indicators",
  "Optimized for performance with Rust's zero-cost abstractions"
];

export const jbCli: Project = {
  id: "jb-cli",
  title,
  abstract,
  description,
  technologies,
  thumbnail: "/thumbnails/jb.png",
  githubUrl: "https://github.com/brewcoua/jb",
  date: "March 2023",
  featured: true,
  highlights,
  role: "Software Developer",
  status: ProjectStatus.COMPLETED,
  duration: "3 weeks"
}; 