import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="flex flex-col">
          <h1 className={'text-7xl font-light mb-8'}>Welcome to Knowledge Share</h1>

          <Button asChild={true}>
              <Link href={'/login'}>Login</Link>
          </Button>
      </main>
    </div>
  );
}
