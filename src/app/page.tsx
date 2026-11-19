import { DemoNotice } from "@/components/demo-notice";
import { MotionProvider } from "@/components/motion-provider";
import { Bento } from "@/features/landing/bento";
import { Closing, Footer } from "@/features/landing/closing";
import { Hero } from "@/features/landing/hero";
import { Nav } from "@/features/landing/nav";
import { Pricing } from "@/features/landing/pricing";
import { Story } from "@/features/landing/story";
import { Ticker } from "@/features/landing/ticker";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-[13px] focus:text-paper"
      >
        Skip to content
      </a>
      <Nav />
      <DemoNotice />
      <main id="main">
        <Hero />
        <Ticker />
        <Story />
        <Bento />
        <Pricing />
        <Closing />
      </main>
      <Footer />
      <MotionProvider />
    </>
  );
}
