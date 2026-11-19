"use client";

import { useEffect, useRef, useState } from "react";
import { CaptureVisual, DiffVisual, ReplayVisual } from "./story-visuals";

const STEPS = [
  {
    id: "capture",
    label: "Capture",
    title: "The failing request, stored whole",
    body: "Headers, body, status, and the span tree underneath. Nothing sampled, nothing aggregated — the record is the evidence, and it is kept for seven days with your redaction rules applied before it ever leaves the process.",
    Visual: CaptureVisual,
  },
  {
    id: "replay",
    label: "Replay",
    title: "Same bytes, your branch",
    body: "The capture keeps the exact bytes and the span tree together, so a sandbox run can reuse the same idempotency key and payload. In this deployment the result is derived from the record rather than executed — the capture is real, the execution is not.",
    Visual: ReplayVisual,
  },
  {
    id: "diff",
    label: "Diff",
    title: "The answer is a diff",
    body: "Sluice compares the replay against the original record: status, wall time, every span, and the response body. What changed is the review. What did not change is the reason to keep looking.",
    Visual: DiffVisual,
  },
] as const;

export function Story() {
  const [activeId, setActiveId] = useState<string>(STEPS[0].id);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id.replace("step-", ""));
          }
        }
      },
      { rootMargin: "-38% 0px -38% 0px" },
    );

    for (const element of stepRefs.current) {
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how" className="scroll-mt-14 border-b border-rule">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-24">
        <div className="lg:sticky lg:top-24 lg:h-fit lg:self-start">
          <p className="font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase">
            How a fix actually happens
          </p>
          <h2 className="display mt-4 text-[clamp(2.1rem,4.6vw,3.3rem)] text-ink">
            One request,
            <br />
            <em>three</em> moves.
          </h2>
          <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-ink-soft">
            The gap between an incident and a fix is usually information, not
            skill. Sluice closes that gap with the artifact rather than another
            dashboard.
          </p>

          <ol className="mt-8 hidden space-y-1 lg:block">
            {STEPS.map((step, index) => {
              const isActive = activeId === step.id;
              return (
                <li key={step.id}>
                  <a
                    href={`#step-${step.id}`}
                    className={`group flex items-baseline gap-3 border-l-2 py-1.5 pl-3 transition-colors ${
                      isActive
                        ? "border-signal text-ink"
                        : "border-rule text-ink-faint hover:text-ink-soft"
                    }`}
                  >
                    <span className="font-mono text-[10px] tabular-nums">
                      0{index + 1}
                    </span>
                    <span className="text-sm">{step.label}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>

        <ol className="space-y-0">
          {STEPS.map((step, index) => (
            <li
              key={step.id}
              id={`step-${step.id}`}
              ref={(element) => {
                stepRefs.current[index] = element;
              }}
              className="scroll-mt-20 border-t border-rule py-10 first:border-t-0 first:pt-0 lg:py-12"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] text-signal tabular-nums">
                  0{index + 1}
                </span>
                <span className="font-mono text-[10px] tracking-[0.12em] text-ink-faint uppercase">
                  {step.label}
                </span>
              </div>

              <h3 className="mt-3 max-w-[26ch] text-[22px] leading-snug font-medium tracking-[-0.01em] text-ink">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-ink-soft">
                {step.body}
              </p>

              <div className="mt-6">
                <step.Visual />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
