# Yashika Garg — Portfolio

Live at **https://yashikagarg16.github.io/My-Portfolio/**

A static, dependency-free portfolio with a Three.js "system architecture" hero, 3D-tilting project cards and a detail view for every project.

| Project | Demo | Repo |
|---|---|---|
| Algo Trade Simulator | [algo-trade-mu.vercel.app](https://algo-trade-mu.vercel.app) | [Algo-Trade](https://github.com/yashikagarg16/Algo-Trade) |
| Campus Inbox Agent | [campus-inbox-agent.vercel.app](https://campus-inbox-agent.vercel.app) | [Campus-Inbox-Agent](https://github.com/yashikagarg16/Campus-Inbox-Agent) |
| RevenueGuard AI | [revenue-guard-rho.vercel.app](https://revenue-guard-rho.vercel.app) | [RevenueGuard](https://github.com/yashikagarg16/RevenueGuard) |

## Files

- `index.html` — page structure
- `styles.css` — styling (three colours: ink `#0B0F19`, bone `#EEF0F5`, accent `#FF6A3D`)
- `projects.js` — project content; add a project by adding an entry here
- `app.js` — cards, 3D tilt and the `#/project/<id>` detail view
- `scene.js` — Three.js hero scene

## Run locally

```bash
python -m http.server 8000
```

Then open http://localhost:8000.
