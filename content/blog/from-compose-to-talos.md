---
title: From compose to Talos
summary: Getting my homelab's secrets and setup into code took it from Docker compose through Komodo, k3s and k0s to Talos.
date: 2026-10-23
---

I had [Pocket ID](https://pocket-id.org/) running and one OIDC client secret in a `.env` file. Then a second machine needed that secret, and the only way to get it there was to paste it into a second `.env` file. Two copies, no sync, and the day I rotated it, a guess at how many more I'd forgotten. Any OIDC provider would have put me in the same spot. That second paste is why I started moving [[projects/futhark]] off compose.

## compose

In February I started with what I knew best: [[technologies/docker]] and compose, laid out after [this tutorial](https://www.simplehomelab.com/udms-12-install-docker-and-docker-compose/) (compose file imports, hardened defaults). I hit its limits on secrets extremely fast. The `.env` files kept growing, and I could hardly sidecar secrets from an external manager like [Infisical](https://infisical.com/), let alone rotate them. Bolting real infrastructure as code onto compose was possible, but it came at a cost.

Infisical was what I wanted: secrets managed remotely in one place, so rotating one stops being a tour of machines, and a single breached host no longer gives away all of them.

## komodo

Next came [Komodo](https://komo.do), a clean interface for Docker that works as an orchestrator (Arcane follows the same idea). For every stack I had to list by hand which compose files to import, and that took ages. I ran into several issues syncing state, and into stale database connections. Even without those, Komodo came with its own single point of failure problems, and it didn't give me the reproducible, code-defined infrastructure I was after.

## kubernetes

[[technologies/kubernetes]] became the clear answer because the secrets and the whole cluster could be declared in git. The common warning is that it's daunting at homelab scale. I find it isn't that hard to approach, and it's more organized and standardized than compose. I'm genuinely afraid of Swarm, and Nomad I won't discuss.

I've run three Kubernetes flavors. In May I started with k3s, which ships the most defaults and suits a homelab's scale. Then I couldn't resist trying k0s, and the curiosity cost me a few days. Its `rig` package, which handles multi-host communication, was out of date, and I hit version mismatches. That fits how young k0s is, and I'd consider it again once it matures.

## talos

In July I moved to [Talos](https://www.talos.dev/), which behaves more like an operating system than a Kubernetes install on top of one. It's immutable and API-driven: the whole node is declared in config, so the nodes go into code with everything else, and there's no host left to drift.

Renting enough VPS compute for the whole cluster was too expensive, so the compute runs on my own hardware: old laptops and a Raspberry Pi.

KubeSpan, Talos's built-in mesh, lets a single VPS join those machines in one cluster. That gave me the layout I use now: a small [Hetzner](https://www.hetzner.com/) VPS as a clean entrypoint, with the compute on local nodes. Talos on a VPS means bringing your own image. Hetzner accepts custom ones, so I built it with Packer and uploaded it, following [Talos's Hetzner guide](https://docs.siderolabs.com/talos/v1.14/platform-specific-installations/cloud-platforms/hetzner).

I chose KubeSpan over NetBird for the nodes because it's enabled in the Talos machine config, with no extra agent or account, and node-to-node traffic needs no NetBird management server or policies. NetBird stays only so users can reach local-only services, where allowed.

![KubeSpan joins the VPS and the machines at home into one cluster; NetBird only lets peers reach what stays local.](topology.svg)

I've moved everything to Talos.

## looking back

The setup now lives in [the futhark repo](https://github.com/brewcoua/futhark), where [[technologies/flux]] reconciles it from git, with [[technologies/opentofu]] for DNS and the OIDC clients that started all this, [[technologies/sops]] for encrypted values, and the Infisical operator for runtime secrets. Kubernetes, the option I'd been warned off, is what got it there. Knowing what I know now, I'd skip Komodo and go straight from compose to Kubernetes; the hours I spent on it were wasted.

![The path I took, and the dashed one I'd take now: straight from compose to Kubernetes.](path.svg)

I'd like to self-host OpenBao once the setup is more robust. When I do, will running my own secrets manager bring back a single machine whose breach exposes every secret, the worry Infisical took off my plate? And how much of a homelab has to be in code before the cost of getting it there pays off?
