import type { Recordable, UserInfo } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import { $t } from '#/locales';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: Recordable<any>,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 本地验证：检查用户名和密码是否填写
    if (!params.username || !params.password) {
      notification.error({
        message: $t('authentication.loginFailed'),
        description: $t('authentication.usernameTip') || '请输入用户名和密码',
        duration: 3,
      });
      return {
        userInfo: null,
      };
    }

    let userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;

      // 设置模拟的 accessToken
      const mockAccessToken = 'mock-access-token-' + Date.now();
      accessStore.setAccessToken(mockAccessToken);

      // 获取模拟的用户信息
      userInfo = await fetchUserInfo();

      // 设置模拟的权限码（空数组，表示所有权限）
      accessStore.setAccessCodes([]);

      if (accessStore.loginExpired) {
        accessStore.setLoginExpired(false);
      } else {
        onSuccess
          ? await onSuccess?.()
          : await router.push(
              userInfo.homePath || preferences.app.defaultHomePath,
            );
      }

      if (userInfo?.realName) {
        notification.success({
          description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.realName}`,
          duration: 3,
          message: $t('authentication.loginSuccess'),
        });
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  async function logout(redirect: boolean = true) {
    // 移除 API 调用，直接执行登出逻辑
    resetAllStores();
    accessStore.setLoginExpired(false);

    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    });
  }

  async function fetchUserInfo() {
    // 返回模拟的用户信息
    const userInfo: UserInfo = {
      avatar: preferences.app.defaultAvatar,
      desc: '',
      homePath: preferences.app.defaultHomePath,
      realName: '用户',
      roles: ['user'],
      token: 'mock-token',
      userId: '1',
      username: 'user',
    };
    userStore.setUserInfo(userInfo);
    return userInfo;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout,
  };
});
