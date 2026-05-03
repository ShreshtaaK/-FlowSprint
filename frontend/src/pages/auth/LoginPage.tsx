import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { loginApi } from '../../services/auth.service'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email'),
  password: z
    .string()
    .min(1, 'Password is required')
})

type LoginForm = z.infer<typeof loginSchema>

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true)
      const response = await loginApi(data)
      login(response.token, response.user)
      toast.success(`Welcome back, ${response.user.name}!`)
      navigate('/dashboard')
    } catch (error: unknown) {
  const err = error as { response?: { data?: { message?: string } } }
      const message = err.response?.data?.message || 'Login failed. Try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left side — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-indigo-600 via-purple-600 to-blue-700 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Zap className="text-white w-6 h-6" />
          </div>
          <span className="text-white text-xl font-bold">FlowSprint</span>
        </div>

        <div>
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            Collaborate.<br />Track.<br />Deliver.
          </h1>
          <p className="text-indigo-200 text-lg">
            The modern task manager built for high-performing teams.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Active Projects', value: '2,400+' },
            { label: 'Tasks Completed', value: '18,000+' },
            { label: 'Teams Using', value: '500+' },
            { label: 'Uptime', value: '99.9%' }
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-white/10 rounded-xl p-4"
            >
              <div className="text-white text-2xl font-bold">{stat.value}</div>
              <div className="text-indigo-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Zap className="text-white w-5 h-5" />
            </div>
            <span className="text-white text-xl font-bold">FlowSprint</span>
          </div>

          <div className="mb-8">
            <h2 className="text-white text-3xl font-bold mb-2">
              Welcome back
            </h2>
            <p className="text-slate-400">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="john@example.com"
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="text-slate-400 text-center mt-6">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage