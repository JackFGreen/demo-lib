/**
  head () {
    return {
      title: '',
      description: '',
      keywords: ''
    }
  },
  watchLang () {
    this.$_setHead()
  }
 */

function getHead (vm) {
  // 组件可以提供一个 `title` 选项
  // 此选项可以是一个字符串或函数
  const { head } = vm.$options
  if (head) {
    return typeof head === 'function' ? head.call(vm) : head
  }
}

const serverHeadMixin = {
  created () {
    const head = getHead(this)
    if (head) {
      const { title, description, keywords } = head
      this.$ssrContext.title = title
      this.$ssrContext.description = description
      this.$ssrContext.keywords = keywords
    }
  }
}

const clientHeadMixin = {
  mounted () {
    this.$_setHead()
  },
  methods: {
    $_setHead () {
      const head = getHead(this)
      if (head) {
        const { title, description, keywords } = head
        document.title = title
        const descriptionEl = document.querySelector('meta[name=description]')
        if (descriptionEl) descriptionEl.setAttribute('content', description)
        const keywordsEl = document.querySelector('meta[name=keywords]')
        if (keywordsEl) keywordsEl.setAttribute('content', keywords)
      }
    }
  }
}

// 可以通过 `webpack.DefinePlugin` 注入 `VUE_ENV`
export default (process.env.VUE_ENV === 'server' ? serverHeadMixin : clientHeadMixin)
