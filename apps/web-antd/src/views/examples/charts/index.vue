<script setup lang="ts">
import type { EChartsOption } from 'echarts';

import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

defineOptions({ name: 'ExampleCharts' });

// 图表引用
const barChartRef = ref<EchartsUIType>();
const lineChartRef = ref<EchartsUIType>();
const pieChartRef = ref<EchartsUIType>();
const radarChartRef = ref<EchartsUIType>();
const areaChartRef = ref<EchartsUIType>();

// 图表实例
const { renderEcharts: renderBarChart } = useEcharts(barChartRef);
const { renderEcharts: renderLineChart } = useEcharts(lineChartRef);
const { renderEcharts: renderPieChart } = useEcharts(pieChartRef);
const { renderEcharts: renderRadarChart } = useEcharts(radarChartRef);
const { renderEcharts: renderAreaChart } = useEcharts(areaChartRef);

// 柱状图配置
const barChartOption: EChartsOption = {
  title: {
    text: '柱状图示例',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['销量', '利润'],
    top: 30,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: ['一月', '二月', '三月', '四月', '五月', '六月'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [120, 200, 150, 80, 70, 110],
      itemStyle: {
        color: '#5470c6',
      },
    },
    {
      name: '利润',
      type: 'bar',
      data: [80, 150, 120, 60, 50, 90],
      itemStyle: {
        color: '#91cc75',
      },
    },
  ],
};

// 折线图配置
const lineChartOption: EChartsOption = {
  title: {
    text: '折线图示例',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['访问量', '下载量'],
    top: 30,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '访问量',
      type: 'line',
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      smooth: true,
      itemStyle: {
        color: '#5470c6',
      },
    },
    {
      name: '下载量',
      type: 'line',
      data: [620, 732, 701, 734, 1090, 1130, 1120],
      smooth: true,
      itemStyle: {
        color: '#91cc75',
      },
    },
  ],
};

// 饼图配置
const pieChartOption: EChartsOption = {
  title: {
    text: '饼图示例',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 50,
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 1048, name: '搜索引擎' },
        { value: 735, name: '直接访问' },
        { value: 580, name: '邮件营销' },
        { value: 484, name: '联盟广告' },
        { value: 300, name: '视频广告' },
      ],
    },
  ],
};

// 雷达图配置
const radarChartOption: EChartsOption = {
  title: {
    text: '雷达图示例',
    left: 'center',
  },
  tooltip: {},
  legend: {
    data: ['预算分配', '实际开销'],
    top: 30,
  },
  radar: {
    indicator: [
      { name: '销售', max: 6500 },
      { name: '管理', max: 16_000 },
      { name: '信息技术', max: 30_000 },
      { name: '客服', max: 38_000 },
      { name: '研发', max: 52_000 },
      { name: '市场', max: 25_000 },
    ],
  },
  series: [
    {
      name: '预算 vs 开销',
      type: 'radar',
      data: [
        {
          value: [4200, 3000, 20_000, 35_000, 50_000, 18_000],
          name: '预算分配',
        },
        {
          value: [5000, 14_000, 28_000, 26_000, 42_000, 21_000],
          name: '实际开销',
        },
      ],
    },
  ],
};

// 面积图配置
const areaChartOption: EChartsOption = {
  title: {
    text: '面积图示例',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['邮件营销', '联盟广告', '视频广告'],
    top: 30,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '邮件营销',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      data: [120, 132, 101, 134, 90, 230, 210],
      itemStyle: {
        color: '#5470c6',
      },
    },
    {
      name: '联盟广告',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      data: [220, 182, 191, 234, 290, 330, 310],
      itemStyle: {
        color: '#91cc75',
      },
    },
    {
      name: '视频广告',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      data: [150, 232, 201, 154, 190, 330, 410],
      itemStyle: {
        color: '#fac858',
      },
    },
  ],
};

onMounted(() => {
  renderBarChart(barChartOption);
  renderLineChart(lineChartOption);
  renderPieChart(pieChartOption);
  renderRadarChart(radarChartOption);
  renderAreaChart(areaChartOption);
});
</script>

<template>
  <div class="space-y-6 p-6">
    <div class="text-2xl font-bold">工作台 - ECharts 图表示例</div>

    <!-- 第一行：柱状图和折线图 -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="rounded-xl border border-border bg-card p-4">
        <EchartsUI ref="barChartRef" height="400px" />
      </div>
      <div class="rounded-xl border border-border bg-card p-4">
        <EchartsUI ref="lineChartRef" height="400px" />
      </div>
    </div>

    <!-- 第二行：饼图和雷达图 -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="rounded-xl border border-border bg-card p-4">
        <EchartsUI ref="pieChartRef" height="400px" />
      </div>
      <div class="rounded-xl border border-border bg-card p-4">
        <EchartsUI ref="radarChartRef" height="400px" />
      </div>
    </div>

    <!-- 第三行：面积图 -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="rounded-xl border border-border bg-card p-4">
        <EchartsUI ref="areaChartRef" height="400px" />
      </div>
    </div>
  </div>
</template>
