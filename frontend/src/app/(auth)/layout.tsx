import {AppSidebar} from "@/components/app-sidebar";
import {SiteHeader} from "@/components/site-header";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {ReactNode} from "react";
import {getAuthUser} from "@/actions/auth";
import {ScrollArea} from "@/components/ui/scroll-area";


export default async function Layout({children}: { children: ReactNode }) {
  const user = await getAuthUser();

  return (
    <SidebarProvider>
      <AppSidebar user={user.data!} variant="inset"/>
      <SidebarInset>
        <SiteHeader/>
        <ScrollArea className={'max-h-[94vh]'}>
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                {children}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
