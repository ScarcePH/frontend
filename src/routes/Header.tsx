import { Navigate, Outlet } from 'react-router'
import LoadingScreen from '@/features/LoadingScreen'
import { useAuthCheck } from '@/features/auth/hooks/useAuth'
import { PublicHeader } from '@/features/public/PublicHeader'
import { UserHeader } from '@/features/public/UserHeader'
import { SocialFooter } from '@/features/public/components/SocialFooter'

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
    <div className="storefront flex min-h-dvh flex-col bg-background">
      <div className="w-full flex-1">
        { data?.user?.role === 'user' ?  
          <UserHeader user={data.user.email} /> 
          : 
          <PublicHeader/>

        }
        <Outlet/>
      </div>
      <SocialFooter />
    </div>
  ) 
}
