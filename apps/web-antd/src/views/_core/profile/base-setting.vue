<script setup lang="ts">
import type { BasicOption } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';

import { computed, onMounted, ref } from 'vue';

import { ProfileBaseSetting } from '@vben/common-ui';

import { useUserStore } from '@vben/stores';

const profileBaseSettingRef = ref();
const userStore = useUserStore();

const MOCK_ROLES_OPTIONS: BasicOption[] = [
  {
    label: '管理员',
    value: 'super',
  },
  {
    label: '用户',
    value: 'user',
  },
  {
    label: '测试',
    value: 'test',
  },
];

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      fieldName: 'realName',
      component: 'Input',
      label: '姓名',
    },
    {
      fieldName: 'username',
      component: 'Input',
      label: '用户名',
    },
    {
      fieldName: 'roles',
      component: 'Select',
      componentProps: {
        mode: 'tags',
        options: MOCK_ROLES_OPTIONS,
      },
      label: '角色',
    },
    {
      fieldName: 'introduction',
      component: 'Textarea',
      label: '个人简介',
    },
  ];
});

onMounted(() => {
  // 使用 store 中的用户信息，而不是调用 API
  const userInfo = userStore.userInfo;
  if (userInfo && profileBaseSettingRef.value) {
    profileBaseSettingRef.value.getFormApi().setValues({
      realName: userInfo.realName || '',
      username: userInfo.username || '',
      roles: userInfo.roles || [],
      introduction: userInfo.introduction || '',
    });
  }
});
</script>
<template>
  <ProfileBaseSetting ref="profileBaseSettingRef" :form-schema="formSchema" />
</template>
