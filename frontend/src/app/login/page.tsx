import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import LoginForm from "@/components/forms/login-form";

export default function Page() {
    return (
        <div className={'container mx-auto max-w-7xl my-8'}>
            <Card className={'max-w-xl mx-auto'}>
                <CardHeader>
                    <CardTitle>Access your workspace</CardTitle>
                </CardHeader>
                <CardContent>
                    <LoginForm/>
                </CardContent>
            </Card>
        </div>
    );
}