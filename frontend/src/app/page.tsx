import LoginForm from "@/components/forms/login-form";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Card className={'min-w-md'}>
            <CardHeader>
                <CardTitle>Access your workspace</CardTitle>
            </CardHeader>
            <CardContent>
                <LoginForm/>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
