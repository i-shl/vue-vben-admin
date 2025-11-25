<script lang="ts" setup>
import type { AuthApi } from '#/api/core/auth';

import { ref } from 'vue';

import { Button, message } from 'ant-design-vue';

import { loginApi } from '#/api/core/auth';

defineOptions({ name: 'Analytics' });

// 请求数据（默认显示）
const requestData = ref<AuthApi.LoginParams>({
  username: 'admin',
  password: '123456',
});

// 响应数据
const responseData = ref<any>(null);
const loading = ref(false);

// 处理登录
const handleLogin = async () => {
  try {
    loading.value = true;
    responseData.value = null;

    // 调用登录接口
    const result = await loginApi(requestData.value);

    // 显示响应数据
    responseData.value = result;
    message.success('登录接口调用成功');
  } catch (error: any) {
    // 显示错误信息
    responseData.value = {
      error: true,
      message: error?.message || '请求失败',
      data: error?.response?.data || error,
    };
    message.error('登录接口调用失败');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="p-5">这是分析页面</div>
  <div class="p-5">打包后在dist目录执行http-server，接口正确</div>
  <div class="p-5">
    点击按钮调用登录接口的功能，默认显示请求数据，点击按钮后展现响应数据，响应数据需要显示在页面上。
    <Button type="primary" :loading="loading" @click="handleLogin">
      请求登录接口
    </Button>
  </div>
  <div class="p-5">
    <div class="mb-4">
      <div class="mb-2 font-semibold">请求数据：</div>
      <pre class="rounded bg-muted p-3 text-foreground">{{
        JSON.stringify(requestData, null, 2)
      }}</pre>
    </div>
    <div>
      <div class="mb-2 font-semibold">响应数据：</div>
      <div v-if="responseData" class="rounded bg-muted p-3">
        <pre class="text-foreground">{{
          JSON.stringify(responseData, null, 2)
        }}</pre>
      </div>
      <div v-else class="text-muted-foreground">
        暂无响应数据，请点击按钮调用接口
      </div>
    </div>
  </div>
</template>
