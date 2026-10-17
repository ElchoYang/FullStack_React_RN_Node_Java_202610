import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Mail, AlertCircle, LogIn, ShieldCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取登录前用户原本试图访问的目标路径
  const fromLocation = (location.state as { from?: { pathname?: string } })
    ?.from;
  const from = fromLocation?.pathname || "/dashboard";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("请输入邮箱与登录密码");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login({ email, password });
      // 登录成功重定向回原访问页面
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "登录失败，请检查账号密码";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-md font-bold text-xl">
            R
          </div>
          <h2 className="text-2xl font-bold text-gray-900">系统管理后台登录</h2>
          <p className="text-sm text-gray-500 mt-1">
            Week 2 生产级 React 鉴权演示
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱账号
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              登录密码
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 transition cursor-pointer"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>立即登录</span>
              </>
            )}
          </button>
        </form>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs text-gray-500 space-y-1 text-center">
          <div className="flex items-center justify-center space-x-1.5 text-slate-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>默认演示账号</span>
          </div>
          <div>
            账号:{" "}
            <span className="font-semibold text-gray-800">
              admin@example.com
            </span>{" "}
            / 密码: <span className="font-semibold text-gray-800">123456</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
