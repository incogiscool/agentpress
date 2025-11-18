import { DocsButton } from "@/components/elements";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <PageLayout>
      <div className="flex items-center justify-center gap-12 flex-wrap">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">
            Turn your Next.js app AI native in minutes.
          </h1>
          <div className="flex gap-4">
            <Link href={"/signin"}>
              <Button>Get Started</Button>
            </Link>
            <DocsButton variant={"text"} />
          </div>
        </div>

        <div className="w-[600px]">
          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: "0",
            }}
          >
            <iframe
              src="https://www.loom.com/embed/d85d308cfecb46b083bc819856037977"
              frameBorder="0"
              allowFullScreen
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
              }}
            ></iframe>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
