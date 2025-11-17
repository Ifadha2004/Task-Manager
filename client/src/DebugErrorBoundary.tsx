// client/src/DebugErrorBoundary.tsx
import { Component } from "react";
import type { ReactNode } from "react";

export class DebugErrorBoundary extends Component<{ children: ReactNode }, { err?: any }> {
  state = { err: undefined as any };
  static getDerivedStateFromError(err: any) { return { err }; }
  componentDidCatch(err: any, info: any) { console.error("App error:", err, info); }
  render() {
    if (this.state.err) {
      return (
        <pre style={{ padding: 16, color: "#f88" }}>
          {(this.state.err?.stack || this.state.err?.message || String(this.state.err))}
        </pre>
      );
    }
    return this.props.children;
  }
}
