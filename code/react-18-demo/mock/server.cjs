const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// 自定义登录接口模拟
server.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@example.com' && password === '123456') {
    return res.status(200).json({
      token: `mock-jwt-token-${Date.now()}`,
      user: {
        id: 'admin-1',
        name: '系统管理员',
        email: 'admin@example.com',
        role: 'Admin',
        department: '技术研发中心',
      },
    });
  }
  return res.status(401).json({
    message: '账号或密码错误（默认演示账号：admin@example.com / 123456）',
  });
});

// 获取当前登录用户信息模拟
server.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未授权或 Token 已过期' });
  }
  return res.status(200).json({
    id: 'admin-1',
    name: '系统管理员',
    email: 'admin@example.com',
    role: 'Admin',
    department: '技术研发中心',
  });
});

// 挂载默认路由
server.use(router);

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`\n🚀 Mock 服务已启动: http://localhost:${PORT}`);
  console.log(`🔑 演示登录接口: POST http://localhost:${PORT}/login`);
  console.log(`📦 业务接口: GET/POST/PUT/DELETE http://localhost:${PORT}/users\n`);
});
