<script lang="ts" setup>
import { ref } from 'vue';

import { Button, Card, message, Space } from 'ant-design-vue';

defineOptions({ name: 'ExampleExport' });

// 示例数据
const tableData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com' },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com' },
]);

// 导出 Word
async function exportWord() {
  try {
    const [{ default: PizZip }, { saveAs }] = await Promise.all([
      import('pizzip'),
      import('file-saver'),
    ]);

    // 创建一个简单的 Word 文档模板（XML 格式）
    const content = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="32"/>
        </w:rPr>
        <w:t>数据报告</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>生成时间: ${new Date().toLocaleString('zh-CN')}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>数据列表：</w:t>
      </w:r>
    </w:p>
    ${tableData.value
      .map(
        (item) => `<w:p>
      <w:r>
        <w:t>${item.id}. ${item.name} - ${item.age}岁 - ${item.email}</w:t>
      </w:r>
    </w:p>`,
      )
      .join('')}
  </w:body>
</w:document>`;

    // 创建 ZIP 文件结构
    const zip = new PizZip();
    zip.file('word/document.xml', content);
    zip.file(
      '[Content_Types].xml',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
    );
    zip.file(
      '_rels/.rels',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
    );
    zip.file(
      'word/_rels/document.xml.rels',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>',
    );

    const blob = zip.generate({
      type: 'blob',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    saveAs(blob, `数据报告_${Date.now()}.docx`);
    message.success('Word 导出成功');
  } catch (error) {
    console.error('Word 导出失败:', error);
    message.error('Word 导出失败，请先安装依赖: pnpm add pizzip file-saver');
  }
}

// 导出 Excel
async function exportExcel() {
  try {
    const XLSX = await import('xlsx');
    const { saveAs } = await import('file-saver');

    // 创建工作表
    const worksheet = XLSX.utils.json_to_sheet(tableData.value);

    // 设置列宽
    const colWidths = [
      { wch: 10 }, // ID
      { wch: 15 }, // 姓名
      { wch: 10 }, // 年龄
      { wch: 30 }, // 邮箱
    ];
    worksheet['!cols'] = colWidths;

    // 创建工作簿
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '数据表');

    // 生成 Excel 文件
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, `数据表_${Date.now()}.xlsx`);
    message.success('Excel 导出成功');
  } catch (error) {
    console.error('Excel 导出失败:', error);
    message.error(
      `Excel 导出失败: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

// 导出 PPT
async function exportPPT() {
  try {
    const { default: PptxGenJS } = await import('pptxgenjs');

    const pptx = new PptxGenJS();

    // 设置演示文稿属性
    pptx.author = 'Vue Vben Admin';
    pptx.company = '示例公司';
    pptx.title = '数据报告';

    // 添加标题页
    const titleSlide = pptx.addSlide();
    titleSlide.addText('数据报告', {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 1.5,
      fontSize: 44,
      bold: true,
      align: 'center',
      color: '363636',
    });
    titleSlide.addText(`生成时间: ${new Date().toLocaleString('zh-CN')}`, {
      x: 0.5,
      y: 3.5,
      w: 9,
      h: 0.8,
      fontSize: 18,
      align: 'center',
      color: '666666',
    });

    // 添加数据页
    const dataSlide = pptx.addSlide();
    dataSlide.addText('数据列表', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.8,
      fontSize: 32,
      bold: true,
      color: '363636',
    });

    // 添加表格
    const tableDataForPPT = [
      ['ID', '姓名', '年龄', '邮箱'],
      ...tableData.value.map((item) => [
        item.id.toString(),
        item.name,
        item.age.toString(),
        item.email,
      ]),
    ];

    dataSlide.addTable(tableDataForPPT, {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 4,
      colW: [1, 2, 1, 5],
      border: { type: 'solid', color: 'CCCCCC', pt: 1 },
      fill: { color: 'F5F5F5' },
      fontSize: 14,
      align: 'left',
      valign: 'middle',
    });

    await pptx.writeFile({ fileName: `数据报告_${Date.now()}.pptx` });
    message.success('PPT 导出成功');
  } catch (error) {
    console.error('PPT 导出失败:', error);
    message.error('PPT 导出失败，请先安装依赖: pnpm add pptxgenjs');
  }
}

// 导出 PDF（使用 html2canvas 支持中文）
async function exportPDF() {
  try {
    const [{ default: html2canvas }, { default: JsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    // 获取要导出的表格元素
    const tableElement = document.querySelector('table') as HTMLElement;

    if (!tableElement) {
      message.error('未找到要导出的表格');
      return;
    }

    // 创建临时容器用于导出
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    container.style.padding = '40px';
    container.style.backgroundColor = '#ffffff';

    // 创建标题
    const title = document.createElement('h1');
    title.textContent = '数据报告';
    title.style.fontSize = '24px';
    title.style.fontWeight = 'bold';
    title.style.textAlign = 'center';
    title.style.marginBottom = '10px';
    container.append(title);

    // 创建日期
    const date = document.createElement('p');
    date.textContent = `生成时间: ${new Date().toLocaleString('zh-CN')}`;
    date.style.fontSize = '14px';
    date.style.textAlign = 'center';
    date.style.color = '#666666';
    date.style.marginBottom = '30px';
    container.append(date);

    // 克隆表格
    const clonedTable = tableElement.cloneNode(true) as HTMLElement;
    clonedTable.style.width = '100%';
    clonedTable.style.borderCollapse = 'collapse';
    container.append(clonedTable);

    document.body.append(container);

    // 转换为 canvas
    const canvas = await html2canvas(container, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    });

    // 移除临时容器
    container.remove();

    // 创建 PDF
    const imgWidth = 210; // A4 宽度（mm）
    const pageHeight = 297; // A4 高度（mm）
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const doc = new JsPDF('p', 'mm', 'a4');
    let position = 0;

    // 添加第一页
    doc.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      position,
      imgWidth,
      imgHeight,
    );
    heightLeft -= pageHeight;

    // 如果内容超过一页，添加新页
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight,
      );
      heightLeft -= pageHeight;
    }

    doc.save(`数据报告_${Date.now()}.pdf`);
    message.success('PDF 导出成功');
  } catch (error) {
    console.error('PDF 导出失败:', error);
    message.error(
      `PDF 导出失败: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

// 文件下载示例（下载本地图片）
async function downloadFile() {
  try {
    const { saveAs } = await import('file-saver');

    const loadingMessage = message.loading('正在下载文件...', 0);

    // 导入本地图片文件，使用 ?url 后缀获取文件 URL
    const imageModule = await import('./test.jpg?url');
    const imageUrl = imageModule.default;

    // 使用 fetch 直接下载本地文件（不使用 requestClient，避免路径被加上 /api 前缀）
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();

    // 保存文件
    saveAs(blob, 'test.jpg');
    loadingMessage();
    message.success('文件下载成功');
  } catch (error) {
    console.error('文件下载失败:', error);
    message.error(
      `文件下载失败: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
</script>

<template>
  <div class="space-y-6 p-6">
    <div class="text-2xl font-bold">导出功能示例</div>
    <div class="text-muted-foreground">
      这是一个导出功能的示例页面，展示如何实现 Word、Excel、PPT、PDF
      等格式的导出功能。
    </div>

    <!-- 导出按钮区域 -->
    <Card title="导出功能">
      <Space wrap>
        <Button type="primary" @click="exportWord">导出 Word</Button>
        <Button type="primary" @click="exportExcel">导出 Excel</Button>
        <Button type="primary" @click="exportPPT">导出 PPT</Button>
        <Button type="primary" @click="exportPDF">导出 PDF</Button>
      </Space>
    </Card>

    <!-- 文件下载示例 -->
    <Card title="文件下载示例">
      <div class="space-y-4">
        <div class="text-muted-foreground">
          使用
          <code class="rounded bg-muted px-1">fetch</code>
          方法下载本地文件。
        </div>
        <div>
          <Button type="primary" @click="downloadFile">下载示例图片</Button>
          <div class="mt-2 text-sm text-muted-foreground">
            下载地址：
            <code class="break-all rounded bg-muted px-1">
              src/views/examples/export/test.jpg
            </code>
          </div>
        </div>
      </div>
    </Card>

    <!-- 示例数据区域 -->
    <Card title="示例数据">
      <div class="space-y-4">
        <div class="text-lg font-semibold">数据列表</div>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse border border-border">
            <thead>
              <tr class="bg-muted">
                <th class="border border-border p-2 text-left">ID</th>
                <th class="border border-border p-2 text-left">姓名</th>
                <th class="border border-border p-2 text-left">年龄</th>
                <th class="border border-border p-2 text-left">邮箱</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in tableData"
                :key="item.id"
                class="hover:bg-muted/50"
              >
                <td class="border border-border p-2">{{ item.id }}</td>
                <td class="border border-border p-2">{{ item.name }}</td>
                <td class="border border-border p-2">{{ item.age }}</td>
                <td class="border border-border p-2">{{ item.email }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Card>

    <!-- 依赖说明 -->
    <Card title="依赖安装说明">
      <div class="space-y-2 text-sm">
        <div>
          <strong>Word 导出：</strong>
          <code class="rounded bg-muted px-2 py-1">
            pnpm add pizzip file-saver
          </code>
        </div>
        <div>
          <strong>Excel 导出：</strong>
          <code class="rounded bg-muted px-2 py-1">
            pnpm add xlsx file-saver
          </code>
        </div>
        <div>
          <strong>PPT 导出：</strong>
          <code class="rounded bg-muted px-2 py-1">pnpm add pptxgenjs</code>
        </div>
        <div>
          <strong>PDF 导出：</strong>
          <code class="rounded bg-muted px-2 py-1">pnpm add jspdf</code>
        </div>
        <div class="mt-4 text-muted-foreground">
          <strong>提示：</strong>可以一次性安装所有依赖：
          <code class="rounded bg-muted px-2 py-1">
            pnpm add pizzip file-saver xlsx pptxgenjs jspdf
          </code>
        </div>
      </div>
    </Card>
  </div>
</template>
