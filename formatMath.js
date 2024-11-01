module.exports = function formatMath({ window, document, navigator = {} }) {
  var htmlLatexRender = function () {
      function h(a) {
        return Math.max(a.clientHeight, a.scrollHeight);
      }
      function d(a, c) {
        return null == a || 1 != a.nodeType ? null : a.getAttribute(c);
      }
      function l(a, c, b) {
        switch (typeof c) {
          case "object":
            for (var e in c) a.style[e] = c[e];
            break;
          case "string":
            a.style[c] = b;
        }
      }
      function m(a, c) {
        if (null == a) return null;
        try {
          if (!0 == c) {
            var b = a.parentNode;
            if (b.nextElementSibling) return b.nextElementSibling;
            for (; (b = b.nextSibling); ) if (1 == b.nodeType) return b;
          } else {
            if (a.nextElementSibling) return a.nextElementSibling;
            for (; (a = a.nextSibling); ) if (1 == a.nodeType) return a;
          }
        } catch (e) {}
        return null;
      }
      function k(a, c) {
        if (null != a && null != c) {
          var b = a.children || a.childNodes;
          c(a);
          for (var e = 0; e < b.length; e++) k(b[e], c);
        }
      }
      function g(a, c, b, e) {
        if (null != a) {
          ++e;
          for (var f = a.children || a.childNodes, d = 0; d < f.length; d++)
            (a = f[d]),
              1 == a.nodeType &&
                (b(a) && c.push({ n: a, d: e }), g(a, c, b, e));
        }
      }
      function n(a) {
        var c = [],
          b = 0;
        g(
          a,
          c,
          function (a) {
            if (d(a, "hassize")) return !0;
          },
          0
        );
        for (b = 0; b < c.length; b++)
          (c[b].h = h(c[b].n.parentNode)),
            (c[b].w = Math.max(
              c[b].n.parentNode.clientWidth,
              c[b].n.parentNode.scrollWidth
            )),
            (c[b].s = parseInt(d(c[b].n, "hassize"))),
            (c[b].f = d(c[b].n, "dealflag"));
        for (b = 0; b < c.length; b++)
          if (0 > c[b].s)
            switch (((a = d(c[b].n, "mathtag")), a)) {
              case "msup_sup":
                q(c[b]);
                break;
              case "msub_sub":
                r(c[b]);
                break;
              case "msubsup_sup":
                s(c[b]);
            }
          else t(c[b]);
      }
      function t(a) {
        var c = [],
          b;
        g(
          a.n,
          c,
          function (a) {
            if (d(a, "muststretch")) return !0;
          },
          0
        );
        if (!(1 > c.length))
          if (((b = d(c[0].n, "muststretch")), "v" == b)) {
            if (((b = (a.h - a.s) / c.length), 0 < b))
              for (a = 0; a < c.length; a++) {
                c[a].n.style.height = b + "px";
                console.log(c[a]);
                
              }
          } else if (((b = (a.w - a.s) / c.length), 0 < b))
            for (a = 0; a < c.length; a++) c[a].n.style.width = b + "px";
      }
      function s(a) {
        var c = m(a.n),
          b = h(a.n),
          e = h(c);
        a = a.h - (b + e);
        0 < a && l(c, "marginTop", a + "px");
      }
      function q(a) {
        if (a.f) {
          var c = h(a.n.parentNode);
          0 < c && l(a.n, "verticalAlign", (3 * c) / 4 + "px");
        }
      }
      function r(a) {
        a.f && 0 < h(a.n.parentNode) && l(a.n, "verticalAlign", "-100%");
      }
      function p(a) {
        if (
          !(
            null == a ||
            8 == a.nodeType ||
            1 > a.childNodes.length ||
            /input|form|math|iframe|textarea|pre|svg/.test(a.nodeName)
          )
        )
          for (var c, b, e, f, d = a.childNodes.length - 1; -1 < d; d--)
            if (3 != a.childNodes[d].nodeType) p(a.childNodes[d]);
            else {
              c = a.childNodes[d].nodeValue
                .replace(/sin/g, "\u253d")
                .replace(/cos/g, "\u253e")
                .replace(/tan/g, "\u253f")
                .replace(/lim/g, "\u2540");
              c = c
                .replace(/\-/g, "\u2212")
                .replace(/=/g, "\uff1d")
                .replace(/\\+/g, "\uff0b");
              b = document.createDocumentFragment();
              for (var g = 0; g < c.length; g++) {
                f = c.charAt(g);
                switch (f) {
                  case "\u253d":
                    f = "sin";
                    break;
                  case "\u253e":
                    f = "cos";
                    break;
                  case "\u253f":
                    f = "tan";
                    break;
                  case "\u2540":
                    f = "lim";
                    break;
                  default:
                    if (/[a-z]/i.test(f)) {
                      e = document.createElement("font");
                      e.className = "MathJye_mi";
                      e.appendChild(document.createTextNode(f));
                      b.appendChild(e);
                      continue;
                    }
                }
                b.appendChild(document.createTextNode(f));
              }
              a.replaceChild(b, a.childNodes[d]);
            }
      }
      this.LayOut = function (a, c) {
        console.log('LayOut', a, c);
        
        for (var b = a.getElementsByTagName("span"), e = 0; e < b.length; e++)
          "math" == d(b[e], "mathtag") &&
            (p(b[e]),
            c &&
              k(b[e], function (a) {
                if (1 == a.nodeType)
                  switch (d(a, "muststretch")) {
                    case "v":
                      a.style.height = "1px";
                      break;
                    case "h":
                      a.style.width = "1px";
                  }
              }),
            "1" == d(b[e], "dealflag") && n(b[e]));
      };
    },
    MathJye = Object;
  try {
    MathJye = new htmlLatexRender();
  } catch (e$$14) {}
  (function () {
    var h = !(!window.attachEvent || window.opera),
      d = /webkit\/(\d+)/i.test(navigator.userAgent) && 525 > RegExp.$1,
      l = [],
      m = function () {
        for (var d = 0; d < l.length; d++) l[d]();
      },
      k = document;
    k.ready = function (g) {   
      console.log('ready', g);
         
      if (!h && !d && k.addEventListener)
        return k.addEventListener("DOMContentLoaded", g, !1);
      if (!(1 < l.push(g)))
        if (h)
          (function () {
            try {
              k.documentElement.doScroll("left"), m();
            } catch (d) {
              setTimeout(arguments.callee, 0);
            }
          })();
        else if (d)
          var n = setInterval(function () {
            /^(loaded|complete)$/.test(k.readyState) && (clearInterval(n), m());
          }, 0);
    };
  })();
  document.ready(function () {
    try {
      MathJye.LayOut(document.body);
    } catch (h) {}
  });
};
