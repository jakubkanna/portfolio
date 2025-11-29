"use client";

import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

type AnimatedTextProps = {
  message?: string | ReactNode | Array<string | ReactNode>;
  after?: ReactNode;
  speedMs?: number;
  sessionKey?: string;
};

const cursorStyle: CSSProperties = {
  display: "inline-block",
  width: "2px",
  height: "1em",
  backgroundColor: "#e6e6e6",
  animation: "blink 1s step-end infinite",
  verticalAlign: "baseline",
};

const extractText = (node: ReactNode): string => {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node)) {
    const children = (node as React.ReactElement<{ children?: ReactNode }>)
      .props?.children as ReactNode;
    return extractText(children);
  }
  return "";
};

type RenderResult = {
  nodes: ReactNode;
  used: number;
  hasShown: boolean;
};

const renderWithLimit = (
  node: ReactNode,
  remaining: number,
  hasShown: boolean
): RenderResult => {
  if (remaining <= 0 && !hasShown) {
    return { nodes: null, used: 0, hasShown };
  }

  if (node == null || typeof node === "boolean") {
    return { nodes: null, used: 0, hasShown };
  }

  if (typeof node === "string" || typeof node === "number") {
    const str = String(node);
    const take = Math.max(0, Math.min(str.length, remaining));
    const slice = str.slice(0, take);
    const nextShown = hasShown || take > 0;
    return { nodes: slice, used: take, hasShown: nextShown };
  }

  if (Array.isArray(node)) {
    const parts: ReactNode[] = [];
    let used = 0;
    let shown = hasShown;
    let budget = remaining;

    for (let idx = 0; idx < node.length; idx += 1) {
      const child = node[idx];
      const res = renderWithLimit(child, budget, shown);
      if (res.nodes !== null && res.nodes !== false && res.nodes !== "") {
        parts.push(
          <React.Fragment key={`part-${idx}`}>{res.nodes}</React.Fragment>
        );
      }
      used += res.used;
      shown = res.hasShown;
      budget -= res.used;
      if (budget <= 0 && shown) break;
    }

    return { nodes: parts, used, hasShown: shown };
  }

  if (React.isValidElement(node)) {
    const element = node as React.ReactElement<{ children?: ReactNode }>;
    const children = element.props?.children as ReactNode;
    if (children === undefined || children === null) {
      return {
        nodes: hasShown ? node : null,
        used: 0,
        hasShown,
      };
    }
    const res = renderWithLimit(children, remaining, hasShown);
    const shouldRender = res.hasShown || res.used > 0;
    return {
      nodes: shouldRender
        ? React.cloneElement(
            element,
            element.props as Record<string, unknown>,
            res.nodes
          )
        : null,
      used: res.used,
      hasShown: res.hasShown,
    };
  }

  return { nodes: null, used: 0, hasShown };
};

export default function AnimatedText({
  message = "",
  after = null,
  speedMs = 55,
  sessionKey,
}: AnimatedTextProps) {
  const segments = useMemo(
    () => (Array.isArray(message) ? message : [message]),
    [message]
  );

  const targetLength = useMemo(
    () => segments.map((seg) => extractText(seg)).join("").length,
    [segments]
  );

  const storageKey = useMemo(() => {
    const base = segments.map((seg) => extractText(seg)).join("|");
    return sessionKey ?? `animated-text:${base}`;
  }, [segments, sessionKey]);

  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem(storageKey);
    const target = seen ? targetLength : 0;
    const id = requestAnimationFrame(() => setTyped(target));
    return () => cancelAnimationFrame(id);
  }, [storageKey, targetLength]);

  useEffect(() => {
    if (typed >= targetLength) return;
    const id = setTimeout(
      () => setTyped((prev) => Math.min(prev + 1, targetLength)),
      speedMs
    );
    return () => clearTimeout(id);
  }, [typed, targetLength, speedMs]);

  const isDone = typed >= targetLength;

  useEffect(() => {
    if (!isDone || typeof window === "undefined") return;
    sessionStorage.setItem(storageKey, "seen");
  }, [isDone, storageKey]);

  const partial = useMemo(
    () => renderWithLimit(segments, typed, false).nodes,
    [segments, typed]
  );

  const full = useMemo(
    () => renderWithLimit(segments, targetLength, true).nodes,
    [segments, targetLength]
  );

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <span className="mx-auto max-w-3xl text-balance break-words font-semibold uppercase leading-tight whitespace-pre-wrap">
        {!isDone ? (
          <>
            {partial}
            <span aria-hidden style={cursorStyle} />
          </>
        ) : (
          full
        )}
      </span>
      {isDone && after}
    </div>
  );
}
