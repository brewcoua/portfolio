---
title: From compose to Talos
summary: One OIDC secret pasted into a second .env file sent my homelab through Komodo, k3s, k0s, a self-hosted vault I couldn't trust, and finally Talos.
tldr: |
  - Compose couldn't pull secrets from an external manager, so my homelab went through Komodo, k3s and k0s before landing on Talos.
  - I dropped my self-hosted OpenBao for Infisical Cloud: a vault on a shared, un-isolated host was the single point of breach Infisical was there to remove.
  - Today it's two Hetzner nodes on Talos and KubeSpan, reconciled from git by Flux. I'd skip Komodo if I started over.
date: 2026-10-23
cover: cover.svg
---

I had [Pocket ID](https://pocket-id.org/) running and one OIDC client secret in a `.env` file. Then a second machine needed that secret, and the only way to get it there was to paste it into a second `.env` file. Two copies, no sync, and the day I rotated it, a guess at how many more I'd forgotten. Any OIDC provider would have put me in the same spot. That second paste is why I started moving [[projects/futhark]] off compose.

I thought I was picking a way to run containers. Eight months later, I can say what I was picking: a place for secrets and hosts to live as code, and the question of who I trust to run that place. Every stage below failed on one of those two.

## compose

In February I started with what I knew best: [[technologies/docker]] and compose, laid out after [this tutorial](https://www.simplehomelab.com/udms-12-install-docker-and-docker-compose/) (compose file imports, hardened defaults). I hit its limits on secrets extremely fast. The `.env` files kept growing, and I could hardly sidecar secrets from an external manager like [Infisical](https://infisical.com/), let alone rotate them. Bolting real infrastructure as code onto compose was possible, but each piece was glue I'd write and own myself.

Infisical was what I wanted: secrets managed remotely in one place, so rotating one stops being a tour of machines, and a single breached host no longer gives away all of them. Compose had no clean way to ask it for anything.

## komodo

Next came [Komodo](https://komo.do), a clean interface for Docker that works as an orchestrator.[^arcane] For every stack I had to list by hand which compose files to import, and that took ages. I ran into several issues syncing state, and into stale database connections. Even without those, Komodo was one more server holding the truth about every other server, and it still didn't give me the reproducible, code-defined infrastructure I was after. I had added a manager on top of the `.env` files, and the `.env` files were still there.

## kubernetes

[[technologies/kubernetes]] became the clear answer because the secrets and the whole cluster could be declared in git. What made that picture click was [Mafyuh's iac repo](https://github.com/Mafyuh/iac): one repository holding a whole homelab, from machine images to apps, with a bot opening a pull request for every version bump. I wanted that.

The common warning is that Kubernetes is daunting at homelab scale. I find it isn't that hard to approach, and it's more organized and standardized than compose.[^swarm]

My first k3s repo dates from April 20. Its `SPECS.md` has thirteen sections: traffic classes, a placement matrix, default-deny network policy, secret rotation every 90 days, and an availability target of 99.0% a month with a 30-minute alert acknowledgement. The production workload it was written for was a single SearXNG instance.

I've run three Kubernetes flavors. k3s ships the most defaults and suits a homelab's scale. Then I couldn't resist trying k0s, and the curiosity cost me a few days. Its `rig` package, which handles multi-host communication, was out of date, and I hit version mismatches. That fits how young k0s is, and I'd consider it again once it matures.

Back on k3s, the cluster grew into something I'd call real. By July it had three machines. kenaz, a VPS, was the k3s server and ran every workload. wunjo, at home, was an agent whose own `apps/` folder was empty; it ran metrics collectors and nothing else. ogma, a second VPS, sat outside the cluster on purpose. Ansible bootstrapped all three in numbered stages, and a small CLI, `fut`, wrapped the lot so I never had to SSH into a node.

## the vault I couldn't trust

ogma was outside the cluster because it held the things I wanted away from my workloads: a self-hosted [OpenBao](https://openbao.org/) for secrets and a self-hosted Headscale coordinating the Tailscale mesh every node talked over.

The commit log from July 16 reads like a list of reasons not to:

```text title="git log"
fix(openbao): bao CLI calls fail TLS verify against the self-signed cert
fix(openbao): TLS cert's SAN doesn't cover ogma's mesh IP
fix(openbao): ESO's vault provider has no insecureSkipTLSVerify field
fix(openbao): userpass admin can't hold the literal root policy
fix(openbao): raft storage dir + TLS key unreadable by container's non-root uid
fix(headscale): stage-25 re-run silently disables split-DNS
```

None of those is hard on its own. Together they made me look at what I'd built. The service that guarded every secret ran on a machine joined to the same mesh it coordinated, hardened by the same Ansible stages as everything else, sharing a host with Headscale and a DNS resolver. If I was going to hold the keys myself, I wanted them on one dedicated node that ran only those services and stood fully apart from the rest of the network. I didn't have that node, and I couldn't secure ogma to that standard.

So on July 17 I moved secrets to Infisical Cloud and the mesh to Tailscale's own coordination. The migration was about fifty keys copied by hand from one store to the other. I didn't script it; it runs once. One rule went in bold in my notes:

> [!WARNING]
> The restic repository password gets copied byte-exact, never retyped. A typo there corrupts every future backup and stays silent until the day you need a restore.

Handing the vault to a SaaS looks like a step back from self-hosting. But a secrets manager I can't isolate is a single machine whose breach exposes everything, the problem Infisical was there to remove in the first place.

## talos

Over the summer I moved to [Talos](https://www.talos.dev/), which behaves more like an operating system than a Kubernetes install on top of one. It's immutable and API-driven: the whole node is declared in config, so the nodes go into code with everything else, and there's no host left to drift. It has no SSH either, which made a large part of my repo pointless. On August 22 I deleted the whole Ansible directory. The commit message sums up the shift: "three Fedora VMs and a standalone Podman host become three Talos nodes with no host daemon and no sshd."

Talos on a VPS means bringing your own image. Hetzner accepts custom ones, so I built it with Packer, following [Talos's Hetzner guide](https://docs.siderolabs.com/talos/v1.13/platform-specific-installations/cloud-platforms/hetzner). The build boots a throwaway server into rescue mode and writes the image over its disk:

```hcl title=packer/talos/talos.pkr.hcl
provisioner "shell" {
  inline = [
    "apt-get install -y wget",
    "wget -O /tmp/talos.raw.xz ${local.image}",
    "xz -d -c /tmp/talos.raw.xz | dd of=/dev/sda && sync",
  ]
}
```

Hetzner snapshots that disk, and the snapshot becomes every node's image. The extensions (a guest agent, `crun`) stay out of it and come from the machine config instead, so changing one is a config apply and not a Packer rebuild.

Today the cluster is two Hetzner servers. ogma, a CX23 in Nuremberg, is the only control plane and the only node with a public IPv4. kenaz, a CX33 in Helsinki, is a worker that takes no inbound traffic. A single etcd member is a deliberate trade: two members would make quorum worse, not better. The floating IP I'd planned for a highly available edge cost more each month than it was worth for one edge node, so it went too.

![Today two Hetzner nodes share one KubeSpan mesh; the machines at home are the next nodes to join, and NetBird lets my devices reach what stays private.](topology.svg)

## the mesh, twice

Talos ships its own node mesh, KubeSpan, a WireGuard network enabled in the machine config with no extra agent or account. It replaced Tailscale between the nodes:

```yaml title=talos/talconfig.yaml
machine:
  network:
    kubespan:
      enabled: true
      # Cilium owns pod routing; if KubeSpan also advertised the pod and
      # service subnets, both would claim the same traffic.
      advertiseKubernetesNetworks: false
```

Cilium already routes pod traffic in tunnel mode, and letting KubeSpan advertise the same subnets is how [siderolabs/talos#11244](https://github.com/siderolabs/talos/issues/11244) bites on a node whose primary interface has a public IP. Every node I run has one.

KubeSpan had its own surprise. When I split the Hetzner firewall into one rule set per node, I noticed the old set had never opened KubeSpan's port, 51820/udp, between the nodes at all. My note in that commit says it's "worth confirming with `talosctl get kubespanpeerstatuses` that the mesh was ever actually up."

Tailscale left my stack entirely. I wanted fewer of my private connections to depend on a company outside Europe, and NetBird offered more features and felt more stable. The week I'm writing this, an audit found eleven flaws in the Tailscale client and in Headscale, six of them rated high, disclosed before any patch existed ([IT-Connect, October 26](https://www.it-connect.tech/tailworm-11-unpatched-tailscale-flaws-including-root-access-via-tailscale-ssh/)). I had left both for other reasons, and I was glad to have left already.

NetBird has no part in the node mesh. It does one job: letting my own devices reach services that stay private, and only the ones I allow. A routing peer in the cluster answers for the internal names, so from any of my devices on NetBird, Forgejo and Pocket ID resolve to an internal address and skip the proof-of-work challenge and the geoblock that limits the public edge to France and the Netherlands. The traffic goes peer to peer, so it doesn't eat the VPS's bandwidth, and each service gets its own access rules. That's what lets me keep the public edge hostile.

## looking back

The setup now lives in [the futhark repo](https://github.com/brewcoua/futhark), where [[technologies/flux]] reconciles it from git, with [[technologies/opentofu]] for DNS and the OIDC clients that started all this, [[technologies/sops]] for encrypted values, and the Infisical operator for runtime secrets. Kubernetes, the option I'd been warned off, is what got it there.

Knowing what I know now, I'd skip Komodo and go straight from compose to Kubernetes; the hours I spent on it were wasted.

![The path I took, and the dashed one I'd take now: straight from compose to Kubernetes.](path.svg)

The compute is the part still moving. Renting enough VPS capacity for the whole cluster keeps getting more expensive, so the plan is to bring the old laptops and a Raspberry Pi at home in as nodes and keep the VPS as a clean entrypoint. Hetzner's server auction is the other road.

I'd like to self-host OpenBao again once I have that dedicated node. When I do, will one isolated machine really be safer than a SaaS vault, or will it bring back a single host whose breach exposes every secret, the worry Infisical took off my plate? And how much of a homelab has to be in code before the cost of getting it there pays off?

[^arcane]: Arcane follows the same idea.
[^swarm]: I'm genuinely afraid of Swarm, and Nomad I won't discuss.
