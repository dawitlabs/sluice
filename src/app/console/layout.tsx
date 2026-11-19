import { ConsoleLayoutShell } from "@/features/console/console-frame";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConsoleLayoutShell>{children}</ConsoleLayoutShell>;
}
