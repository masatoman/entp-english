# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]: "[plugin:vite:import-analysis]"
    - generic [ref=e6]: Failed to resolve import "@radix-ui/react-dialog@1.1.6" from "src/components/ui/dialog.tsx". Does the file exist?
  - generic [ref=e8] [cursor=pointer]: /Volumes/Samsung/Works/entp-english/src/components/ui/dialog.tsx:4:33
  - generic [ref=e9]: "21 | import { jsxDEV as _jsxDEV } from \"react/jsx-dev-runtime\"; 22 | import * as React from \"react\"; 23 | import * as DialogPrimitive from \"@radix-ui/react-dialog@1.1.6\"; | ^ 24 | import { XIcon } from \"lucide-react@0.487.0\"; 25 | import { cn } from \"./utils\";"
  - generic [ref=e10]:
    - text: "at TransformPluginContext._formatLog (file:"
    - generic [ref=e11] [cursor=pointer]: ///Volumes/Samsung/Works/entp-english/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:42499:41
    - text: ") at TransformPluginContext.error (file:"
    - generic [ref=e12] [cursor=pointer]: ///Volumes/Samsung/Works/entp-english/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:42496:16
    - text: ") at normalizeUrl (file:"
    - generic [ref=e13] [cursor=pointer]: ///Volumes/Samsung/Works/entp-english/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:40475:23
    - text: ") at async file:"
    - generic [ref=e14] [cursor=pointer]: ///Volumes/Samsung/Works/entp-english/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:40594:37
    - text: "at async Promise.all (index 4) at async TransformPluginContext.transform (file:"
    - generic [ref=e15] [cursor=pointer]: ///Volumes/Samsung/Works/entp-english/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:40521:7
    - text: ") at async EnvironmentPluginContainer.transform (file:"
    - generic [ref=e16] [cursor=pointer]: ///Volumes/Samsung/Works/entp-english/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:42294:18
    - text: ") at async loadAndTransform (file:"
    - generic [ref=e17] [cursor=pointer]: ///Volumes/Samsung/Works/entp-english/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:35735:27
    - text: ") at async viteTransformMiddleware (file:"
    - generic [ref=e18] [cursor=pointer]: ///Volumes/Samsung/Works/entp-english/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:37250:24
  - generic [ref=e19]:
    - text: Click outside, press
    - generic [ref=e20]: Esc
    - text: key, or fix the code to dismiss.
    - text: You can also disable this overlay by setting
    - code [ref=e21]: server.hmr.overlay
    - text: to
    - code [ref=e22]: "false"
    - text: in
    - code [ref=e23]: vite.config.ts
    - text: .
```