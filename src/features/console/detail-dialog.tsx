"use client";

import { Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Kbd } from "@/components/kbd";
import { StatusPill } from "@/components/status-pill";
import {
  formatDuration,
  timelineEndMs,
  type RequestRecord,
} from "@/lib/requests";
import { TraceWaterfall } from "./trace-waterfall";

type Tab = "trace" | "payload" | "replay";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "trace", label: "Trace" },
  { id: "payload", label: "Payload" },
  { id: "replay", label: "Replay" },
];

export function DetailDialog({
  record,
  onClose,
  onNavigate,
}: {
  record: RequestRecord | null;
  onClose: () => void;
  onNavigate: (step: 1 | -1) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState<Tab>("trace");
  const [isRunning, setIsRunning] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setTab("trace");
    setIsRunning(false);
    setHasResult(record?.replayed ?? false);
    setIsCopied(false);
  }, [record]);

  useEffect(() => {
    const element = dialogRef.current;
    if (!element) return;
    if (record && !element.open) element.showModal();
    if (!record && element.open) element.close();
  }, [record]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setTimeout(() => {
      setIsRunning(false);
      setHasResult(true);
    }, 900);
    return () => clearTimeout(timer);
  }, [isRunning]);

  useEffect(() => {
    if (!record) return;

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      if (isTyping) return;

      if (event.key === "j") {
        event.preventDefault();
        onNavigate(1);
      }
      if (event.key === "k") {
        event.preventDefault();
        onNavigate(-1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [record, onNavigate]);

  async function handleCopy() {
    if (!record) return;
    await navigator.clipboard.writeText(
      `sluice replay ${record.id} --branch fix`,
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1600);
  }

  const bottleneck = record
    ? record.spans
        .filter((span) => span.startMs > 0)
        .reduce((worst, span) => (span.durationMs > worst.durationMs ? span : worst))
    : null;
  const fixedMs = record ? Math.max(180, Math.round(record.durationMs * 0.16)) : 0;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="capture-title"
      onClose={onClose}
      className="m-0 ml-auto h-dvh max-h-dvh w-full max-w-[560px] border-l border-rule bg-paper p-0 backdrop:bg-ink/25 open:flex open:flex-col"
    >
      {record ? (
        <>
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-rule px-5 py-4">
            <div className="min-w-0">
              <p className="font-mono text-[10px] tracking-[0.12em] text-ink-faint uppercase">
                captured request
              </p>
              <h2
                id="capture-title"
                className="mt-1.5 truncate font-mono text-[13px] text-ink"
              >
                {record.method} {record.path}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-rule-strong text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              <X aria-hidden="true" className="size-4" />
              <span className="sr-only">Close capture</span>
            </button>
          </div>

          <dl className="grid shrink-0 grid-cols-2 gap-px border-b border-rule bg-rule sm:grid-cols-4">
            {[
              { label: "status", value: <StatusPill status={record.status} /> },
              {
                label: "wall",
                value: formatDuration(record.durationMs),
              },
              { label: "region", value: record.region },
              { label: "release", value: record.release },
            ].map((item) => (
              <div key={item.label} className="bg-paper px-4 py-2.5">
                <dt className="font-mono text-[9px] tracking-[0.1em] text-ink-faint uppercase">
                  {item.label}
                </dt>
                <dd className="mt-1 truncate font-mono text-[11px] text-ink">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <div
            role="tablist"
            aria-label="Capture views"
            className="flex shrink-0 gap-1 border-b border-rule px-3"
          >
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={tab === item.id}
                aria-controls={`panel-${item.id}`}
                onClick={() => setTab(item.id)}
                className={`-mb-px border-b-2 px-3 py-2.5 font-mono text-[10px] tracking-[0.1em] uppercase transition-colors ${
                  tab === item.id
                    ? "border-signal text-ink"
                    : "border-transparent text-ink-faint hover:text-ink-soft"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            {tab === "trace" ? (
              <section
                role="tabpanel"
                id="panel-trace"
                aria-labelledby="tab-trace"
              >
                <TraceWaterfall
                  spans={record.spans}
                  totalMs={timelineEndMs(record)}
                />
                {bottleneck ? (
                  <p className="mt-5 border-t border-rule pt-3 font-mono text-[10px] text-ink-faint">
                    bottleneck{" "}
                    <span className="text-signal-deep">{bottleneck.name}</span> ·{" "}
                    {formatDuration(bottleneck.durationMs)} of{" "}
                    {formatDuration(record.durationMs)} ·{" "}
                    {Math.round(
                      (bottleneck.durationMs /
                        Math.max(record.durationMs, 1)) *
                        100,
                    )}
                    % of wall time
                  </p>
                ) : null}

                <div className="mt-6">
                  <h3 className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase">
                    span ledger
                  </h3>
                  <table className="mt-2 w-full border-collapse text-left font-mono text-[10px]">
                    <thead>
                      <tr className="border-y border-rule text-ink-faint">
                        <th scope="col" className="py-1.5 font-normal">
                          span
                        </th>
                        <th scope="col" className="py-1.5 font-normal">
                          service
                        </th>
                        <th scope="col" className="py-1.5 text-right font-normal">
                          start
                        </th>
                        <th scope="col" className="py-1.5 text-right font-normal">
                          dur
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {record.spans.map((span) => (
                        <tr key={span.id} className="border-b border-rule/70">
                          <td className="max-w-[13rem] truncate py-1.5 text-ink-soft">
                            {span.name}
                          </td>
                          <td className="py-1.5 text-ink-faint">
                            {span.service}
                          </td>
                          <td className="py-1.5 text-right text-ink-faint tabular-nums">
                            {formatDuration(span.startMs)}
                          </td>
                          <td className="py-1.5 text-right text-ink tabular-nums">
                            {formatDuration(span.durationMs)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}

            {tab === "payload" ? (
              <section
                role="tabpanel"
                id="panel-payload"
                aria-labelledby="tab-payload"
                className="space-y-4"
              >
                <div>
                  <h3 className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase">
                    request body
                  </h3>
                  <pre className="mt-2 overflow-x-auto rounded-lg border border-rule bg-paper-2 p-3 font-mono text-[11px] leading-relaxed text-ink-soft">
                    <code>{record.requestBody}</code>
                  </pre>
                </div>
                <div>
                  <h3 className="font-mono text-[10px] tracking-[0.1em] text-ink-faint uppercase">
                    response body
                  </h3>
                  <pre className="mt-2 overflow-x-auto rounded-lg border border-rule bg-paper-2 p-3 font-mono text-[11px] leading-relaxed text-ink-soft">
                    <code>{record.responseBody}</code>
                  </pre>
                </div>
                <p className="font-mono text-[10px] text-ink-faint">
                  authorization, cookie and card fields are redacted at capture
                  time
                </p>
              </section>
            ) : null}

            {tab === "replay" ? (
              <section
                role="tabpanel"
                id="panel-replay"
                aria-labelledby="tab-replay"
              >
                <p className="text-[13px] leading-relaxed text-ink-soft">
                  Replay runs the captured bytes inside a sandbox with{" "}
                  <span className="font-mono text-[12px] text-ink">
                    postgres:16
                  </span>{" "}
                  and{" "}
                  <span className="font-mono text-[12px] text-ink">
                    stripe:mock
                  </span>
                  . Production is never called.
                </p>

                <div className="mt-4 rounded-lg border border-rule bg-paper-2 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <code className="min-w-0 truncate font-mono text-[11px] text-ink-soft">
                      sluice replay {record.id} --branch fix
                    </code>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="shrink-0 font-mono text-[10px] text-ink-faint underline decoration-rule-strong underline-offset-2 hover:text-ink"
                    >
                      {isCopied ? "copied" : "copy"}
                    </button>
                  </div>
                </div>

                <div className="mt-5">
                  {isRunning ? (
                    <p
                      aria-live="polite"
                      className="font-mono text-[11px] text-ink-faint"
                    >
                      replaying {record.spans.length} spans · identical bytes…
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsRunning(true)}
                      className="inline-flex h-10 items-center gap-2 rounded-full bg-signal px-5 text-[13px] font-medium text-paper transition-colors hover:bg-signal-deep"
                    >
                      <Play aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                      Replay this capture
                    </button>
                  )}
                </div>

                <div aria-live="polite">
                  {hasResult && !isRunning ? (
                    <div className="mt-5 overflow-hidden rounded-lg border border-rule">
                      <div className="flex items-center justify-between border-b border-rule bg-paper-2 px-3 py-2 font-mono text-[10px] text-ink-faint uppercase">
                        <span>sandbox result</span>
                        <span className="text-ok">pass</span>
                      </div>
                      <div className="space-y-1.5 px-3 py-3 font-mono text-[11px]">
                        <p className="flex justify-between gap-3">
                          <span className="text-ink-faint">status</span>
                          <span>
                            <span className="text-signal line-through">
                              {record.status}
                            </span>{" "}
                            <span className="text-ok">200</span>
                          </span>
                        </p>
                        <p className="flex justify-between gap-3">
                          <span className="text-ink-faint">wall</span>
                          <span className="text-ink-soft tabular-nums">
                            {formatDuration(record.durationMs)} →{" "}
                            <span className="text-ink">{formatDuration(fixedMs)}</span>
                          </span>
                        </p>
                        <p className="flex justify-between gap-3">
                          <span className="text-ink-faint">side effects</span>
                          <span className="text-ink-soft">0 rows committed</span>
                        </p>
                      </div>
                      <div className="space-y-1 border-t border-rule px-3 py-2.5 font-mono text-[10px]">
                        <p className="text-signal">
                          − stripe.charge timed out after 1147ms
                        </p>
                        <p className="text-ok">
                          + stripe.charge retried once, settled in 118ms
                        </p>
                        <p className="text-ink-faint">
                          = response body identical apart from order_id
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>

                <p className="mt-5 flex items-center gap-2 font-mono text-[10px] text-ink-faint">
                  <Kbd>j</Kbd>
                  <Kbd>k</Kbd>
                  move between captures
                </p>
              </section>
            ) : null}
          </div>

          <div className="shrink-0 border-t border-rule bg-paper-2 px-5 py-3 font-mono text-[10px] text-ink-faint">
            <span className="text-ink-soft">{record.id}</span> ·{" "}
            {record.at} · press <Kbd>esc</Kbd> to close
          </div>
        </>
      ) : null}
    </dialog>
  );
}
