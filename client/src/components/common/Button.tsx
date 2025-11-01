import React from "react";

type Variant = "primary" | "ghost" | "danger" | "outlineNeon";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  loading = false,
  className = "",
  children,
  disabled,
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm transition border select-none";

  const variants: Record<Variant, string> = {
    primary: "bg-neon text-black border-transparent hover:shadow-neon",
    ghost: "bg-transparent text-zinc-300 border-transparent hover:bg-zinc-800/40",
    danger: "bg-danger text-black border-transparent hover:opacity-90",
    // new outlined neon style
    outlineNeon:
      "bg-transparent text-neon border-neon hover:bg-neon/10 hover:shadow-neon",
  };

  const state = loading || disabled ? "opacity-75 cursor-not-allowed" : "";

  return (
    <button
      className={[base, variants[variant], state, className].join(" ").trim()}
      disabled={loading || disabled}
      {...rest}
    >
      {/* keep simple loader slot (hidden unless you wire it up) */}
      {children}
    </button>
  );
}

export default Button;
