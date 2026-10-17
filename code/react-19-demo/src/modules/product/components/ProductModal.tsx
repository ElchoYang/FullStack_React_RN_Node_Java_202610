import { useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Rate, Select, message } from 'antd';
import type { ProductItem } from '@/api/product.api';

interface ProductModalProps {
  open: boolean;
  categories?: string[];
  onCancel: () => void;
  onSuccess: (item: Partial<ProductItem>) => void;
}

const DEFAULT_CATEGORIES = ['数码智能', '办公外设', '网络通信', '智能家居', '配件耗材'];

export function ProductModal({
  open,
  categories = [],
  onCancel,
  onSuccess,
}: ProductModalProps) {
  const [form] = Form.useForm();

  const safeCategories = Array.isArray(categories) && categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const validCategories = safeCategories.filter((c) => c !== '全部');

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        category: validCategories[0] || '数码智能',
        price: 999,
        stock: 50,
        rating: 5,
        status: 'in_stock',
      });
    }
  }, [open, validCategories, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      message.success('新建商品成功并录入仓库！');
      onSuccess(values);
      onCancel();
    } catch {
      // 校验失败
    }
  };

  return (
    <Modal
      title="新建商品 SKU 档案"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="确认录入"
      cancelText="取消"
    >
      <Form form={form} layout="vertical" className="pt-3">
        <Form.Item
          name="name"
          label="商品全称"
          rules={[{ required: true, message: '请输入商品名称' }]}
        >
          <Input placeholder="例如: NebulaSound 无线智能降噪耳机" />
        </Form.Item>

        <Form.Item
          name="sku"
          label="SKU 编号"
          rules={[{ required: true, message: '请输入 SKU 编号' }]}
        >
          <Input placeholder="例如: AUDIO-NS-PRO" />
        </Form.Item>

        <Form.Item
          name="category"
          label="所属品类"
          rules={[{ required: true, message: '请选择所属品类' }]}
        >
          <Select
            options={validCategories.map((c) => ({
              value: c,
              label: c,
            }))}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="price"
            label="单价 (元)"
            rules={[{ required: true, message: '请输入单价' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="stock"
            label="初始库存 (件)"
            rules={[{ required: true, message: '请输入库存' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <Form.Item name="rating" label="推荐评分 (1~5 星)">
          <Rate allowHalf defaultValue={5} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
