// index.ts
import { parseHTML } from '../../../utils/w';
import formatMath from '../../../utils/formatMathF';

Component({
  data: {
    source: {}
  },
  methods: {
  },
  lifetimes:{
    ready(){
      const payload = wx._param.payload;
      console.log(payload);
      const source = {};
      {
        const t = payload.Content;
        const dom = parseHTML(`<div class="content"> ${t} </div>`)
        formatMath(dom)
        source.Content = dom.document.toString();
      }
      {
        const t = payload.Analyse;
        const dom = parseHTML(`<div class="content"> ${t} </div>`)
        formatMath(dom)
        source.Analyse = dom.document.toString();
      }
      {
        const t = payload.Method;
        const dom = parseHTML(`<div class="content"> ${t} </div>`)
        formatMath(dom)
        source.Method = dom.document.toString();
      }
      console.log(source);
      this.setData({source})
      
    }
  }
})
