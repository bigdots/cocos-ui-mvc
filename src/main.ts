//@ts-ignore
import packageJSON from '../package.json'
import { readFileSync, outputFile } from 'fs-extra'
import { join } from 'path'
import fs from 'fs'
import { readdir } from 'fs/promises'

const cache: {
  [key: string]: any
} = {}

function writeFile(fileName: string, targetPath: string, data: string) {
  const filePath = `${targetPath}/${fileName}.ts`
  // 判断是否已经存在,存在则不覆盖
  if (fs.existsSync(filePath)) {
    console.log(`${fileName} exist`)
    return
  }
  outputFile(filePath, data)
}

/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
  openPanel() {
    Editor.Panel.open(packageJSON.name)
  },

  async genCtrl(prePath, targetPath) {
    // 读取模板文件
    const ctrlTmp = readFileSync(
      join(__dirname, '../static/template/ctrlTmp.text'),
      'utf-8'
    )
    const uiControlBaseTmp = readFileSync(
      join(__dirname, '../static/template/uiControlBase.text'),
      'utf-8'
    )

    // 写入MVC基类
    writeFile('uiControlBase', targetPath, uiControlBaseTmp)

    // 正则匹配所有prefab文件
    const reg = /\w+\.prefab$/
    // 获取UIprefab目录下的所有文件
    const files = await readdir(prePath)
    // 生成文件
    files.forEach((file) => {
      if (reg.test(file)) {
        const fileName = `${file.split('.')[0]}Ctrl`
        // 写入所有control
        writeFile(
          fileName,
          targetPath,
          ctrlTmp.replace(/controlName/g, fileName)
        )
      }
    })
  },

  saveCache(key: string, value: any) {
    cache[key] = value
  },
  getCache(key) {
    if (cache[key]) {
      const v = cache[key]
      delete cache[key]
      return v
    }
  },
}

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export function load() {}

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export function unload() {}
