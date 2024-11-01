module.exports = function formatMath({ window, document, navigator = {} }) {
  // 定义一个数学公式渲染器类
  var findUpTable = function(element) {
    var parent = element.parentNode;
    var maxDepth = 100; // 添加最大深度限制
    var depth = 0;
    while(parent && depth < maxDepth) {
      if(parent.tagName === 'TABLE') {
        return parent;
      }
      parent = parent.parentNode;
      depth++;
    }
    return null;
  };
  var findTrCount = function(table) {
    var trs = table.getElementsByTagName('tr');
    return trs.length;
  };
  var htmlLatexRender = function() {
    // 获取元素的最大高度
    function getMaxHeight(element) {
      const table = findUpTable(element);
      const trCount = findTrCount(table);
      return 20 * trCount;
    }

    // 获取元素的属性值
    function getAttribute(element, attrName) {
      return (element == null || element.nodeType != 1) ? null : element.getAttribute(attrName);
    }

    // 设置元素样式
    function setStyle(element, style, value) {
      if(typeof style === "object") {
        for(var key in style) {
          element.style[key] = style[key];
        }
      } else if(typeof style === "string") {
        element.style[style] = value;
      }
    }

    // 获取下一个兄弟元素
    function getNextSibling(element, checkParent) {
      if(element == null) return null;
      try {
        if(checkParent === true) {
          var parent = element.parentNode;
          if(parent.nextElementSibling) return parent.nextElementSibling;
          while(parent = parent.nextSibling) {
            if(parent.nodeType == 1) return parent;
          }
        } else {
          if(element.nextElementSibling) return element.nextElementSibling;
          while(element = element.nextSibling) {
            if(element.nodeType == 1) return element;
          }
        }
      } catch(e) {}
      return null;
    }

    // 遍历元素及其子元素
    function traverseElements(element, callback) {
      if(element != null && callback != null) {
        var children = element.children || element.childNodes;
        callback(element);
        for(var i = 0; i < children.length; i++) {
          traverseElements(children[i], callback);
        }
      }
    }

    // 收集满足条件的元素
    function collectElements(element, result, filter, depth) {
      if(element != null) {
        depth++;
        var children = element.children || element.childNodes;
        for(var i = 0; i < children.length; i++) {
          var child = children[i];
          if(child.nodeType == 1) {
            if(filter(child)) {
              result.push({
                n: child,
                d: depth
              });
            }
            collectElements(child, result, filter, depth);
          }
        }
      }
    }

    // 处理数学公式的布局
    function handleMathLayout(element) {
      var elements = [];
      var i = 0;

      // 收集需要处理大小的元素
      collectElements(element, elements, function(el) {
        return getAttribute(el, "hassize") ? true : false;
      }, 0);

      // 计算元素的尺寸信息
      for(i = 0; i < elements.length; i++) {
        elements[i].h = getMaxHeight(elements[i].n.parentNode);
        elements[i].w = Math.max(
          elements[i].n.parentNode.clientWidth,
          elements[i].n.parentNode.scrollWidth
        );
        elements[i].s = parseInt(getAttribute(elements[i].n, "hassize"));
        elements[i].f = getAttribute(elements[i].n, "dealflag");
      }

      // 根据不同类型处理元素
      for(i = 0; i < elements.length; i++) {
        if(elements[i].s < 0) {
          var type = getAttribute(elements[i].n, "mathtag");
          switch(type) {
            case "msup_sup":
              handleSuperscript(elements[i]);
              break;
            case "msub_sub": 
              handleSubscript(elements[i]);
              break;
            case "msubsup_sup":
              handleSubSuperscript(elements[i]);
              break;
          }
        } else {
          handleStretch(elements[i]);
        }
      }
    }

    // 处理拉伸
    function handleStretch(element) {
      var stretchElements = [];
      var direction;

      collectElements(element.n, stretchElements, function(el) {
        return getAttribute(el, "muststretch") ? true : false;
      }, 0);

      if(stretchElements.length < 1) return;

      direction = getAttribute(stretchElements[0].n, "muststretch");
      
      if(direction == "v") {
        var height = (element.h - element.s) / stretchElements.length;
        if(height > 0) {
          for(var i = 0; i < stretchElements.length; i++) {
            stretchElements[i].n.style.height = height + "px";
            // console.log(stretchElements[i]);
          }
        }
      } else {
        var width = (element.w - element.s) / stretchElements.length;
        if(width > 0) {
          for(var i = 0; i < stretchElements.length; i++) {
            stretchElements[i].n.style.width = width + "px";
          }
        }
      }
    }

    // 处理上下标组合
    function handleSubSuperscript(element) {
      var next = getNextSibling(element.n);
      var height1 = getMaxHeight(element.n);
      var height2 = getMaxHeight(next);
      var margin = element.h - (height1 + height2);
      if(margin > 0) {
        setStyle(next, "marginTop", margin + "px");
      }
    }

    // 处理上标
    function handleSuperscript(element) {
      if(element.f) {
        var height = getMaxHeight(element.n.parentNode);
        if(height > 0) {
          setStyle(element.n, "verticalAlign", (height * 3/4) + "px");
        }
      }
    }

    // 处理下标
    function handleSubscript(element) {
      if(element.f && getMaxHeight(element.n.parentNode) > 0) {
        setStyle(element.n, "verticalAlign", "-100%");
      }
    }

    // 处理数学文本
    function processMathText(element) {
      if(element == null || 
         element.nodeType == 8 || 
         element.childNodes.length < 1 ||
         /input|form|math|iframe|textarea|pre|svg/.test(element.nodeName)) {
        return;
      }

      for(var i = element.childNodes.length - 1; i >= 0; i--) {
        var node = element.childNodes[i];
        if(node.nodeType != 3) {
          processMathText(node);
        } else {
          // 替换特殊字符
          var text = node.nodeValue
            .replace(/sin/g, "\u253d")
            .replace(/cos/g, "\u253e")
            .replace(/tan/g, "\u253f")
            .replace(/lim/g, "\u2540");

          text = text
            .replace(/\-/g, "\u2212")
            .replace(/=/g, "\uff1d")
            .replace(/\\+/g, "\uff0b");

          var fragment = document.createDocumentFragment();

          // 处理每个字符
          for(var j = 0; j < text.length; j++) {
            var char = text.charAt(j);
            
            switch(char) {
              case "\u253d":
                char = "sin";
                break;
              case "\u253e":
                char = "cos";
                break;
              case "\u253f":
                char = "tan";
                break;
              case "\u2540":
                char = "lim";
                break;
              default:
                if(/[a-z]/i.test(char)) {
                  var font = document.createElement("font");
                  font.className = "MathJye_mi";
                  font.appendChild(document.createTextNode(char));
                  fragment.appendChild(font);
                  continue;
                }
            }
            fragment.appendChild(document.createTextNode(char));
          }

          element.replaceChild(fragment, node);
        }
      }
    }

    // 布局方法
    this.LayOut = function(element, init) {
      // console.log('LayOut', element, init);

      var spans = element.getElementsByTagName("span");
      
      for(var i = 0; i < spans.length; i++) {
        if(getAttribute(spans[i], "mathtag") == "math") {
          processMathText(spans[i]);

          if(init) {
            traverseElements(spans[i], function(el) {
              if(el.nodeType == 1) {
                switch(getAttribute(el, "muststretch")) {
                  case "v":
                    el.style.height = "1px";
                    break;
                  case "h":
                    el.style.width = "1px";
                    break;
                }
              }
            });
          }

          if(getAttribute(spans[i], "dealflag") == "1") {
            handleMathLayout(spans[i]);
          }
        }
      }
    };
  };

  // 创建渲染器实例
  var MathJye = Object;
  try {
    MathJye = new htmlLatexRender();
  } catch(e) {}

  // DOM加载完成后初始化
  // (function() {
  //   var isIE = !!(window.attachEvent && !window.opera);
  //   var isOldWebkit = /webkit\/(\d+)/i.test(navigator.userAgent) && RegExp.$1 < 525;
  //   var callbacks = [];

  //   function runCallbacks() {
  //     for(var i = 0; i < callbacks.length; i++) {
  //       callbacks[i]();
  //     }
  //   }

  //   var doc = document;
  //   // doc.ready = function(callback) {
  //   //   console.log('ready', callback);

  //   //   if(!isIE && !isOldWebkit && doc.addEventListener) {
  //   //     return doc.addEventListener("DOMContentLoaded", callback, false);
  //   //   }

  //   //   if(callbacks.push(callback) > 1) return;

  //   //   if(isIE) {
  //   //     (function() {
  //   //       try {
  //   //         doc.documentElement.doScroll("left");
  //   //         runCallbacks();
  //   //       } catch(e) {
  //   //         setTimeout(arguments.callee, 0);
  //   //       }
  //   //     })();
  //   //   } else if(isOldWebkit) {
  //   //     var timer = setInterval(function() {
  //   //       if(/^(loaded|complete)$/.test(doc.readyState)) {
  //   //         clearInterval(timer);
  //   //         runCallbacks();
  //   //       }
  //   //     }, 0);
  //   //   }
  //   // };
  // })();

  // 页面加载完成后渲染数学公式
  // document.ready(function() {
  //   try {
  //     MathJye.LayOut(document.body);
  //   } catch(e) {}
  // });

  MathJye.LayOut(document, false);

};
