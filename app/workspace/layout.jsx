import React from 'react'
import WorkspaceProvider from './provider'
import AppSidebar from './components/AppSidebar'


function WorkspaceLayout({ children }) {
  return (
    <WorkspaceProvider>
      <div>
        <AppSidebar />
        <main >
          {children}
        </main>
      </div>
    </WorkspaceProvider>
  )
}

export default WorkspaceLayout
