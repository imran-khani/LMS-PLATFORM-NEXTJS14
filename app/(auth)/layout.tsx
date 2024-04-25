
interface AuthLayoutProps {
    children: React.ReactNode
}


const AuthLayout:React.FC<AuthLayoutProps> = ({children}) => {
  return (
    <div className="flex h-full items-center justify-center">
        {children}
    </div>
  )
}

export default AuthLayout