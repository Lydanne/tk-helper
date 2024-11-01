// index.ts
import { parseHTML } from '../../../utils/w';
import formatMath from '../../../utils/formatMathF';

Component({
  data: {
    sources: []
  },
  methods: {
  },
  lifetimes:{
    ready(){
      const payload = wx._param.payload;
     this.setData({
       sources: payload?.data ?? payload,
     })
    }
  }
})
