import React from 'react'



const Footer: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
  return (
    <div className={`fixed flex items-center justify-between bottom-0 bg-gray-800 w-full text-white py-4 mt-8 ${
				isCollapsed ? 'w-16' : 'w-64'
			}`}>
      
        <div className={`flex items-center  ${isCollapsed ? 'justify-center' : 'justify-between'} p-2`}>
            <span className="text-sm">© {year} Your School Name</span>
        </div>
            {/* Powered Company */}
            <div className={`flex items-center  ${isCollapsed ? 'justify-center' : 'justify-between'} p-2`}>
            <span className="text-sm">Powered by CodeSphere Technologies</span>
        </div>
    </div>
  )
}
export default Footer
