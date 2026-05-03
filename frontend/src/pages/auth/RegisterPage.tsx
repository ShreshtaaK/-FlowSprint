import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Zap, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { registerApi } from '../../services/auth.service'

const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required').min(2, 'Min 2 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

type RegisterForm = z.infer<typeof registerSchema>

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true)
      const response = await registerApi(data)
      login(response.token, response.user)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      const message = err.response?.data?.message || 'Registration failed. Try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-indigo-600 via-purple-600 to-blue-700 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Zap className="text-white w-6 h-6" />
          </div>
          <span className="text-white text-xl font-bold">FlowSprint</span>
        </div>
        <div>
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            Start managing<br />smarter today.
          </h1>
          <p className="text-indigo-200 text-lg mb-8">
            Join thousands of teams already using FlowSprint.
          </p>
          <div className="space-y-3">
            {[
              'Kanban boards with drag and drop',
              'Real-time team collaboration',
              'Advanced analytics dashboard',
              'Role-based access control'
            ].map(feature => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle className="text-indigo-300 w-5 h-5 shrink-0" />
                <span className="text-indigo-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/10 rounded-2xl p-6">
          <p className="text-white italic mb-3">
            "FlowSprint transformed how our team collaborates."
          </p>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-400 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <div>
              <div className="text-white text-sm font-medium">Sarah K.</div>
              <div className="text-indigo-300 text-xs">Product Manager</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Zap className="text-white w-5 h-5" />
            </div>
            <span className="text-white text-xl font-bold">FlowSprint</span>
          </div>
          <div className="mb-8">
            <h2 className="text-white text-3xl font-bold mb-2">Create your account</h2>
            <p className="text-slate-400">Get started for free. No credit card required.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Full name</label>
              <input
                {...register('name')}
                type="text"
                placeholder="John Doe"
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Email address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="john@example.com"
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 chars, 1 uppercase, 1 number"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Confirm password</label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
                  Creating account...
                </>
              ) : 'Create account'}
            </button>
          </form>
          <p className="text-slate-400 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage