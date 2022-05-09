import { readFileSync } from 'fs-extra'
import { join } from 'path'
/**
 * @zh 如果希望兼容 3.3 之前的版本可以使用下方的代码
 * @en You can add the code below if you want compatibility with versions prior to 3.3
 */
// Editor.Panel.define = Editor.Panel.define || function(options: any) { return options }
module.exports = Editor.Panel.define({
  listeners: {
    show() {
      console.log('show')
    },
    hide() {
      console.log('hide')
    },
  },
  template: readFileSync(
    join(__dirname, '../../../static/template/default/index.html'),
    'utf-8'
  ),
  style: readFileSync(
    join(__dirname, '../../../static/style/default/index.css'),
    'utf-8'
  ),
  $: {
    app: '#app',
    file: '#file',
    btn: 'ui-button',
  },
  methods: {
    hello() {
      if (this.$.app) {
        this.$.app.innerHTML = 'hello'
        console.log('[cocos-panel-html.default]: hello')
      }
    },
  },
  async ready() {
    if (this.$.app) {
      this.$.app.innerHTML = 'Hello MVC'
    }
    if (this.$.file) {
      this.$.file.addEventListener('confirm', function (e) {
        console.log(e.target)
      })
    }

    this.$.btn?.addEventListener('confirm', (e) => {
      const prePath =
        'D:/workspace/code/games-example/test3D/assets/resources/prefabs'
      const targetPath =
        'D:/workspace/code/games-example/test3D/assets/scripts/ui'
      Editor.Message.send('mvc', 'gen-Ctrl', prePath, targetPath)
    })

    const path = await Editor.Message.request('mvc', 'get-cache', 'path')
    // 拿到值后进行赋值
    console.log(path)
  },
  beforeClose() {
    Editor.Message.send('mvc', 'save-cache', 'path', {
      prePath: '123',
      targetPath: '456',
    })
  },
  close() {},
})
