import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, Download } from 'lucide-react';
import Logo from '../../components/Logo';
import { loginBg } from '@/assets/images';
import { useLogin } from '../../lib/hooks/useLogin';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync({ email, password });
      // After successful login, navigate to the intended page
      navigate(from, { replace: true });
    } catch (error) {
      // Error handling is managed by the mutation
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - City Background */}
      <div className="relative hidden w-1/2 lg:block">
        <img
          src={loginBg}
          alt="MetroWheel bikes in urban environment"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 to-primary-800/60" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center">
            <Logo className="mb-8" />
            <h1 className="text-4xl font-bold text-white font-display">
              Your Urban Mobility Partner
            </h1>
            <p className="mt-4 text-xl text-white/90">
              Start your sustainable journey with MetroWheel
            </p>
            <div className="mt-8 flex items-center justify-center space-x-6 text-white/80">
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm">Stations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm">Bikes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm">Service</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full items-center justify-center px-4 sm:px-6 lg:w-1/2 lg:px-8">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Logo />
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Globe className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-display">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign up
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {loginMutation.isError && (
              <div className="bg-error/10 text-error text-sm p-3 rounded-md">
                Invalid email or password. Please try again.
              </div>
            )}

            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loginMutation.isPending}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 