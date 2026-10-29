---
title: futhark
subtitle: GitOps-driven infrastructure for my own homelab
abstract: |
  A two-node Talos Kubernetes cluster that can be rebuilt from a cold start: Talos and Packer define the nodes, Flux reconciles the cluster from git, and OpenTofu manages what lives outside it. It runs SSO, encrypted backups and monitoring, and is secured to be published as a public repository.
status: active
kind: personal
date:
  - 2026-02
  - present
cover: cover.svg
role: "[[roles/solo-developer]]"
tech:
  - "[[technologies/talos]]"
  - "[[technologies/kubernetes]]"
  - "[[technologies/flux]]"
  - "[[technologies/opentofu]]"
  - "[[technologies/sops]]"
  - "[[technologies/trivy]]"
  - "[[technologies/linux]]"
skills:
  - "[[skills/cloud-computing]]"
  - "[[skills/authentication-security]]"
links:
  - type: github
    url: https://github.com/brewcoua/futhark
  - type: codeberg
    url: https://codeberg.org/brewcoua/futhark
  - type: docs
    url: https://brewcoua.github.io/futhark/
highlights:
  - Rebuildable from cold through documented, re-runnable bootstrap steps
  - Three planes with one hand-off each — Talos for machines, Flux for the cluster, OpenTofu for cloud APIs
  - No shell, package manager or SSH on any node; the only way in is the Talos API
  - Single sign-on for every app through Pocket ID and Envoy Gateway OIDC policies
  - Default-deny network policies, with secrets split across SOPS, Bitwarden and Infisical by what they can do
  - Nothing floats — images pinned by digest, charts by exact version, bumps via Renovate pull requests
  - Restic snapshots to Hetzner Object Storage, with VictoriaMetrics, VictoriaLogs and Grafana for observability
cv:
  context: "Personal homelab, ongoing"
  stack: ["Kubernetes (Talos)", "Flux", "OpenTofu", "Packer"]
  bullets:
    - "Built a **GitOps homelab** rebuildable from cold: **Talos** nodes from a Packer-built image, **Flux** reconciles the cluster from git, OpenTofu manages DNS, OIDC and servers; runs SSO, backups, and VictoriaMetrics/Grafana monitoring."
    - "Secured as a public repo: **default-deny network policies**, secrets split across SOPS, Bitwarden and Infisical, Trivy and gitleaks in CI, digest-pinned images via Renovate."
---

futhark is the code for my homelab: two Hetzner servers running [[technologies/talos]], joined by KubeSpan into one Kubernetes cluster that I can rebuild from nothing by following the repository. How it got here, from compose through Komodo and k3s, is in [the blog post](/blog/from-compose-to-talos).

## Problem

A homelab built by hand drifts. After a few months, nobody (including me) can say exactly how it was set up, and a dead disk means days of rediscovery. I wanted the whole thing written down as code, and safe enough to publish.

## Approach

The repository splits along three planes, and each hands off to the next exactly once:

- **Machine** — Talos owns the nodes: disks, network, kubelet, etcd. Packer builds the Talos image on Hetzner, and the whole node is declared in config, so there's no host left to drift.
- **Cluster** — Flux, running as a FluxInstance, is the only writer after a one-time bootstrap and reconciles everything from git: controllers, apps, namespaces and policy.
- **Cloud** — OpenTofu manages what no Kustomization can express: DNS, OIDC clients, buckets and servers.

ogma (CX23, Nuremberg) is the single control plane and the only node with a public IPv4. kenaz (CX33, Helsinki) is a worker that takes no inbound traffic. Single-member etcd is deliberate until local nodes join.

## What runs

- Pocket ID as the OIDC provider, with Envoy Gateway `SecurityPolicy` giving a login to apps without their own
- Envoy Gateway with two classes: a public edge pinned to ogma, and an internal one reachable only over NetBird
- Cilium for pod networking, with kube-proxy replaced
- cert-manager issuing Let's Encrypt certificates via DNS-01
- K8up writing restic snapshots to Hetzner Object Storage
- VictoriaMetrics, VictoriaLogs and Grafana, with Gatus for uptime and Glance as the homepage
- trivy-operator scanning running workloads

## Security

Because the repository is public, nothing secret or identifying lives in plain text. Three stores split values by what they can do: SOPS for values that identify but grant nothing, Bitwarden Secrets Manager for anything that could rebuild or re-key the system (the cluster holds no Bitwarden credential at all), and the Infisical operator for per-app runtime secrets. Every namespace starts default-deny, CI runs Trivy and gitleaks on every change, and versions never float: images pin `tag@sha256`, charts pin exact versions, and every bump arrives as a Renovate pull request.
