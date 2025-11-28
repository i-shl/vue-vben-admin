<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { Button, Card, message, Space, Tag } from 'ant-design-vue';
import Push from 'push.js';

defineOptions({ name: 'ExampleDesktopNotification' });

const notificationHistory = ref<
  Array<{
    body?: string;
    id: number;
    time: string;
    title: string;
    type: string;
  }>
>([]);

const permission = ref<'default' | 'denied' | 'granted'>('default');
const isSupported = ref(false);

// 检查浏览器支持
function checkSupport() {
  isSupported.value = 'Notification' in window;
  if (isSupported.value) {
    permission.value = Notification.permission as
      | 'default'
      | 'denied'
      | 'granted';
  }
}

const permissionText = computed(() => {
  switch (permission.value) {
    case 'denied': {
      return '已拒绝';
    }
    case 'granted': {
      return '已授权';
    }
    default: {
      return '未授权';
    }
  }
});

const permissionColor = computed(() => {
  switch (permission.value) {
    case 'denied': {
      return 'error';
    }
    case 'granted': {
      return 'success';
    }
    default: {
      return 'warning';
    }
  }
});

// 获取类型颜色
function getTypeColor(type: string): string {
  switch (type) {
    case '信息': {
      return 'processing';
    }
    case '成功': {
      return 'success';
    }
    case '警告': {
      return 'warning';
    }
    case '错误': {
      return 'error';
    }
    default: {
      return 'default';
    }
  }
}

// 添加通知历史记录
function addHistory(type: string, title: string, body?: string) {
  notificationHistory.value.unshift({
    body,
    id: Date.now(),
    time: new Date().toLocaleString('zh-CN'),
    title,
    type,
  });
  // 只保留最近 10 条
  if (notificationHistory.value.length > 10) {
    notificationHistory.value = notificationHistory.value.slice(0, 10);
  }
}

// 检查是否有权限
function hasPermission(): boolean {
  return Push.Permission.has();
}

// 请求权限
async function handleRequestPermission() {
  try {
    await Push.Permission.request();
    checkSupport();
    // 检查权限状态
    if (Push.Permission.has()) {
      message.success('权限请求成功');
    } else {
      message.warning('用户拒绝了通知权限');
    }
  } catch (error: any) {
    message.error(`请求权限失败: ${error.message}`);
  }
}

// 基础通知
function handleBasicNotify() {
  Push.create('基础通知', {
    body: '这是一个基础桌面通知示例',
    icon: '/favicon.ico',
    onClick: () => {
      message.info('通知被点击了');
      window.focus();
    },
    timeout: 5000,
  });
  addHistory('基础通知', '基础通知', '这是一个基础桌面通知示例');
}

// 成功通知
function handleSuccessNotify() {
  Push.create('操作成功', {
    body: '数据已成功保存到服务器',
    icon: '/favicon.ico',
    tag: 'success',
    timeout: 5000,
  });
  addHistory('成功', '操作成功', '数据已成功保存到服务器');
}

// 错误通知
function handleErrorNotify() {
  Push.create('操作失败', {
    body: '网络连接异常，请检查网络设置',
    icon: '/favicon.ico',
    tag: 'error',
    timeout: 5000,
  });
  addHistory('错误', '操作失败', '网络连接异常，请检查网络设置');
}

// 警告通知
function handleWarningNotify() {
  Push.create('注意', {
    body: '您的账户将在 7 天后过期，请及时续费',
    icon: '/favicon.ico',
    tag: 'warning',
    timeout: 5000,
  });
  addHistory('警告', '注意', '您的账户将在 7 天后过期，请及时续费');
}

// 信息通知
function handleInfoNotify() {
  Push.create('新消息', {
    body: '您收到了一条新消息，点击查看详情',
    icon: '/favicon.ico',
    onClick: () => {
      message.info('跳转到消息页面');
      window.focus();
    },
    tag: 'info',
    timeout: 5000,
  });
  addHistory('信息', '新消息', '您收到了一条新消息，点击查看详情');
}

// 需要交互的通知
function handleRequireInteractionNotify() {
  Push.create('重要通知', {
    body: '此通知需要您手动关闭',
    icon: '/favicon.ico',
    requireInteraction: true,
  });
  addHistory('重要通知', '重要通知', '此通知需要您手动关闭');
}

// 通知去重示例
function handleTagNotify() {
  const tag = 'new-message';
  Push.create('新消息', {
    body: '您有 1 条新消息',
    icon: '/favicon.ico',
    tag,
    timeout: 5000,
  });
  addHistory('去重通知', '新消息', '您有 1 条新消息');

  // 3 秒后发送相同 tag 的通知，会替换之前的通知
  setTimeout(() => {
    Push.create('新消息', {
      body: '您有 3 条新消息',
      icon: '/favicon.ico',
      tag,
      timeout: 5000,
    });
    addHistory('去重通知', '新消息', '您有 3 条新消息（替换了之前的通知）');
  }, 3000);
}

// 自定义持续时间
function handleCustomDurationNotify() {
  Push.create('自定义持续时间', {
    body: '此通知将在 10 秒后自动关闭',
    icon: '/favicon.ico',
    timeout: 10_000,
  });
  addHistory('自定义', '自定义持续时间', '此通知将在 10 秒后自动关闭');
}

// 带回调的通知
function handleCallbackNotify() {
  Push.create('带回调的通知', {
    body: '查看控制台了解回调信息',
    icon: '/favicon.ico',
    onClick: () => {
      console.warn('通知被点击');
      message.info('通知被点击（查看控制台）');
      window.focus();
    },
    timeout: 5000,
  });
  addHistory('回调', '带回调的通知', '查看控制台了解回调信息');
}

// 页面可见性检测
function handleVisibilityNotify() {
  if (document.hidden) {
    // 页面不可见时，发送桌面通知
    Push.create('页面不可见通知', {
      body: '当前页面在后台，这是桌面通知',
      icon: '/favicon.ico',
      timeout: 5000,
    });
    addHistory('可见性', '页面不可见通知', '当前页面在后台，这是桌面通知');
  } else {
    // 页面可见时，使用页面内提示
    message.info('当前页面可见，使用页面内提示');
    addHistory('可见性', '页面可见', '当前页面可见，使用页面内提示');
  }
}

onMounted(() => {
  checkSupport();
  if (!isSupported.value) {
    message.warning('您的浏览器不支持桌面通知功能');
  }
});
</script>

<template>
  <div class="space-y-6 p-6">
    <!-- 权限状态 -->
    <Card title="权限状态">
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <span>浏览器支持:</span>
          <Tag :color="isSupported ? 'success' : 'error'">
            {{ isSupported ? '支持' : '不支持' }}
          </Tag>
        </div>
        <div class="flex items-center gap-4">
          <span>通知权限:</span>
          <Tag :color="permissionColor">
            {{ permissionText }}
          </Tag>
        </div>
        <div v-if="!hasPermission() && isSupported">
          <Button type="primary" @click="handleRequestPermission">
            请求通知权限
          </Button>
          <p class="mt-2 text-sm text-muted-foreground">
            首次使用需要用户授权，授权后即可发送桌面通知
          </p>
        </div>
      </div>
    </Card>

    <!-- 基础示例 -->
    <Card title="基础示例">
      <Space wrap>
        <Button
          :disabled="!hasPermission()"
          type="primary"
          @click="handleBasicNotify"
        >
          基础通知
        </Button>
        <Button
          :disabled="!hasPermission()"
          type="primary"
          @click="handleSuccessNotify"
        >
          成功通知
        </Button>
        <Button :disabled="!hasPermission()" danger @click="handleErrorNotify">
          错误通知
        </Button>
        <Button :disabled="!hasPermission()" @click="handleWarningNotify">
          警告通知
        </Button>
        <Button :disabled="!hasPermission()" @click="handleInfoNotify">
          信息通知
        </Button>
      </Space>
    </Card>

    <!-- 高级功能 -->
    <Card title="高级功能">
      <Space wrap>
        <Button
          :disabled="!hasPermission()"
          @click="handleRequireInteractionNotify"
        >
          需要交互的通知
        </Button>
        <Button :disabled="!hasPermission()" @click="handleTagNotify">
          通知去重示例
        </Button>
        <Button
          :disabled="!hasPermission()"
          @click="handleCustomDurationNotify"
        >
          自定义持续时间
        </Button>
        <Button :disabled="!hasPermission()" @click="handleCallbackNotify">
          带回调的通知
        </Button>
        <Button :disabled="!hasPermission()" @click="handleVisibilityNotify">
          页面可见性检测
        </Button>
      </Space>
    </Card>

    <!-- 通知历史 -->
    <Card title="通知历史">
      <div
        v-if="notificationHistory.length === 0"
        class="text-muted-foreground"
      >
        暂无通知历史
      </div>
      <div v-else class="space-y-2">
        <div
          v-for="item in notificationHistory"
          :key="item.id"
          class="rounded border border-border bg-card p-3"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Tag :color="getTypeColor(item.type)">
                {{ item.type }}
              </Tag>
              <span class="font-semibold">{{ item.title }}</span>
            </div>
            <span class="text-sm text-muted-foreground">{{ item.time }}</span>
          </div>
          <div v-if="item.body" class="mt-2 text-sm text-muted-foreground">
            {{ item.body }}
          </div>
        </div>
      </div>
    </Card>

    <!-- 使用说明 -->
    <Card title="使用说明">
      <div class="space-y-2 text-sm">
        <p>
          <strong>1. 权限请求：</strong>
          首次使用需要用户授权，点击"请求通知权限"按钮即可。
        </p>
        <p>
          <strong>2. 基础使用：</strong>
          使用
          <code class="rounded bg-muted px-1">Push.create()</code>
          方法创建通知。
        </p>
        <p>
          <strong>3. 常用选项：</strong>
        </p>
        <ul class="ml-6 list-disc space-y-1">
          <li><code class="rounded bg-muted px-1">body</code> - 通知内容</li>
          <li><code class="rounded bg-muted px-1">icon</code> - 通知图标</li>
          <li>
            <code class="rounded bg-muted px-1">timeout</code>
            - 自动关闭时间（毫秒）
          </li>
          <li>
            <code class="rounded bg-muted px-1">tag</code>
            - 通知标签（相同 tag 会替换旧通知）
          </li>
          <li><code class="rounded bg-muted px-1">onClick</code> - 点击回调</li>
        </ul>
        <p>
          <strong>4. 注意事项：</strong>
        </p>
        <ul class="ml-6 list-disc space-y-1">
          <li>生产环境必须使用 HTTPS（localhost 除外）</li>
          <li>用户拒绝权限后，需要手动在浏览器设置中开启</li>
          <li>建议在页面不可见时使用桌面通知，页面可见时使用页面内提示</li>
          <li>
            使用
            <code class="rounded bg-muted px-1">push.js</code>
            npm 包
          </li>
        </ul>
      </div>
    </Card>
  </div>
</template>
