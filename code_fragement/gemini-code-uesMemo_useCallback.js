// 子组件使用了 React.memo
const ExpensiveChild = React.memo(({ onDelete }) => {
  console.log("子组件渲染了"); // 如果不加 useCallback，父组件无论改变什么，这里都会打印
  return <button onClick={onDelete}>删除</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // 必须使用 useCallback 锁定函数地址，否则 ExpensiveChild 的 memo 会失效
  const handleDelete = useCallback(() => {
    // 处理删除逻辑
  }, []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveChild onDelete={handleDelete} />
    </div>
  );
}