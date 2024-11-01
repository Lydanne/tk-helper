Component({
  behaviors: [],
  properties: {
  },
  data: {
  },
  lifetimes: {
    created() {
    },
    attached() {
    },
    moved() {
    },
    detached() {
    },
  },
  methods: {
    onInput(e){
      try {
        wx._param = {
          payload: JSON.parse(e.detail.value)
        }
      } catch (error) {
        console.log(error);
        wx.showToast({
          title: '格式错误',
          icon: 'none'
        })
      }
    },
    onToParseJYW(){
      wx.navigateTo({
        url: '/pages/parse/jyw/jyw'
      })
    },
    onToParseXB(){
      wx.navigateTo({
        url: '/pages/parse/xb/xb'
      })
    }
  },
});