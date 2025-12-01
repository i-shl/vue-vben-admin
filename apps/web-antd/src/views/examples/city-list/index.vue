<script lang="ts" setup>
import type { CityApi } from '#/api/core/city';

import { ref } from 'vue';

import { Button, Card, InputNumber, message, Table } from 'ant-design-vue';

import { getCityListApi } from '#/api/core/city';

defineOptions({ name: 'ExampleCityList' });

// 请求参数
const parentId = ref<number>(110_100);

// 响应数据
const cityList = ref<CityApi.CityItem[]>([]);
const loading = ref(false);

// 表格列定义
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 100,
  },
  {
    title: '城市名称',
    dataIndex: 'name',
    key: 'name',
  },
];

// 获取城市列表
async function handleGetCityList() {
  try {
    loading.value = true;
    cityList.value = [];

    // 调用接口
    const result = await getCityListApi({
      parent_id: parentId.value,
    });

    // 显示响应数据
    cityList.value = result || [];
    message.success('获取城市列表成功');
  } catch (error: any) {
    // 显示错误信息
    console.error('获取城市列表失败:', error);
    message.error(error?.message || '获取城市列表失败');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="space-y-4 p-6">
    <Card>
      <template #title>城市列表接口测试</template>
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <span>父级ID：</span>
          <InputNumber v-model:value="parentId" :min="1" />
          <Button type="primary" :loading="loading" @click="handleGetCityList">
            获取城市列表
          </Button>
        </div>

        <div v-if="cityList.length > 0">
          <div class="mb-2 font-semibold">城市列表数据：</div>
          <Table
            :columns="columns"
            :data-source="cityList"
            :loading="loading"
            :pagination="false"
            row-key="id"
          />
        </div>
        <div v-else-if="!loading" class="text-muted-foreground">
          暂无数据，请点击按钮调用接口
        </div>
      </div>
    </Card>
  </div>
</template>
