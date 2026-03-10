import { Link, useLocation } from 'react-router-dom'

function NavBar() {
  const location = useLocation()

  const tabs = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/log', label: 'Log Run', icon: '➕' },
    { path: '/history', label: 'History', icon: '📋' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around py-3">
      {tabs.map(tab => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`flex flex-col items-center text-xs gap-1 ${
            location.pathname === tab.path ? 'text-blue-400' : 'text-gray-500'
          }`}
        >
          <span className="text-2xl">{tab.icon}</span>
          <span>{tab.label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default NavBar