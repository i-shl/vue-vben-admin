import path from 'node:path';

import { execa } from 'execa';

/**
 * 获取暂存区文件
 */
async function getStagedFiles(): Promise<string[]> {
  try {
    const { stdout } = await execa('git', [
      '-c',
      'submodule.recurse=false',
      'diff',
      '--staged',
      '--diff-filter=ACMR',
      '--name-only',
      '--ignore-submodules',
      '-z',
    ]);

    let changedList = stdout ? stdout.replace(/\0$/, '').split('\0') : [];
    changedList = changedList.map((item) => path.resolve(process.cwd(), item));
    const changedSet = new Set(changedList);
    changedSet.delete('');
    return [...changedSet];
  } catch (error) {
    console.error('Failed to get staged files:', error);
    return [];
  }
}

/**
 * 将文件添加到 git 暂存区
 * @param filePath - 要添加的文件路径
 * @param cwd - 工作目录
 */
async function add(filePath: string, cwd?: string): Promise<void> {
  try {
    await execa('git', ['add', filePath], {
      cwd: cwd || process.cwd(),
    });
  } catch (error) {
    console.error(`Failed to add file ${filePath} to git:`, error);
    throw error;
  }
}

export { add, getStagedFiles };
