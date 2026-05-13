import { Navigate, Outlet } from 'react-router'
import LoadingScreen from '@/features/LoadingScreen'
import { useAuthCheck } from '@/features/auth/hooks/useAuth'
import { PublicHeader } from '@/features/public/PublicHeader'
import { UserHeader } from '@/features/public/UserHeader'

export const Header: React.FC = () => {
  const { data, isLoading } = useAuthCheck()

  if (isLoading) {
    return <LoadingScreen 
      msg="Getting things ready…"
    />
  }

  if (data?.user?.role === 'super_admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  return  (
    <div className="min-h-dvh bg-background">
      <div className="w-full">
        { data?.user?.role === 'user' ?  
          <UserHeader user={data.user.email} /> 
          : 
          <PublicHeader/>

        }
        <Outlet/>
      </div>
    </div>
  ) 
}
