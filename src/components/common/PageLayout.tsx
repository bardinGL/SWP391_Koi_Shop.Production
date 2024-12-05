import React from 'react'

interface PageLayoutProps {
  children: React.ReactNode
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-wrap justify-center items-center w-full">
      <div className="w-[1280px]">{children}</div>
    </div>
  )
}

export default PageLayout
