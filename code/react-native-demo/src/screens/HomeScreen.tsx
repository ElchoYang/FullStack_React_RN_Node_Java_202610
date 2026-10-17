import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';

export function HomeScreen() {
  const [count, setCount] = useState(0);
  const [list, setList] = useState<string[]>([
    '跨平台组件：View、Text、ScrollView',
    '状态与交互：useState、TouchableOpacity',
    '样式系统：StyleSheet (Flexbox 弹性布局)',
  ]);
  const [inputTask, setInputTask] = useState('');

  const handleAddItem = () => {
    const newItem = `新特性任务 #${list.length + 1} (已添加)`;
    setList([...list, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 顶部标题区 */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>React Native v0.88</Text>
        </View>
        <Text style={styles.title}>React Native 原生项目</Text>
        <Text style={styles.subtitle}>
          当前运行平台: <Text style={styles.platformHighlight}>{Platform.OS.toUpperCase()}</Text>
        </Text>
      </View>

      {/* 计数器卡片 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔢 交互计数器 (State 体验)</Text>
        <View style={styles.counterRow}>
          <TouchableOpacity
            style={[styles.button, styles.btnSecondary]}
            onPress={() => setCount(c => c - 1)}
          >
            <Text style={styles.buttonText}>-1</Text>
          </TouchableOpacity>
          <Text style={styles.counterText}>{count}</Text>
          <TouchableOpacity
            style={[styles.button, styles.btnPrimary]}
            onPress={() => setCount(c => c + 1)}
          >
            <Text style={styles.buttonText}>+1</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 特性展示卡片 */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>📱 核心特性列表</Text>
          <TouchableOpacity style={styles.addBtn} onPress={handleAddItem}>
            <Text style={styles.addBtnText}>+ 添加一条</Text>
          </TouchableOpacity>
        </View>

        {list.map((item, idx) => (
          <View key={idx} style={styles.listItem}>
            <Text style={styles.listItemText}>• {item}</Text>
            <TouchableOpacity onPress={() => handleRemoveItem(idx)}>
              <Text style={styles.deleteText}>删除</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* 平台信息提示 */}
      <View style={[styles.card, styles.infoCard]}>
        <Text style={styles.infoTitle}>💡 跨平台提示</Text>
        <Text style={styles.infoText}>
          当前界面的所有组件均为标准的 React Native 基础组件，同一套代码可直接在 Android、iOS 移动真机与 Web 浏览器端无缝运行。
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 8,
  },
  badgeText: {
    color: '#4338ca',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  platformHighlight: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  counterText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    minWidth: 50,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnPrimary: {
    backgroundColor: '#2563eb',
  },
  btnSecondary: {
    backgroundColor: '#64748b',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addBtn: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  addBtnText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '500',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  listItemText: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
  },
  deleteText: {
    color: '#ef4444',
    fontSize: 13,
    marginLeft: 10,
  },
  infoCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#15803d',
    lineHeight: 18,
  },
});
