"use client"

import React, { use } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Book, Compass, LayoutDashboard, PencilRulerIcon, UserCircle2Icon, WalletCards } from 'lucide-react'
import { usePathname } from 'next/navigation'
import AddNewCourseDialog from './AddNewCourseDialog'

const SidebarOptions = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/workspace',
  },
  {
    title: 'My Learning',
    icon: Book,
    path: '/workspace/my-learning',
  },
  {
    title: 'Explore Courses',
    icon: Compass,
    path: '/workspace/explore',
  },
  {
    title: 'Billing',
    icon: WalletCards,
    path: '/workspace/billing',
  },
  {
    title: 'Profile',
    icon: UserCircle2Icon,
    path: '/workspace/profile',
  },
]

function AppSidebar() {

    const path=usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="pb-5">
        <Image src="/logo2.png" alt="logo" width={190} height={190} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <AddNewCourseDialog>
<Button className="transition-transform duration-150 active:scale-95 active:shadow-lg">
  + Create new Course
</Button>
          </AddNewCourseDialog>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {SidebarOptions.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild className={'p-5'}>
                    <Link href={item.path} className={`text-[17px] font-medium 
                        ${path.includes(item.path) && 'text-primary bg-purple-50'}`}>
                      <item.icon className="mr-2 h-7 w-7 font-medium" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  )
}

export default AppSidebar
