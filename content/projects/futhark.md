---
title: futhark
subtitle: GitOps-driven infrastructure for my own homelab
abstract: |
  A two-node k3s homelab that can be rebuilt from a cold start: Ansible provisions the hosts, Flux reconciles the cluster from git, and OpenTofu manages what lives outside it. It runs SSO, encrypted backups and full monitoring, and is secured to be published as a public repository.
status: active
kind: personal
date:
  - 2026-02
  - present
role: "[[roles/solo-developer]]"
tech:
  - "[[technologies/kubernetes]]"
  - "[[technologies/flux]]"
  - "[[technologies/ansible]]"
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
  - Rebuildable from cold through twelve documented, re-runnable bootstrap steps
  - Three planes with one hand-off each — Ansible for hosts, Flux for the cluster, OpenTofu for cloud APIs
  - Single sign-on for every app through Pocket ID and an oauth2-proxy forward-auth middleware
  - Default-deny network policies, with secrets kept in SOPS and Infisical
  - Nothing floats — images pinned by digest, charts by exact version, bumps via Renovate pull requests
  - Restic snapshots to Backblaze B2 and VictoriaMetrics, VictoriaLogs and Grafana for observability
cv:
  context: "Personal homelab, ongoing"
  stack: ["Kubernetes (k3s)", "Flux", "Ansible", "OpenTofu"]
  bullets:
    - "Built a **GitOps homelab** rebuildable from cold: Ansible provisions hosts and installs k3s, **Flux** reconciles the cluster from git, OpenTofu manages DNS and OIDC; runs SSO, backups, and VictoriaMetrics/Grafana monitoring."
    - "Secured as a public repo: **default-deny network policies**, SOPS + Infisical secrets, Trivy and gitleaks in CI, digest-pinned images via Renovate."
---

futhark is the code for my homelab: two Fedora nodes joined over a NetBird mesh, running a single k3s cluster that I can rebuild from nothing by following the repository.

## Problem

A homelab built by hand drifts. After a few months, nobody (including me) can say exactly how it was set up, and a dead disk means days of rediscovery. I wanted the whole thing written down as code, and safe enough to publish.

## Approach

The repository splits along three planes, and each hands off to the next exactly once:

- **Host** — Ansible owns the machines: users, SSH, firewall, the mesh join, and the k3s install itself. It bootstraps Flux, then stops touching the cluster.
- **Cluster** — Flux, running as a FluxInstance, is the only writer after bootstrap and reconciles everything from git: controllers, apps, namespaces and policy.
- **Cloud** — OpenTofu manages what no Kustomization can express: DNS, OIDC clients and mesh policy.

## What runs

- Pocket ID as the OIDC provider, with oauth2-proxy behind a Traefik forward-auth middleware so apps without their own login still get one
- Two Traefiks: a public edge entrypoint and an internal one reachable only over the mesh
- cert-manager issuing Let's Encrypt certificates via DNS-01
- K8up writing restic snapshots to Backblaze B2
- VictoriaMetrics, VictoriaLogs and Grafana, with Gatus for uptime
- trivy-operator scanning running workloads

## Security

Because the repository is public, nothing secret lives in plain text: SOPS and the Infisical operator handle secrets, network policies default to deny, and CI runs Trivy and gitleaks on every change. Versions never float: images pin `tag@sha256`, charts pin exact versions, and every bump arrives as a Renovate pull request.
