export default function ConsoleTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ animation: "rise 260ms var(--ease-expo) both" }}>
      {children}
    </div>
  );
}
