import { useState } from 'react';
import { Card, Col, Rate, Row, Segmented, Tag, Button, Badge, Modal, message } from 'antd';
import { ShoppingCartOutlined, TagsOutlined, AlertOutlined } from '@ant-design/icons';
import type { ProductItem } from '@/api/product.api';
import { useI18n } from '@/context/I18nContext';

interface ProductGridProps {
  products: ProductItem[];
  categories: string[];
}

export function ProductGrid({ products, categories }: ProductGridProps) {
  const { t } = useI18n();
  const [selectedCat, setSelectedCat] = useState('全部');

  const filtered =
    selectedCat === '全部' ? products : products.filter((p) => p.category === selectedCat);

  const handleStockAction = (prod: ProductItem) => {
    if (prod.status === 'out_of_stock') {
      Modal.confirm({
        title: `缺货预警登记 - ${prod.name}`,
        icon: <AlertOutlined className="text-amber-500" />,
        content: '已将此商品加入采购加急跟进工单，并通知仓储部门？',
        okText: '确认提单',
        cancelText: '暂不处理',
        onOk: () => {
          message.success(`已为 [${prod.sku}] 建立采购加急跟进单！`);
        },
      });
    } else {
      Modal.confirm({
        title: `入库与货位调度 - ${prod.name}`,
        content: `当前库存：${prod.stock} 件。是否发起下一批次补货与分拣任务？`,
        okText: '发起调度任务',
        cancelText: '取消',
        onOk: () => {
          message.success(`已为 [${prod.sku}] 创建仓库补货分拣任务！`);
        },
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* 分类快捷切换 (Ant Design Segmented) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Segmented
          options={categories.map((c) => (c === '全部' ? t('common.all') : c))}
          value={selectedCat === '全部' ? t('common.all') : selectedCat}
          onChange={(val) => {
            const chosen = val === t('common.all') ? '全部' : (val as string);
            setSelectedCat(chosen);
          }}
          size="middle"
        />
      </div>

      {/* 商品卡片网格 (使用变量插值 t('product.inStock', { stock })) */}
      <Row gutter={[16, 16]}>
        {filtered.map((prod) => {
          const ribbonColor =
            prod.status === 'low_stock' ? 'orange' : prod.status === 'out_of_stock' ? 'red' : 'green';
          const ribbonText =
            prod.status === 'low_stock'
              ? t('product.lowStock', { stock: prod.stock })
              : prod.status === 'out_of_stock'
              ? t('product.outOfStock')
              : t('product.inStock', { stock: prod.stock });

          return (
            <Col xs={24} sm={12} lg={8} key={prod.id}>
              <Badge.Ribbon text={ribbonText} color={ribbonColor}>
                <Card
                  variant="borderless"
                  className="shadow-xs hover:shadow-md transition h-full flex flex-col justify-between rounded-2xl"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <Tag icon={<TagsOutlined />} color="default">
                        {prod.sku}
                      </Tag>
                      <div className="flex items-center gap-1">
                        <Rate disabled defaultValue={prod.rating} allowHalf style={{ fontSize: 13 }} />
                        <span className="font-semibold text-slate-700 text-xs">{prod.rating}</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-800 leading-snug mb-3 hover:text-blue-600 transition">
                      {prod.name}
                    </h4>

                    <div className="mb-4">
                      <Tag color="blue">{prod.category}</Tag>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {t('product.soldCount', { count: prod.sales })}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xs text-slate-400">单价 </span>
                      <span className="text-xl font-bold text-slate-900">¥{prod.price}</span>
                    </div>
                    <Button
                      type={prod.status === 'out_of_stock' ? 'default' : 'primary'}
                      danger={prod.status === 'out_of_stock'}
                      size="small"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleStockAction(prod)}
                    >
                      {prod.status === 'out_of_stock'
                        ? t('product.shortageBtn')
                        : t('product.dispatchBtn')}
                    </Button>
                  </div>
                </Card>
              </Badge.Ribbon>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
