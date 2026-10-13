# A32 Pro portal integration

The admin menu includes `/admin/devices`: 32 relays, 40 inputs, rooms, scenes, schedule summary and command history. Names, scenes and schedules are edited in the existing local dashboard. Schedules run on the gateway PC and require it to remain on.

The portal's existing general admin PIN is only a client-side gate. Device access additionally requires a separate server-verified password. No device API access is granted by the general PIN. Sessions expire after 30 minutes. Login throttling is per server instance; use a shared rate limiter before a broad multi-instance rollout.

## Gateway PC (Windows or Mac on the controller network)

1. Install Python 3. Copy `integration/pc-bridge` and keep it on the controller's network.
2. Create `integration/a32-controller-config.json` privately, outside `pc-bridge`:

```json
{
  "host": "192.168.68.108",
  "secret": "YOUR_EXISTING_KCS_HTTP_SECRET",
  "remote_bridge": {
    "enabled": true,
    "token": "RANDOM_TOKEN_AT_LEAST_32_CHARACTERS"
  }
}
```

3. Run `python3 server.py` from `pc-bridge` on Mac, or `start.bat` from Windows Explorer. The local dashboard listens on 127.0.0.1:8765 and the authenticated gateway on 127.0.0.1:8767. Keep the process running. Preserve `integration/a32-automation.json` when moving existing room/scene/schedule data.
4. For Vercel, configure a named HTTPS tunnel to port 8767 using the example YAML. Replace the hostname, tunnel UUID and credentials path. Do not tunnel port 8765 or the controller's own web interface. Tunnel/domain setup is not activated by this code.

## Portal source on Mac

1. Run `npm ci` in the portal folder. Copy `.env.a32.example` to `.env.local` and replace all placeholders.
2. Set `A32_BRIDGE_TOKEN` to the gateway token. Set `A32_BRIDGE_URL` to the gateway HTTPS hostname. The Mac can host the portal source while a Windows PC runs the gateway.
3. For development on the same gateway PC only, the example's loopback URL and `A32_ALLOW_LOCAL_BRIDGE=1` can be used. On a different Mac, 127.0.0.1 points to that Mac, not the Windows PC.
4. Run `npm run dev`, open `/admin/devices`, pass the existing admin gate and enter the separate device password.
5. Configure the four A32 variables in Vercel's server environment and redeploy when the HTTPS gateway is ready. Never prefix them with `NEXT_PUBLIC_`. Production rejects plain HTTP gateways.

No public tunnel, GitHub push or Vercel deployment is performed by this integration. Private configuration files and `.env.local` are ignored by Git. Do not commit or share them. Controller IP may change; update the private config or reserve its DHCP address.

## Verification

```sh
node --test scripts/test-a32.cjs
npm run build
```

Gateway tests use a fake controller, never physical relays. Create a placeholder private controller config first if testing a fresh checkout, then from `integration/pc-bridge` run:

```sh
python3 -m unittest test_automation test_api test_remote
```

Commands are serialized and journaled before execution. Repeating the same command ID does not execute it twice while retained in the 512-entry journal. An uncertain result requires refreshing actual state; commands are not retried automatically.
