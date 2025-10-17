import { SidebarProvider,SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import AppSidebar from './components/AppSidebar'
import AppHeader from './components/AppHeader'

function WorkspaceProvider({children}) {
  return (
  <SidebarProvider>
    <AppSidebar />
    <div className='w-full'>

        <AppHeader />
        <div className='p-10'>
      {children}
      </div>
    </div>
    
    </SidebarProvider>

  )
}

export default WorkspaceProvider
