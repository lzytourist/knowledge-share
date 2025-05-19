import ProfileUpdateForm from "@/components/forms/profile-update-form";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {getAuthUser} from "@/actions/auth";
import PasswordUpdateForm from "@/components/forms/password-update-form";
import ProfileImageForm from "@/components/forms/profile-image-form";
import Image from "next/image";

export default async function Page() {
  const user = await getAuthUser();

  return (
    <div className={'space-y-6'}>
      <div className={'grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6'}>
        <Card className={'md:col-span-2 lg:col-span-3'}>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>You can update your profile information.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileUpdateForm user={user.data!}/>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileImageForm/>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordUpdateForm/>
        </CardContent>
      </Card>
    </div>
  );
}