import { Card, Steps, Tag } from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { FlowStep } from '@/api/architecture.api';

export function FlowTimeline({ steps }: { steps: FlowStep[] }) {
  const getStepItem = (st: FlowStep) => {
    let icon = <ClockCircleOutlined />;
    let tagColor = 'blue';
    let statusLabel = 'Pending 挂起态';

    if (st.status === 'resolved') {
      icon = <CheckCircleOutlined className="text-emerald-500" />;
      tagColor = 'success';
      statusLabel = 'Fulfilled 成功态';
    } else if (st.status === 'rejected') {
      icon = <CloseCircleOutlined className="text-rose-500" />;
      tagColor = 'error';
      statusLabel = 'Rejected 异常态';
    } else if (st.status === 'transition') {
      icon = <SyncOutlined spin className="text-purple-500" />;
      tagColor = 'purple';
      statusLabel = 'Transition 刷新态';
    }

    return {
      title: (
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 text-sm">{st.title}</span>
          <Tag color={tagColor} className="m-0 text-[10px]">
            {statusLabel}
          </Tag>
        </div>
      ),
      description: (
        <div className="mt-1 space-y-2 pb-4">
          <p className="text-xs text-slate-600 m-0 leading-relaxed">{st.detail}</p>
          <div className="bg-slate-900 rounded-xl p-3 font-mono text-[11px] text-slate-200 overflow-x-auto shadow-inner border border-slate-800">
            <pre className="m-0">
              <code>{st.codeSnippet}</code>
            </pre>
          </div>
        </div>
      ),
      icon,
    };
  };

  return (
    <Card
      bordered={false}
      className="shadow-xs rounded-2xl"
      title={<span className="text-base font-bold text-slate-900">React 19 异步执行与状态全生命周期</span>}
      extra={
        <Tag color="geekblue" className="font-mono">
          Native Lifecycle
        </Tag>
      }
    >
      <Steps
        direction="vertical"
        current={4}
        items={steps.map(getStepItem)}
        className="pt-2"
      />
    </Card>
  );
}
