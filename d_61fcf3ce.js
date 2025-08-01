"use strict";
(() => {
    var X = Math.pow;

    function Qs(i, t, s) {
        return J(0, 1, (s - i) / (t - i))
    }

    function R(i, t, s) {
        return (1 - s) * i + s * t
    }

    function J(i, t, s) {
        return s < i ? i : s > t ? t : s
    }

    function N(i, t) {
        return t = $(t) ? 100 : X(10, t), Math.round(i * t) / t
    }

    function q(i, t, s, e, o) {
        return R(s, e, Qs(i, t, o))
    }

    function As(i, t) {
        return Math.sqrt(i * i + t * t)
    }

    function ls(i, t, s) {
        return N(Math.abs(i - t), s) !== 0
    }

    function H(i, t, s) {
        return R(i, t, 1 - Math.exp(Math.log(1 - s) * gs))
    }
    var Y = class {
            constructor(t, s) {
                this.cb = t, this.de = s, _(this, ["loop"]), this.at = new U(this.loop)
            }
            run() {
                this.de === 0 ? this.cb() : this.at.run()
            }
            stop() {
                this.at.stop()
            }
            loop(t) {
                let s = J(0, this.de, t);
                J(0, 1, s / this.de) === 1 && (this.stop(), this.cb())
            }
        },
        hs = class {
            constructor(t) {
                this._ = new Y(t.cb, t.de)
            }
            run() {
                this._.stop(), this._.run()
            }
        },
        us = {
            ra: (i, t, s = 0) => {
                let e = Math.random() * (t - i) + i;
                return us.round(e, s)
            },
            uni: i => {
                let t = Array.from({
                    length: i
                }, (s, e) => e);
                for (let s = i - 1; s > 0; s--) {
                    let e = Math.floor(Math.random() * (s + 1)),
                        o = t[s];
                    t[s] = t[e], t[e] = o
                }
                return t
            },
            ro: (i, t) => {
                let s = Math.pow(10, t);
                return Math.round(i * s) / s
            }
        };
    var xs = i => {
            let t = document.body;
            return i === !0 ? w.a(t, "ns") : w.r(t, "ns")
        },
        it = i => {
            i.cancelable && i.preventDefault()
        },
        lt = i => document.createElement(i),
        Ts = (i, t) => i.style.pointerEvents = t,
        tt = {
            a: i => Ts(i, "all"),
            n: i => Ts(i, "none")
        },
        F = i => i.getBoundingClientRect(),
        ot = i => {
            let t = 0;
            for (; i;) t += i.offsetTop, i = i.offsetParent;
            return N(t)
        },
        as = (i, t) => {
            var s = t.length;
            for (let e = 0; e < s; e++)
                if (i === t[e]) return e;
            return -1
        },
        cs = {
            li: i => as(i, i.parentNode.children),
            cl: (i, t, s) => as(i, p.cl(t, s))
        },
        ps = {
            ct: navigator.userAgent.toLowerCase(),
            get xt() {
                return navigator.platform === "MacIntel" && 1 < navigator.maxTouchPoints
            },
            get yt() {
                return /mobi|android|tablet|ipad|iphone/.test(this.ct) || this.xt
            },
            get wt() {
                return -1 < this.ct.indexOf("firefox")
            }
        },
        p = {
            id: (i, t = document) => t.getElementById(i),
            cl: (i, t = document) => {
                let s = t.getElementsByClassName(i);
                return Array.from(s).filter(e => e instanceof HTMLElement)
            },
            tag: (i, t = document) => {
                let s = t.getElementsByTagName(i);
                return Array.from(s).filter(e => e instanceof HTMLElement)
            },
            se: (i, t = document) => t.querySelector(i),
            seA: (i, t = document) => t.querySelectorAll(i)
        },
        st = (i, t) => i.getAttribute(t),
        Es = (i, t, s) => i.setAttribute(t, s),
        w = {
            co: (i, t) => i.classList.contains(t),
            a: (i, t) => i.classList.add(t),
            r: (i, t) => i.classList.remove(t)
        },
        ct = i => typeof i == "string";
    var z = i => i !== void 0,
        $ = i => i === void 0,
        Z = {
            el: i => {
                let t = [];
                if (ct(i)) {
                    let s = i.charAt(0),
                        e = i.substring(1);
                    s === "#" ? t[0] = p.id(e) : s === "." && t.push(...p.cl(e))
                } else t[0] = i;
                return t
            },
            type: i => i.charAt(0) === "#" ? "id" : "class",
            name: i => i.substring(1)
        };

    function L(i, t) {
        return Array.isArray(t) ? t.some(s => Object.prototype.hasOwnProperty.call(i, s)) : Object.prototype.hasOwnProperty.call(i, t)
    }

    function _(i, t) {
        let s = t.length;
        for (let e = 0; e < s; e++) {
            let o = t[e];
            i[o] = i[o].bind(i)
        }
    }
    var Rs = i => {
            let t = i.type === "json",
                s = t ? "application/json" : "text/html",
                e = {
                    method: t ? "POST" : "GET",
                    headers: new Headers({
                        "Content-Type": s,
                        "X-Requested-With": "XMLHttpRequest"
                    }),
                    mode: "same-origin"
                };
            t && (e.body = i.body), fetch(i.url, e).then(o => {
                if (o.ok) return o[t ? "json" : "text"]();
                throw new Error("Network response was not ok")
            }).then(o => {
                i.success(o)
            }).catch(o => {
                i.error ? i.error(o) : console.error(o)
            })
        },
        T = (i, t, s, e, o = !1) => {
            let r = Z.el(i),
                n = r.length,
                l = `${t==="a"?"add":"remove"}EventListener`,
                c = ["mousemove", "mousewheel", "touchmove", "touchstart"].includes(s) ? {
                    passive: !1
                } : void 0;
            for (let f = 0; f < n; f++) {
                let d = r[f];
                d && typeof d[l] == "function" && d[l](s, e, o ? c : void 0)
            }
        },
        V = (i, t, s, e = "%") => {
            let o = `${t}${e}`,
                r = `${s}${e}`;
            i.style.transform = `translate3d(${o}, ${r}, 0)`
        },
        ys = i => JSON.parse(JSON.stringify(i));

    function rt(i, t, s) {
        i.style.transition = `${t}ms transform cubic-bezier(${s})`
    }
    var Fs = i => i.endsWith("/") ? i.slice(0, -1) : i;
    var ws = i => {
        p.se("meta[name='theme-color']").content = i
    };
    var te = 1e3 / 60,
        gs = 0,
        Ss = 0,
        _s = class {
            constructor() {
                this._ = [], this.pause = 0, _(this, ["v"]), T(document, "a", "visibilitychange", this.v)
            }
            add(t) {
                this._.push(t)
            }
            v() {
                let t = performance.now(),
                    s = document.visibilityState === "visible",
                    e = s ? "start" : "stop",
                    o;
                s ? o = t - this.pause : this.pause = t, this._.forEach(r => r[e](o))
            }
        },
        se = new _s,
        vs = class {
            constructor() {
                this._ = [], this.play = !0, _(this, ["loop", "off", "on"]), se.add({
                    stop: this.off,
                    start: this.on
                }), this.raf()
            }
            off() {
                this.play = !1
            }
            on(t) {
                this._.forEach(s => s.sT += t), this.play = !0
            }
            a(t) {
                this._.push(t)
            }
            r(t) {
                this._ = this._.filter(s => s.id !== t)
            }
            loop(t) {
                this.play && (this.t = this.t || t, gs = (t - this.t) / te, this.t = t, this._.forEach(s => {
                    if (z(s) && (s.sT || (s.sT = t))) {
                        let e = t - s.sT;
                        s.cb(e)
                    }
                })), this.raf()
            }
            raf() {
                requestAnimationFrame(this.loop)
            }
        },
        Ms = new vs,
        U = class {
            constructor(t) {
                this.cb = t, this.on = !1, this.id = Ss, Ss++
            }
            run() {
                this.on || (Ms.a({
                    id: this.id,
                    cb: this.cb,
                    sT: performance.now()
                }), this.on = !0)
            }
            stop() {
                this.on && (Ms.r(this.id), this.on = !1)
            }
        };
    var et = class {
        constructor() {
            this.eT = ps.yt ? "orientationchange" : "resize", this.tick = !1, this._ = [], _(this, ["fn", "loop", "run"]), this.t = new hs({
                de: 40,
                cb: this.loop
            }), this.pt = new U(this.run), T(window, "a", this.eT, this.fn)
        }
        add(t) {
            this._.push(t)
        }
        rm(t) {
            let s = this._.findIndex(e => e.id === t);
            s !== -1 && this._.splice(s, 1)
        }
        fn(t) {
            this.e = t, this.t.run()
        }
        loop() {
            this.tick || (this.tick = !0, this.pt.run())
        }
        run() {
            this._.forEach(t => t.cb(this.e)), this.pt.stop(), this.tick = !1
        }
    };
    var Ps = 0,
        K = class {
            constructor(t) {
                this.cb = t, this.id = Ps, Ps++
            }
            on() {
                new et().add({
                    id: this.id,
                    cb: this.cb
                })
            }
            off() {
                new et().rm(this.id)
            }
        };
    var pt = class {
        constructor() {
            this.inj = !1, _(this, ["resize"]), new K(this.resize).on(), this.resize()
        }
        resize() {
            let t = _A.it.wh > 1;
            t && !this.inj ? this.a() : !t && this.inj && this.r()
        }
        a() {
            let t = document.body;
            ws("#161310"), w.a(t, "_d"), w.co(t, "_l") && w.r(t, "_l"), this.ro = lt("div"), this.ro.className = "ro_";
            let s = lt("div");
            s.className = "ro", s.innerHTML = '<svg viewBox="0 0 12 20" fill="none"><path d="M2.54492 19.2959H9.48828C10.9912 19.2959 11.9932 18.3115 11.9932 16.8525V2.43848C11.9932 0.979492 10.9912 0.00390625 9.48828 0.00390625H2.54492C1.01562 0.00390625 -0.00390625 0.979492 -0.00390625 2.43848V16.8525C-0.00390625 18.3115 1.01562 19.2959 2.54492 19.2959ZM2.84375 17.4854C2.14941 17.4854 1.75391 17.1074 1.75391 16.4395V2.85156C1.75391 2.18359 2.14941 1.80566 2.84375 1.80566H3.2041V2.24512C3.2041 2.63184 3.45898 2.88672 3.83691 2.88672H8.16113C8.53906 2.88672 8.79395 2.63184 8.79395 2.24512V1.80566H9.14551C9.83984 1.80566 10.2354 2.19238 10.2354 2.86035V16.4395C10.2354 17.1074 9.83984 17.4854 9.14551 17.4854H2.84375ZM3.65234 16.791H8.3457C8.60059 16.791 8.79395 16.6152 8.79395 16.3428C8.79395 16.0791 8.60059 15.9033 8.3457 15.9033H3.65234C3.39746 15.9033 3.2041 16.0791 3.2041 16.3428C3.2041 16.6152 3.39746 16.791 3.65234 16.791Z"/></svg><span>Are you serious?</span><p>You actually wanted to check if the site works in landscape mode. Flip it back now!</p>', this.ro.appendChild(s), xs(!0), t.prepend(this.ro), this.inj = !0
        }
        r() {
            _A.e.n.isOpen || xs(!1), this.ro.parentNode.removeChild(this.ro);
            let t = document.body,
                s = localStorage.getItem("th");
            ws(s === "_d" ? "#161310" : "#ecebeb"), w.co(t, "_d") && s !== "_d" && (w.r(t, "_d"), w.a(t, "_l")), this.inj = !1
        }
    };
    var ft = class {
        constructor(t) {
            this.d = t;
            let s = _A;
            s.P = {
                w: 0,
                h: 0
            }, s.config.dim = {
                d: [1920, 1080],
                m: [1080, 1920]
            }, _(this, ["resize"]), new K(this.resize).on(), this.resize()
        }
        resize() {
            let t = _A,
                s = innerWidth,
                e = innerHeight;
            t.P = {
                w: s,
                h: e
            }, t._t = {
                w: .5 * s,
                h: .5 * e
            }, t.it = {
                wh: s / e,
                hw: e / s
            }, t.vt = 1 < t.it.wh, t.G = t.vt ? "l" : "p";
            let o = t.config.dim[this.d];
            t.dim = {
                h: o[1],
                w: o[0]
            }, t.Rt = s / t.dim.w, t.Ft = e / t.dim.h
        }
    };

    function zs(i) {
        let t = _A,
            s = t.config.routes[i],
            e = t.route.new,
            o = t.route.old;
        t.route.old = e, t.route.new = {
            url: i,
            page: s
        }, t.is[e.page] = !1, t.is[s] = !0, o.page && (t.was[o.page] = !1), t.was[e.page] = !0
    }
    var dt = class {
        constructor(t) {
            let s = _A;
            s.S = !0, s.B = !1, s.page = {}, s.bt = !1, this.q = t[2], this.d = t[0] ? "d" : "m", _(this, ["eD"]), new ft(this.d), this.d === "m" && new pt, s.e = new t[1], this.Lt(), T(document, "a", "click", this.eD), new t[3](e => this.S(e))
        }
        Lt() {
            let t = document.readyState !== "complete";
            onload = () => setTimeout(() => t = !1, 0), onpopstate = s => {
                t && document.readyState === "complete" && (it(s), s.stopImmediatePropagation());
                let e = _A;
                $(e.config.routes) || (e.B ? this.ft() : (e.B = !0, this.out(Fs(location.pathname), "back")))
            }
        }
        eD(t) {
            let s = _A,
                e = t.target,
                o = !1,
                r = !1;
            for (; e;) {
                let n = e.tagName;
                if (n === "A") {
                    o = !0;
                    break
                }
                if ((n === "INPUT" || n === "BUTTON") && e.type === "submit") {
                    r = !0;
                    break
                }
                e = e.parentNode
            }
            if (o) {
                let n = e.href,
                    h = new URL(n).protocol;
                if (!e.hasAttribute("target") && h !== "mailto:" && h !== "tel:" && (it(t), !s.B)) {
                    let l = n.replace(/^.*\/\/[^/]+/, "");
                    if (l === s.route.new.url) return;
                    s.B = !0, this.out(l, e)
                }
            } else r && it(t)
        }
        S(t) {
            let s = _A,
                e = s.route.new.url;
            Rs({
                url: e + "?device=" + this.d,
                type: "html",
                success: o => {
                    let r = JSON.parse(o);
                    s.config.routes = r.routes, s.data = r.data, this.cache = r.cache, this.add(document.body, "afterbegin", r.body), this.m = p.id("m"), this.add(this.m, "beforeend", this.cache[e].html), this.q = new this.q, t()
                }
            })
        }
        out(t, s) {
            zs(t);
            let e = _A;
            e.target = s, e.bt = s === "back", e.page.update = () => {
                this.in()
            }, this.q.out()
        } in () {
            let t = _A,
                s = this.cache[t.route.new.url];
            document.title = s.title, t.target !== "back" && this.ft(), t.page.insertNew = () => this.add(this.m, "beforeend", s.html), t.page.removeOld = () => {
                let e = this.m.children[0];
                e.parentNode.removeChild(e)
            }, this.q.in()
        }
        add(t, s, e) {
            t.insertAdjacentHTML(s, e)
        }
        ft() {
            let s = _A.route.new.url;
            history.pushState({
                page: s
            }, "", s)
        }
    };
    var mt = class {
        constructor() {
            this._ = [], this.l = 0, this.t = !1, this.ff = ps.wt, _(this, ["fn"]);
            let t = document;
            T(t.body, "a", "wheel", this.fn), T(t, "a", "keydown", this.fn)
        }
        a(t) {
            this._.push(t), this.l++
        }
        r(t) {
            let s = this.l;
            for (; s--;)
                if (this._[s].id === t) {
                    this._.splice(s, 1), this.l--;
                    return
                }
        }
        fn(t) {
            this.e = t, this.eT = t.type, this.eK = t.key, this.l > 0 && !this.t && (this.t = !0, this.run())
        }
        run() {
            this.eT === "wheel" ? this.w() : this.eT === "keydown" && this.k()
        }
        w() {
            let t = this.e,
                s = t.wheelDeltaY,
                e = this.ff && t.deltaMode === 1 ? .833333 : .555556;
            this.s = -s * e, this.cb("w")
        }
        k() {
            let t = this.eK,
                s = "Arrow",
                e = t === s + "Up" || t === s + "Left",
                o = t === " ";
            if (e || t === s + "Down" || t === s + "Right" || o) {
                let r = 100;
                e ? r *= -1 : o && (r = this.e.shiftKey ? -1 : 1, r *= _A.P.h - 40), this.s = r, this.cb("k")
            } else this.t = !1
        }
        cb(t) {
            let s = this.l;
            for (; s--;) {
                let e = this._[s];
                t !== "w" && !e.k || e.cb(this.s)
            }
            this.t = !1
        }
    };
    var Is = new mt,
        Ds = 0,
        ut = class {
            constructor(t) {
                this.o = t, this.i = Ds, Ds++
            }
            on() {
                Is.a({
                    id: this.i,
                    cb: this.o.cb,
                    k: this.o.k
                })
            }
            off() {
                Is.r(this.i)
            }
        };
    var gt = class {
        constructor(t) {
            this.cb = t.cb, this.el = L(t, "el") ? Z.el(t.el)[0] : document, _(this, ["run"])
        }
        on() {
            this.l("a")
        }
        off() {
            this.l("r")
        }
        l(t) {
            T(this.el, t, "pointermove", this.run)
        }
        run(t) {
            this.cb(t.pageX, t.pageY, t)
        }
    };
    var xt = class {
        constructor() {
            this.b = !1, this.min = 0, this.Y = !1, this.K = !1, this.prev = 0, _(this, ["vFn", "move", "down", "up"]), this.v = new ut({
                cb: this.vFn,
                k: !0
            }), this.dt = new gt({
                cb: this.move
            })
        }
        S() {
            let t = _A.config.routes,
                s = Object.keys(t),
                e = s.length;
            this._ = {};
            for (let o = 0; o < e; o++) {
                let r = s[o];
                this._[r] = {
                    R: 0,
                    A: 0
                }
            }
        }
        init() {
            let t = _A;
            this.url = t.route.new.url, this.isWd = t.is.wd, this.mt(0), this.resize()
        }
        resize() {
            let t = _A,
                s = t.is,
                {
                    h: e
                } = t.P,
                {
                    hw: o
                } = t.it,
                r = t.e.p().children,
                n = 0;
            if (s.ad) n = 0;
            else if (s.wd) {
                let h = r.length;
                for (let a = 0; a < h; a++) n += F(r[a]).height;
                let l = o >= .6 ? .6 : o;
                n += F(r[0]).height + e * l
            } else {
                let h = r.length;
                for (let l = 0; l < h; l++) n += F(r[l]).height
            }
            this.max = Math.max(n - e, 0), this.max = N(this.max), this.mt(this.ot(this._[this.url].A))
        }
        vFn(t) {
            if (!this.Y) {
                let s = this.isWd ? this._[this.url].A + t : this.ot(this._[this.url].A + t);
                this.J(s)
            }
        }
        J(t) {
            this._[this.url].A = t
        }
        down(t) {
            it(t), !(t.target.tagName === "A" || t.button === 2 || t.ctrlKey && t.button === 1) && (this.Y = !0, this.K = !1, this.start = {
                x: t.pageX,
                y: t.pageY
            }, this.A = this._[this.url].A, this.Z = this.A)
        }
        move(t, s, e) {
            if (it(e), this.Y) {
                let o = Math.abs(t - this.start.x),
                    r = Math.abs(s - this.start.y);
                this.K = o > 6 || r > 6, this.K && (s > this.prev && this.A === this.min ? this.start.y = s - (this.Z - this.min) / 2 : s < this.prev && this.A === this.max && (this.start.y = s - (this.Z - this.max) / 2), this.prev = s, this.A = 2 * -(s - this.start.y) + this.Z, this.A = this.ot(this.A), this.J(this.A))
            }
        }
        up() {
            this.Y && (this.Y = !1, this.K = !1)
        }
        loop() {
            this.b = !1;
            let t = this.url,
                s = this.max,
                e = N(this._[t].R),
                o = ls(e, this._[t].A, 3);
            if (this.isWd && o) {
                let r = e < 0;
                if (r || e > s) {
                    let h = s * (r ? 1 : -1);
                    this._[t].R += h, this._[t].A += h
                }
            }
            o && (this._[t].R = H(this._[t].R, this._[t].A, .09)), o && !this.b && (this.b = !0)
        }
        mt(t) {
            let s = this._[this.url];
            s.A = t, s.R = t, this.A = t, this.Z = t
        }
        ot(t) {
            return N(J(this.min, this.max, t))
        }
        l(t) {
            var s = document;
            T(s, t, "pointerdown", this.down), T(s, t, "pointerup", this.up)
        }
        on() {
            this.v.on(), this.dt.on(), this.l("a")
        }
        off() {
            this.v.off(), this.dt.off(), this.l("r")
        }
    };
    var yt = class {
        constructor() {
            let t = _A;
            this.isWd = t.is.wd, this._ = [], this.D = 0, this.url = t.route.new.url;
            let s = t.e.p().children;
            for (let e of s) w.co(e, "_ns") || (this._[this.D] = {
                dom: e,
                I: {}
            }, this.D++);
            this.resize()
        }
        resize() {
            var t = _A.P.h;
            let s = 0;
            for (let e of this._) {
                let o = F(e.dom).height,
                    r = s - t,
                    n = Math.max(s, 0) + o;
                e.I.s = r, e.I.e = n, e.U = !1, s += o
            }
            this.run()
        }
        run() {
            let t = _A.e.s,
                s = t.max,
                e = t._[this.url].R,
                o = this.D - 1;
            for (let r = 0; r < this.D; r++) {
                let n = this._,
                    h = n[r],
                    l = h.I;
                if (this.isWd && r <= 1) {
                    if (this.D > 3 && e > n[0].I.s && n[o].I.s <= e && !n[o].U) {
                        let a = e - s;
                        this.draw(n[r], a)
                    }
                    if (this.D <= 3 && e > n[0].I.s && n[1].U) {
                        let a = e - s;
                        this.draw(n[r], a)
                    }
                }
                e > l.s && e < l.e ? (h.U && (h.U = !1), this.draw(h, e)) : h.U || (h.U = !0, this.draw(h, e))
            }
        }
        draw(t, s) {
            V(t.dom, 0, N(-s), "px")
        }
    };
    var wt = class {
        constructor(t) {
            this.cb = t.cb, this.el = L(t, "el") ? Z.el(t.el)[0] : document, _(this, ["run"])
        }
        on() {
            this.l("a")
        }
        off() {
            this.l("r")
        }
        l(t) {
            ["mousemove", "touchmove"].forEach(e => {
                T(this.el, t, e, this.run)
            })
        }
        run(t) {
            let s = t.target,
                e = s.tagName.toLowerCase(),
                o = s.type;
            e === "input" && o === "range" || this.cb(t.pageX, t.pageY, t)
        }
    };
    var _t = class {
        constructor() {
            this._ = [-1, -1], _(this, ["move"]), this.At = new wt({
                cb: this.move
            })
        }
        move(t, s) {
            this._ = [t, s]
        }
        run() {
            this.At.on()
        }
    };
    var vt = class {
        constructor() {
            _(this, ["fnD", "fnL"])
        }
        S() {
            let t = p.id("n-th");
            this.rt = p.tag("span", t)[0], this.nt = p.tag("span", t)[1], this.aT()
        }
        init() {}
        fnD() {
            let t = document.body;
            w.r(t, "_l"), w.a(t, "_d"), w.r(this.rt, "o"), w.a(this.nt, "o"), localStorage.setItem("th", "_d")
        }
        fnL() {
            let t = document.body;
            w.r(t, "_d"), w.a(t, "_l"), w.r(this.nt, "o"), w.a(this.rt, "o"), localStorage.setItem("th", "_l")
        }
        aT() {
            let t = localStorage.getItem("th");
            t && (t === "_d" ? this.fnD() : this.fnL())
        }
        l(t) {
            T(this.rt, t, "click", this.fnL), T(this.nt, t, "click", this.fnD)
        }
        on() {
            this.l("a")
        }
        off() {
            this.l("r")
        }
        loop() {}
    };
    var bt = class {
        S() {
            this.t()
        }
        init() {
            let s = _A.route.new.url,
                e = p.id("n-me").children;
            for (let o = 0; o < e.length; o++) {
                let r = e[o],
                    h = st(r, "href") === s ? "a" : "r";
                w[h](r, "o")
            }
        }
        updT() {
            let t = new Date,
                s = t.getTime() + t.getTimezoneOffset() * 6e4,
                e = 1,
                o = new Date(t.getFullYear(), 2, 31 - (new Date(t.getFullYear(), 2, 31).getDay() + 1) % 7),
                r = new Date(t.getFullYear(), 9, 31 - (new Date(t.getFullYear(), 9, 31).getDay() + 1) % 7);
            t >= o && t < r && (e = 2);
            let n = new Date(s + e * 36e5),
                h = n.getHours(),
                l = n.getMinutes(),
                a = h >= 12 ? "PM" : "AM",
                c = h % 12 || 12,
                f = l < 10 ? "0" + l : l,
                d = `Andalusia, Spain (${c}<span id="_ti-c">:</span>${f} ${a})`,
                u = p.id("_ti");
            u.innerHTML !== d && (u.innerHTML = d)
        }
        t() {
            this.updT(), setInterval(() => this.updT(), 6e4)
        }
    };
    var fs = function (i) {
            if (i.tagName === "circle") return 2 * st(i, "r") * Math.PI;
            if (i.tagName === "line") {
                let t = st(i, "x1"),
                    s = st(i, "x2"),
                    e = st(i, "y1"),
                    o = st(i, "y2");
                return s -= t, o -= e, Math.sqrt(s * s + o * o)
            }
            if (i.tagName === "polyline") {
                let t = 0,
                    s = null,
                    e = i.points.numberOfItems;
                for (let o = 0; o < e; o++) {
                    let r = i.points.getItem(o);
                    o > 0 && (t += As(r.x - s.x, r.y - s.y)), s = r
                }
                return t
            }
            return i.getTotalLength()
        },
        Cs = function (i) {
            let t = i.split(" "),
                s = [];
            for (let e = 0; e < t.length; e++) {
                let o = t[e].split(",");
                for (let r = 0; r < o.length; r++) {
                    let n = o[r];
                    n = isNaN(n) ? n : parseFloat(n), s.push(n)
                }
            }
            return s
        };
    var bs = Math.PI,
        Ns = i => Math.cos(i),
        ee = i => Math.sin(i),
        ie = i => {
            let t = {},
                [s, e, o, r] = i;
            t.l = s[0];
            let n = ["i", "o", "io"],
                h = [e, o, r];
            for (let l = 0; l < n.length; l++) {
                let a = h[l],
                    c = n[l];
                for (let f = 0; f < a.length; f++) {
                    let d = a[f],
                        u = c + (f + 1);
                    t[u] = d
                }
            }
            return t
        },
        C = ie([
            [i => i],
            [i => 1 - Ns(i * .5 * bs), i => i * i, i => i * i * i, i => i * i * i * i, i => i * i * i * i * i, i => i === 0 ? 0 : X(2, 10 * (i - 1))],
            [i => ee(i * .5 * bs), i => i * (2 - i), i => --i * i * i + 1, i => 1 - --i * i * i * i, i => 1 + --i * i * i * i * i, i => i === 1 ? 1 : 1 - X(2, -10 * i)],
            [i => -.5 * (Ns(bs * i) - 1), i => i < .5 ? 2 * i * i : .5 * (2 - X(2 * i - 2, 2)), i => i < .5 ? 4 * i * i * i : .5 * (2 + X(2 * i - 2, 3)), i => i < .5 ? 8 * i * i * i * i : 1 - 8 * X(2 * i - 2, 4), i => i < .5 ? 16 * i * i * i * i * i : 1 + 16 * X(2 * i - 2, 5), i => i === 0 ? 0 : i === 1 ? 1 : i < .5 ? .5 * X(2, 10 * (i * 2 - 1)) : .5 * (2 - X(2, -10 * (i * 2 - 1)))]
        ]),
        Hs = (i, t) => 1 - 3 * t + 3 * i,
        ks = (i, t) => 3 * t - 6 * i,
        Ls = (i, t, s) => ((Hs(t, s) * i + ks(t, s)) * i + 3 * t) * i,
        Bs = (i, t, s) => 3 * Hs(t, s) * i * i + 2 * ks(t, s) * i + 3 * t,
        oe = (i, t, s, e, o) => {
            let r, n, h = 0;
            do r = t + .5 * (s - t), n = Ls(r, e, o) - i, n > 0 ? s = r : t = r; while (Math.abs(n) > 1e-7 && ++h < 10);
            return r
        },
        re = (i, t, s, e) => {
            for (let o = 0; o < 4; ++o) {
                let r = Bs(t, s, e);
                if (r === 0) return t;
                t -= (Ls(t, s, e) - i) / r
            }
            return t
        },
        Os = ([i, t, s, e]) => {
            let o = new Float32Array(11);
            if (i !== s || t !== e)
                for (let r = 0; r < 11; ++r) o[r] = Ls(.1 * r, i, t);
            return r => {
                if (i === s && t === e || r === 0 || r === 1) return r;
                let n = 0,
                    h = 0;
                for (; h < 10 && o[h] <= r;) ++h, n += .1;
                --h;
                let l = (r - o[h]) / (o[h + 1] - o[h]),
                    a = n + .1 * l,
                    c = Bs(a, i, t);
                return c >= .001 ? re(r, a, i, t) : c === 0 ? a : oe(r, c, c + .1, i, t)
            }
        };
    var P = class {
        constructor(t) {
            _(this, ["loop", "run", "uS", "uL", "uP"]), this.v = this.init(t), this.r = new U(this.run)
        }
        init(t) {
            let s = {
                el: Z.el(t.el),
                e: {
                    W: t.e || "l"
                },
                d: {
                    C: t.d || 0,
                    curr: 0
                },
                delay: t.delay || 0,
                cb: t.cb || !1,
                r: t.r || 2,
                prog: 0,
                progE: 0,
                elapsed: 0
            };
            s.elL = s.el.length, L(t, "u") ? s.up = n => t.u(s) : L(t, "svg") ? s.up = this.uS : L(t, "line") ? s.up = this.uL : s.up = this.uP;
            let {
                p: e = !1,
                O: o = !1,
                L: r = !1
            } = t;
            if (e) s.prop = {}, s.propI = [], s.propL = Object.keys(e).length, Object.entries(e).forEach(([n, [h, l, a = "%"]], c) => {
                let d = n.charAt(0) === "r" ? "r2" : n;
                s.prop[c] = {
                    name: n,
                    C: {
                        start: h,
                        end: l
                    },
                    curr: h,
                    start: h,
                    end: l,
                    unit: a
                }, s.propI[d] = c
            });
            else if (o) {
                let {
                    type: n,
                    start: h,
                    end: l
                } = o, a = n === "polygon" ? "points" : "d", c = h || Ga(s.el[0], a), f = fs(c), d = fs(l);
                s.O = {
                    type: n,
                    attr: a,
                    end: l,
                    start: c,
                    curr: c,
                    originArr: {
                        start: f,
                        end: d
                    },
                    arr: {
                        start: f,
                        end: d
                    },
                    arrL: f.length,
                    val: []
                }
            } else if (r) {
                let n = z(r.start) ? (100 - r.start) / 100 : 1,
                    h = z(r.end) ? (100 - r.end) / 100 : 0;
                s.L = {
                    dashed: r.dashed,
                    Q: {
                        start: n,
                        end: h
                    },
                    j: [],
                    C: {
                        start: [],
                        end: []
                    },
                    curr: [],
                    start: [],
                    end: []
                };
                for (let l = 0; l < s.elL; l++) {
                    let a = r.elWL || s.el[l];
                    s.L.j[l] = fs(a);
                    let c;
                    if (s.L.dashed) {
                        let f = s.L.dashed,
                            d = 0,
                            u = f.split(/[\s,]/),
                            m = u.length;
                        for (let x = 0; x < m; x++) d += parseFloat(u[x]) || 0;
                        let y = "",
                            g = Math.ceil(s.L.j[l] / d);
                        for (let x = 0; x < g; x++) y += f + " ";
                        c = y + "0 " + s.L.j[l]
                    } else c = s.L.j[l];
                    s.el[l].style.strokeDasharray = c, s.L.C.start[l] = s.L.Q.start * s.L.j[l], s.L.C.end[l] = s.L.Q.end * s.L.j[l], s.L.curr[l] = s.L.C.start[l], s.L.start[l] = s.L.C.start[l], s.L.end[l] = s.L.C.end[l]
                }
            }
            return s
        }
        play(t) {
            this.pause(), this.u(t), this.delay.run()
        }
        pause() {
            this.r.stop(), this.delay && this.delay.stop()
        }
        u(t) {
            let s = t || {},
                {
                    v: e
                } = this,
                o = L(s, "reverse") ? "start" : "end";
            if (L(e, "prop")) {
                let r = Object.keys(e.prop);
                for (let n = 0; n < e.propL; n++) {
                    let h = r[n],
                        l = e.prop[h];
                    if (l.end = l.C[o], l.start = l.curr, L(s, "p") && L(s.p, h)) {
                        let a = s.p[h];
                        L(a, "newEnd") && (l.end = a.newEnd), L(a, "newStart") && (l.start = a.newStart)
                    }
                }
            } else if (L(e, "svg")) {
                let {
                    O: r
                } = e;
                r.arr.start = L(s, "svg") && L(s.O, "start") ? s.O.start : Cs(r.curr), r.arr.end = L(s, "svg") && L(s.O, "end") ? s.O.end : r.originArr[o]
            } else if (L(e, "line")) {
                let {
                    L: r
                } = e;
                for (let n = 0; n < e.elL; n++) r.start[n] = r.curr[n];
                if (L(s, "line") && L(s.L, "end")) {
                    r.Q.end = (100 - s.L.end) / 100;
                    for (let n = 0; n < e.elL; n++) r.end[n] = r.Q.end * r.j[n]
                } else
                    for (let n = 0; n < e.elL; n++) r.end[n] = r.C[o][n]
            }
            e.d.curr = L(s, "d") ? s.d : N(e.d.C - e.d.curr + e.elapsed), e.e.W = s.e || e.e.W, e.e.calc = ct(e.e.W) ? C[e.e.W] : Os(e.e.W), e.delay = (L(s, "delay") ? s : e).delay, e.cb = (L(s, "cb") ? s : e).cb, e.prog = e.progE = e.d.curr === 0 ? 1 : 0, this.delay = new Y(this.loop, e.delay)
        }
        loop() {
            this.r.run()
        }
        run(t) {
            let {
                v: s
            } = this;
            s.prog === 1 ? (this.pause(), s.up(), s.cb && s.cb()) : (s.elapsed = J(0, s.d.curr, t), s.prog = J(0, 1, s.elapsed / s.d.curr), s.progE = s.e.calc(s.prog), s.up())
        }
        uP() {
            let {
                prop: t,
                propI: s,
                propL: e,
                elL: o
            } = this.v;
            for (; e--;) t[e].curr = this.lerp(t[e].start, t[e].end);
            let r = L(s, "x") ? t[s.x].curr + t[s.x].unit : 0,
                n = L(s, "y") ? t[s.y].curr + t[s.y].unit : 0,
                h = r + n === 0 ? 0 : `translate3d(${r},${n},0)`,
                l = L(s, "r") ? `${t[s.r].name}(${t[s.r].curr}deg)` : 0,
                a = L(s, "r2") ? `${t[s.r2].name}(${t[s.r2].curr}deg)` : 0,
                c = L(s, "s") ? `${t[s.s].name}(${t[s.s].curr})` : 0,
                f = h + l + a + c === 0 ? 0 : [h, l, a, c].filter(u => u !== 0).join(" "),
                d = L(s, "o") ? t[s.o].curr : -1;
            for (; o-- && !$(this.v.el[o]);) {
                let u = this.v.el[o];
                f !== 0 && (u.style.transform = f), d >= 0 && (u.style.opacity = d)
            }
        }
        uS() {
            let {
                v: t
            } = this, {
                O: s
            } = t, {
                arr: e,
                arrL: o
            } = s, r = "";
            for (let n = 0; n < o; n++) s.val[n] = isNaN(e.start[n]) ? e.start[n] : this.lerp(e.start[n], e.end[n]), r += s.val[n] + " ", s.curr = r.trim();
            for (let n = 0; n < t.elL && !$(t.el[n]); n++) Es(t.el[n], s.attr, s.curr)
        }
        uL() {
            let {
                v: t
            } = this, {
                L: s,
                elL: e
            } = t;
            for (let o = 0; o < e; o++) {
                let {
                    el: r
                } = t, n = r[o].style;
                s.curr[o] = lerp(s.start[o], s.end[o]), n.strokeDashoffset = s.curr[o], t.prog === 0 && (n.opacity = 1)
            }
        }
        lerp(t, s) {
            let {
                v: e
            } = this;
            return N(R(t, s, e.progE), e.r)
        }
    };
    var Lt = class {
        constructor() {
            _(this, ["fn"])
        }
        init() {
            this.b = _A.is.ho || _A.is.wo || _A.is.ar, this.b && (this.f0 = p.id("f0"), this.ic = p.id("f0-ic"), this.n = p.id("n-me").children, this.resize())
        }
        resize() {
            let {
                h: t
            } = _A.P;
            this.b && (this.I = {
                s: F(this.f0).top,
                e: F(this.f0).top + this.f0.offsetHeight + t
            })
        }
        fn(t) {
            let s = _A,
                e = s.route.new.url,
                o = s.e.s,
                r = o._[e].R;
            new P({
                d: 1e3,
                u: n => {
                    let h = C.o3(n.prog),
                        l = R(r, 0, h);
                    o.J(l)
                }
            }).play()
        }
        l(t) {
            T(p.id("top"), t, "click", this.fn)
        }
        on() {
            this.l("a")
        }
        off() {
            this.l("r")
        }
        loop() {
            if (this.b) {
                let t = _A,
                    s = t.route.new.url,
                    e = t.e.s._[s].R;
                if (e >= this.I.s && e <= this.I.e) {
                    this.ic.style.transform = this.rotateFn(q(this.I.s, this.I.e, 0, 180, e)), p.id("n-co").style.opacity = 1;
                    for (let o = 0; o < this.n.length; o++) w.r(this.n[o], "o")
                } else p.id("n-co").removeAttribute("style"), _A.is.ho ? w.a(this.n[0], "o") : _A.is.wo ? w.a(this.n[1], "o") : _A.is.ar && w.a(this.n[2], "o")
            }
        }
        rotateFn(t) {
            return `rotate(${t}deg)`
        }
    };
    var At = class {
        constructor() {
            _(this, ["seFn", "fnT"])
        }
        init() {
            let t = _A;
            this.url = t.route.new.url;
            let s = _A.T._[this.url],
                e = t.e.p();
            this.seC = p.id("ho-se-co");
            let o = p.cl("_li", this.seC.children[1]),
                r = p.cl("_li", this.seC.children[2]);
            this.arr = [...o, ...r], this.arrL = this.arr.length, this.arrM = [], this.img = p.cl("_me", e), this.tex = s.plane.main, this.texL = s.planeL.main, this.imgF = p.id("f0-me"), this.texF = s.plane.footer, this.texFL = s.planeL.footer, this.y = [], this.yF = [], this.resize()
        }
        resize() {
            let t = _A,
                s = t.e.s._[this.url].R;
            for (let r = 0; r < this.texL; r++) {
                let n = this.img[r],
                    {
                        lerp: h,
                        ease: l
                    } = this.tex[r].move,
                    a = F(n),
                    c = a.top + s;
                h.x = a.left, h.w = n.offsetWidth, h.h = n.offsetHeight, h.opacity = r > 2 ? 0 : 1, this.y[r] = c, r > 1 && this.arrM.push(this.tex[r])
            }
            let e = F(this.imgF);
            for (let r = 0; r < this.texFL; r++) {
                let n = this.texF[r].move.lerp,
                    h = e.top + s;
                n.x = e.left, n.w = this.imgF.offsetWidth, n.h = this.imgF.offsetHeight, n.opacity = 1, this.yF[r] = h
            }
            let o = p.id("ho-bi");
            this.I = {
                s: ot(o) - t.P.h,
                e: ot(o) + o.offsetHeight
            }, this.rangeF = {
                s: ot(this.imgF) - t.P.h,
                e: ot(this.imgF) + this.imgF.offsetHeight
            }, this.texSet()
        }
        texSet() {
            let s = _A.e.s._[this.url],
                e = s.R,
                o = s.A;
            for (let r = 0; r < this.texL; r++) {
                let n = this.tex[r].move.lerp;
                if (n.y = this.y[r] - H(e, o, .11), r === 1) {
                    let h = q(this.I.s, this.I.e, -.1, .1, e);
                    this.tex[r].move.ease.py = h
                }
            }
            for (let r = 0; r < this.texFL; r++) {
                let {
                    lerp: n,
                    ease: h
                } = this.texF[r].move;
                n.y = this.yF[r] - H(e, o, .11);
                let l = q(this.rangeF.s, this.rangeF.e, -.1, .1, e);
                h.py = l
            }
        }
        show(t) {
            let s = t.d,
                e = t.e,
                o = this.tex[0].move.ease;
            o.scale = .1, o.y = 0;
            let r = new P({
                d: s,
                u: n => {
                    o.scale = R(.1, 0, C[e](n.prog)), o.y = R(30, 0, C[e](n.prog))
                }
            });
            return {
                play: () => {
                    r.play()
                }
            }
        }
        seFn(t) {
            let s = t.currentTarget,
                e = as(s, this.arr),
                o = this.arrL;
            for (let r = 0; r < o; r++) {
                let n = r === e;
                w[n ? "a" : "r"](this.arr[r], "o");
                let l = this.arrM[r];
                l && (l.move.lerp.opacity = n ? 1 : 0)
            }
        }
        fnT(t) {
            let s = p.id("ho-se-co").children,
                e = p.id("ho-se-co0").children,
                o = e.length,
                r = t.target,
                n = cs.li(r);
            if (r.id !== e.id) {
                w.a(e[n], "o");
                for (let l = 0; l < o; l++) l !== n && w.r(e[l], "o");
                let h;
                n === 0 ? (w.a(s[1], "fx"), w.r(s[2], "fx"), h = 0) : (w.r(s[1], "fx"), w.a(s[2], "fx"), h = p.cl("_li", p.id("ho-se-co1")).length), this.seFn({
                    currentTarget: this.arr[h]
                })
            }
        }
        l(t) {
            let s = p.id("ho-se-co0").children;
            T(s[0], t, "click", this.fnT), T(s[2], t, "click", this.fnT);
            for (let e of this.arr) T(e, t, "mouseenter", this.seFn)
        }
        on() {
            this.l("a")
        }
        off() {
            this.l("r")
        }
        loop() {
            this.texSet()
        }
    };
    var Tt = class {
        constructor(t) {
            this.el = Z.el(t.el)[0], this.txt = this.el.innerHTML;
            let s = lt("div"),
                e = (s.innerHTML = this.txt, s.childNodes),
                o = e.length;
            this.arr = [];
            let r = 0;
            for (let n = 0; n < o; n++) {
                let h = e[n];
                if (h.nodeType === 3) {
                    let l = h.nodeValue.split(" "),
                        a = l.length;
                    for (let c = 0; c < a; c++) {
                        let f = l[c] === "" ? " " : l[c];
                        this.arr[r] = {
                            type: "txt",
                            word: f
                        }, r++
                    }
                } else if (h.tagName === "BR") this.arr[r] = {
                    type: "br"
                }, r++;
                else if (h.tagName === "A") {
                    let l = h.outerHTML,
                        a = h.textContent;
                    l = l.split(">" + a + "<"), this.arr[r] = {
                        type: "a",
                        start: l[0] + ">",
                        end: "<" + l[1],
                        word: a.split(" ")
                    }, r++
                }
            }
            this.arrL = this.arr.length
        }
        resize(t) {
            this.el.innerHTML = this.txt;
            let s = this.el.offsetWidth,
                e = lt("div"),
                o = e.style;
            o.visibility = "hidden", o.position = "absolute", o.whiteSpace = "nowrap";
            let r = getComputedStyle(this.el);
            o.fontFamily = this.gPV(r, "font-family"), o.fontSize = this.gPV(r, "font-size"), o.fontWeight = this.gPV(r, "font-weight"), o.letterSpacing = this.gPV(r, "letter-spacing"), document.body.prepend(e);
            let n = "",
                h = [],
                l = 0,
                a = "",
                c = "";
            for (let m = 0; m < this.arrL; m++) {
                let y = this.arr[m];
                if (y.type === "txt") {
                    let g = y.word,
                        x = g === " " ? "" : " ";
                    e.innerHTML = a + g, c = e.offsetWidth >= s ? (h[l++] = c.trim(), a = g + x) : (a = a + g + x, c + g + x)
                } else if (y.type === "a") {
                    let g = y.start,
                        x = y.end,
                        b = y.word,
                        A = b.length,
                        v = A - 1;
                    a = this.rLS(a), c = this.rLS(c);
                    for (let E = 0; E < A; E++) {
                        let I = b[E],
                            S = E === v ? "" : " ";
                        if (e.innerHTML = a + I, e.offsetWidth >= s) E === 0 ? h[l++] = c.trim() : (c = c.trim() + x, h[l++] = c), a = I + S, c = E === v ? g + I + x + S : g + I + S;
                        else {
                            a = a + I + S;
                            let D = I;
                            E === 0 && (D = g + D), E === v && (D += x), c = c + D + S
                        }
                    }
                } else y.type === "br" && (h[l++] = c.trim(), a = "", c = "")
            }
            c !== h[l - 1] && (c = c.trim()) !== "" && (h[l++] = c);
            let f = t.tag.start,
                d = t.tag.end,
                u = "";
            for (let m = 0; m < l; m++) {
                let y = h[m] === " " ? "&nbsp;" : h[m];
                u += f + y + d
            }
            e.parentNode.removeChild(e), this.el.innerHTML = u
        }
        rLS(t) {
            return t.replace(/\s?$/, "")
        }
        gPV(t, s) {
            return t.getPropertyValue(s)
        }
    };
    var Et = class {
        init() {
            this.url = _A.route.new.url, this.t = p.id("ho-ba-ti"), this.ab = p.id("ho-ab"), this.vi_ = p.id("ho-vi"), this.vi = this.vi_.children, this.se = p.id("ho-se-co"), this.p = Array.from(p.tag("p", this.ab)).map(t => new Tt({
                el: t
            })), this.resize()
        }
        resize() {
            let {
                h: t
            } = _A.P, {
                top: s,
                height: e
            } = F(this.vi_);
            this.abR = F(this.ab), this.abTop = ot(this.ab), this.viR = {
                s: s - t / 2,
                e: s + e
            }, this.p.forEach(o => {
                o.resize({
                    tag: {
                        start: '<div class="y_"><div class="y">',
                        end: "</div></div>"
                    }
                })
            })
        }
        show(t) {
            let s = t.d,
                e = t.e,
                o = this.t,
                r = new P({
                    el: o,
                    p: {
                        y: [15, 0]
                    },
                    d: s,
                    e
                });
            return {
                play: () => r.play()
            }
        }
        loop() {
            let t = _A,
                e = t.e.s._[this.url].R,
                o = this.abR.height,
                r = this.abTop,
                n = r + o / 2,
                h = t.P.h,
                l = r - h,
                a = r + o,
                c = (e - l) / (a - l),
                f = this.ab.children,
                d = f.length,
                u = c >= .5;
            if (e >= r && e <= n)
                for (let m = 0; m < d; m++) {
                    let y = e - this.abTop;
                    w[u ? m === 0 ? "r" : "a" : m === 1 ? "r" : "a"](f[m], "fx"), V(f[m], 0, y, "px")
                }
            e >= this.viR.s && e <= this.viR.e ? Array.from(this.vi).forEach(m => m.children[0].play()) : Array.from(this.vi).forEach(m => m.children[0].pause())
        }
        translateFn(t) {
            return `translate3d(0, ${t}%, 0)`
        }
    };
    var Rt = class {
        constructor() {
            this.gl = new At, this.F = new Et
        }
        init() {
            let t = _A;
            this.b = t.is.ho, this.b && (this.F.init(), this.gl.init())
        }
        resize() {
            this.b && (this.F.resize(), this.gl.resize())
        }
        on() {
            this.b && this.gl.on()
        }
        off() {
            this.b && this.gl.off()
        }
        loop() {
            this.b && (this.F.loop(), this.gl.loop())
        }
    };
    var Ft = class {
        constructor() {
            _(this, ["fnS"])
        }
        init() {
            let t = _A;
            this.url = t.route.new.url;
            let s = _A.T._[this.url],
                e = t.e.p();
            this.img = p.cl("_me", e), this.tex = s.plane.main, this.texL = s.planeL.main, this.imgF = p.id("f0-me"), this.texF = s.plane.footer, this.texFL = s.planeL.footer, this.y = [], this.yF = [], this.resize()
        }
        resize() {
            let t = _A,
                s = t.e.s._[this.url].R;
            for (let o = 0; o < this.texL; o++) {
                let r = this.img[o],
                    {
                        lerp: n
                    } = this.tex[o].move,
                    h = F(r),
                    l = h.top + s;
                n.x = h.left, n.w = r.offsetWidth, n.h = r.offsetHeight, n.opacity = o === 0 ? 1 : 0, this.y[o] = l
            }
            let e = F(this.imgF);
            for (let o = 0; o < this.texFL; o++) {
                let {
                    lerp: r
                } = this.texF[o].move, n = e.top + s;
                r.x = e.left, r.w = this.imgF.offsetWidth, r.h = this.imgF.offsetHeight, r.opacity = 1, this.yF[o] = n
            }
            this.rangeF = {
                s: 0,
                e: this.imgF.offsetHeight + t.P.h
            }, this.texSet()
        }
        texSet() {
            let t = _A.e.s._[this.url],
                s = t.R,
                e = t.A;
            for (let o = 0; o < this.texL; o++) {
                let r = this.tex[o].move.lerp;
                r.y = this.y[o] - H(s, e, .11)
            }
            for (let o = 0; o < this.texFL; o++) {
                let {
                    lerp: r,
                    ease: n
                } = this.texF[o].move;
                r.y = this.yF[o] - H(s, e, .11);
                let h = q(this.rangeF.s, this.rangeF.e, -.1, .1, s);
                n.py = h
            }
        }
        show(t) {
            let s = t.d,
                e = t.e,
                o = this.tex[0].move.ease;
            o.scale = .3, o.x = 80;
            let r = new P({
                d: s,
                u: n => {
                    let h = C[e](n.prog);
                    o.scale = R(.3, 0, h), o.x = R(80, 0, h)
                }
            });
            return {
                play: () => {
                    r.play()
                }
            }
        }
        loop() {
            this.texSet()
        }
        fnS(t) {
            let s = cs.cl(t.target, "wo-l-li");
            this.tex[s].move.lerp.opacity = 1, w.a(p.cl("wo-l-li")[s], "o");
            for (let e = 0; e < this.tex.length; e++) e !== s && (this.tex[e].move.lerp.opacity = 0, w.r(p.cl("wo-l-li")[e], "o"))
        }
        l(t) {
            let s = p.cl("wo-l-li");
            for (let e = 0; e < s.length; e++) T(s[e], t, "mouseenter", this.fnS)
        }
        on() {
            this.l("a")
        }
        off() {
            this.l("r")
        }
    };
    var St = class {
        constructor(t) {
            let s = t.index,
                e = t.delay;
            this.propArr = t.prop, this.propArrL = this.propArr.length, this.prop = [], this.prog = {
                show: {
                    start: s * e,
                    end: 1 - (t.length - 1 - s) * e
                },
                hide: {
                    start: 0,
                    end: 1
                }
            }, this.curr = [];
            for (let o = 0; o < this.propArrL; o++) {
                let r = this.propArr[o];
                this.curr[o] = r[1], this.prop[o] = {
                    round: r[0] === "y" || r[0] === "x" ? 3 : 6
                }
            }
        }
        prepare(t) {
            this.V = t.V;
            for (let s = t.$, e = 0; e < this.propArrL; e++) {
                let o = this.propArr[e],
                    r = o[1],
                    n = o[2];
                o[0] === "opacity" ? this.V ? (this.prop[e].start = s ? this.curr[e] : r, this.prop[e].end = n) : (this.prop[e].start = this.curr[e], this.prop[e].end = r) : this.V ? (this.prop[e].start = s ? this.curr[e] : r, this.prop[e].end = 0) : (this.prop[e].start = this.curr[e], this.prop[e].end = t.Tt ? n : r);
                let h = this.V && !s ? this.prog.show : this.prog.hide;
                this.prog.start = h.start, this.prog.end = h.end
            }
        }
        loop(t) {
            let s = t.el,
                e = t.elL,
                o = [0, 0],
                r = q(this.prog.start, this.prog.end, 0, 1, t.prog),
                n = t.rEase(r),
                h = "",
                l = "";
            for (let a = 0; a < this.propArrL; a++) {
                let c = this.propArr[a],
                    f = c[0],
                    d = this.prop[a];
                if (this.curr[a] = N(R(d.start, d.end, n), d.round), f === "y") {
                    let u = z(c[3]) ? "px" : "%";
                    o[1] = this.curr[a] + u
                } else if (f === "x") {
                    let u = z(c[3]) ? "px" : "%";
                    o[0] = this.curr[a] + u
                } else f === "rotateX" ? h = ` rotateX(${this.curr[a]}deg)` : f === "opacity" && (l = this.curr[a])
            }
            for (let a = 0; a < e; a++) {
                let c = s[a].style;
                c.transform = `translate3d(${o[0]},${o[1]},0)${h}`, l !== "" && (c.opacity = l)
            }
        }
    };
    var Mt = class {
        constructor(t) {
            this.delay = t.delay;
            let s = t.el,
                e = t.ch,
                o = t.prop,
                r = t.indexStart;
            this.random = t.random, this.length = t.length, this.element = [], this.elementL = [], this.obj = [], this.objL = s.length, this.randUniq = [];
            for (let n = t.objL, h = 0; h < this.objL; h++) this.element[h] = e === 2 ? s[h].children : [s[h]], this.elementL[h] = this.element[h].length, this.obj[h] = new St({
                index: r + h,
                length: n,
                delay: this.delay,
                prop: o
            }), this.randUniq[h] = h
        }
        prepare(t) {
            !t.$ && this.random && (this.randUniq = us.uni(this.objL));
            for (let s = 0; s < this.objL; s++) this.obj[s].prepare(t)
        }
        loop(t) {
            for (let s = t.prog, e = t.rEase, o = 0; o < this.objL; o++) this.obj[o].loop({
                el: this.element[this.randUniq[o]],
                elL: this.elementL[o],
                prog: s,
                rEase: e
            })
        }
    };
    var Q = class {
        constructor(t) {
            this.a = _A, this.delay = t.delay || 0;
            let s = t.lineStartTogether || !1,
                e = t.ch,
                o = t.random || !1,
                r = t.prop,
                n = t.el;
            $(n.length) && (n = [n]), this.lineL = n.length, this.start = r[0][1], this.objL = this.lineL;
            let h = n[0].children;
            e > 0 && this.lineL === 1 && h.length > 1 && (this.objL = h.length), this.L = [];
            let l = 0;
            for (let a = 0; a < this.lineL; a++) {
                let c = e === 0 ? [n[a]] : n[a].children;
                this.L[a] = new Mt({
                    length: this.lineL,
                    objL: this.objL,
                    indexStart: l,
                    ch: e,
                    el: c,
                    prop: r,
                    delay: this.delay,
                    random: o
                }), s || (l += this.L[a].objL)
            }
        }
        motion(t) {
            z(this.ht) && this.ht.pause();
            let s = t.N === "show",
                e = t.d,
                o = C[t.e],
                r = this.L,
                n = this.lineL,
                h = r[0].obj[0].curr[0],
                l = !1,
                a = t.delay;
            s || (l = this.start < 0 && h > 0 || this.start > 0 && h < 0 || Math.abs(h) < Math.abs(.3 * this.start)), s && this.$ && (a = 0);
            for (let f = 0; f < n; f++) r[f].prepare({
                V: s,
                $: this.$,
                Tt: l
            });
            let c = e / (s ? 1 - (this.objL - 1) * this.delay : 1);
            return this.ht = new P({
                delay: a,
                d: c,
                u: f => {
                    for (let d = f.prog, u = 0; u < n; u++) r[u].loop({
                        prog: d,
                        rEase: o
                    })
                },
                cb: () => {
                    this.$ = !1
                }
            }), {
                play: () => {
                    this.$ = !0, this.ht.play()
                }
            }
        }
    };
    var Pt = class {
        init() {
            this.y = p.cl("y_"), this.l = p.cl("l_")
        }
        show(t) {
            let s = t.d,
                e = t.e,
                o = new Q({
                    ch: 1,
                    el: this.y,
                    prop: [
                        ["y", 101, -101]
                    ],
                    delay: .02
                }),
                r = new Q({
                    ch: 1,
                    el: this.l,
                    prop: [
                        ["x", -100, 100]
                    ],
                    delay: .02
                }),
                n = o.motion({
                    N: t.N,
                    d: s,
                    e
                }),
                h = r.motion({
                    N: t.N,
                    d: s,
                    e
                });
            return {
                play: () => {
                    n.play(), h.play()
                }
            }
        }
    };
    var zt = class {
        constructor() {
            this.gl = new Ft, this.F = new Pt
        }
        init() {
            let t = _A;
            this.b = t.is.wo, this.b && (this.gl.init(), this.F.init())
        }
        resize() {
            this.b && this.gl.resize()
        }
        on() {
            this.b && this.gl.on()
        }
        off() {
            this.b && this.gl.off()
        }
        loop() {
            this.b && this.gl.loop()
        }
    };
    var It = class {
        constructor() {
            _(this, ["overFn", "popFn", "slFn"])
        }
        init() {
            let t = _A;
            this.url = t.route.new.url;
            let s = _A.T._[this.url],
                e = this.el = t.e.p();
            this.elNav = p.id("wd-n"), this.pop = p.id("wd-pop"), this.popMe = p.id("wd-pop-me"), this.popCl = p.id("wd-pop-cl"), this.popNe = p.id("wd-pop-ne"), this.popPr = p.id("wd-pop-pr"), this.popNo = p.id("wd-pop-cu"), this.img = p.cl("_me", e), this.imgL = p.cl("_pme", this.popMe), this.tex = s.plane.main, this.texL = s.planeL.main, this.y = [], this.s = [], this.o = [], this.p = [];
            for (let o = 0; o < this.texL; o++) this.s[o] = 0, this.o[o] = 1;
            this.lt = !1, this.isPop_ = !1, this.isPop = !1, this.animating = !1, this.popCur = -1, this.H = 0, this.resize()
        }
        resize() {
            let s = _A.e.s._[this.url].R;
            for (let e = 0; e < this.texL; e++) {
                let o = this.img[e],
                    r = this.imgL[e],
                    {
                        lerp: n,
                        ease: h
                    } = this.tex[e].move,
                    l = F(o),
                    a = F(r),
                    c = l.top + s;
                n.x = l.left, n.w = o.offsetWidth, n.h = o.offsetHeight, n.opacity = 1, h.opacity = 1, h.scale = 0, this.p[e] = {
                    s: {
                        x: l.left,
                        y: c,
                        w: o.offsetWidth,
                        h: o.offsetHeight
                    },
                    l: {
                        x: a.left,
                        y: a.top,
                        w: r.offsetWidth,
                        h: r.offsetHeight
                    }
                }, this.y[e] = c
            }
            this.isPop && this.popFn(), this.texSet()
        }
        texSet() {
            if (this.isPop_) return;
            let t = _A.e.s,
                s = t.max,
                o = t._[this.url].R;
            for (let r = 0; r < this.texL; r++) {
                let {
                    lerp: n
                } = this.tex[r].move;
                if (r <= 1)
                    if (o > this.y[0] && this.y[1] + this.img[1].offsetHeight < o) {
                        let h = o - s;
                        n.y = this.y[r] - h
                    } else n.y = this.y[r] - o;
                else n.y = this.y[r] - o
            }
            for (let r = 0; r < this.texL; r++) {
                let {
                    ease: n
                } = this.tex[r].move, h = r === this.over, l = 0;
                h && (l = this.animating ? 0 : .1), this.s[r] = H(this.s[r], l, .1), n.scale = this.s[r]
            }
        }
        show(t) {
            let s = _A,
                {
                    h: e
                } = s.P,
                o = t.d,
                r = t.e,
                n = .02;
            for (let l = 0; l < this.texL; l++) {
                let {
                    ease: a
                } = this.tex[l].move;
                a.y = 100
            }
            let h = [];
            for (let l = 0; l < this.texL; l++) {
                let a = l * n,
                    c = new P({
                        d: o,
                        delay: a,
                        u: f => {
                            let d = C[r](f.prog),
                                {
                                    ease: u
                                } = this.tex[l].move;
                            u.scale = R(.3, this.s[l], d), u.y = R(100, 0, d)
                        }
                    });
                h.push(c)
            }
            return {
                play: () => {
                    for (let l of h) l.play()
                }
            }
        }
        loop() {
            this.overFn(), this.texSet()
        }
        overFn() {
            let t = _A,
                s = -1,
                e = t.e.c._,
                o = e[0],
                r = e[1];
            for (let n = 0; n < this.texL; n++) {
                let {
                    lerp: h
                } = this.tex[n].move, l = o >= h.x && o <= h.x + h.w, a = r >= h.y && r <= h.y + h.h;
                if (l && a) {
                    s = n;
                    break
                }
            }
            this.over = s, this.el.style.cursor = this.over !== -1 ? "pointer" : "default"
        }
        ov(t) {
            this.lt = t.type === "mouseenter"
        }
        popFn() {
            if (this.animating) return;
            let e = _A.e.s._[this.url].R,
                o = ["x", "y", "w", "h"];
            if (!this.isPop && this.over === -1) return;
            this.isPop = !this.isPop, this.animating = !0, this.isPop && (this.popCur = this.over);
            let r = 990,
                n = "o5",
                h = [];
            for (let a = 0; a < this.texL; a++) {
                let {
                    lerp: c,
                    ease: f
                } = this.tex[a].move, u = (this.texL - a - 1 + 1) / this.texL, m = Math.max(r * u, r + 10), y = new P({
                    d: m,
                    u: g => {
                        let x = C.o5(g.prog);
                        for (let b = 0; b < o.length; b++) {
                            let A = o[b],
                                v = this.isPop ? this.p[a].l[A] : A === "y" ? c.y : this.p[a].s[A],
                                E = this.isPop ? A === "y" ? c.y : this.p[a].s[A] : this.p[a].l[A];
                            c[A] = R(E, v, x)
                        }
                        this.isPop ? this.popCur !== a && (f.opacity = R(1, 0, x)) : f.opacity !== 1 && (f.opacity = R(0, 1, x))
                    }
                });
                h.push(y)
            }
            let l = h.length;
            for (let a = 0; a < l; a++) h[a].play(), a === l - 1 && (this.isPop ? (w.a(p.id("n"), "h"), tt.n(this.el), w.a(this.pop, "fx"), w.r(this.elNav, "fx"), this.H = this.popCur, this.popNo.textContent = this.slPad(this.H)) : (w.r(p.id("n"), "h"), tt.a(this.el), w.r(this.pop, "fx"), w.a(this.elNav, "fx"), this.popCur = -1), new Y(() => this.animating = !1, 990).run(), new Y(() => this.isPop_ = this.isPop, this.isPop ? 1e3 : 0).run())
        }
        slFn(t) {
            let e = t.target.id;
            e === "wd-pop-ne" ? (this.H++, this.H > this.texL - 1 && (this.H = 0)) : e === "wd-pop-pr" && (this.H--, this.H < 0 && (this.H = this.texL - 1));
            for (let o = 0; o < this.texL; o++) {
                let {
                    ease: r
                } = this.tex[o].move;
                r.opacity = o === this.H ? 1 : 0
            }
            this.popNo.textContent = this.slPad(this.H)
        }
        slPad(t) {
            let s = t + 1;
            return s < 10 ? `0${s}` : s
        }
        l(t) {
            let s = ["enter", "leave"];
            T(this.el, t, "click", this.popFn), T(this.popCl, t, "click", this.popFn), T(this.popNe, t, "click", this.slFn), T(this.popPr, t, "click", this.slFn);
            for (let e = 0; e < 2; e++) T(this.el, t, "mouse" + s[e], this.ov)
        }
        on() {
            this.l("a")
        }
        off() {
            this.l("r")
        }
    };
    var Dt = class {
        constructor() {
            this.gl = new It
        }
        init() {
            let t = _A;
            this.b = t.is.wd, this.b && (w.co(p.id("n-co"), "o") && w.r(p.id("n-co"), "o"), this.gl.init())
        }
        resize() {
            this.b && this.gl.resize()
        }
        on() {
            this.b && this.gl.on()
        }
        off() {
            this.b && this.gl.off()
        }
        loop() {
            this.b && this.gl.loop()
        }
    };
    var Ct = class {
        constructor() {
            _(this, ["overFn", "ov"])
        }
        init() {
            let t = _A;
            this.url = t.route.new.url;
            let s = _A.T._[this.url],
                e = t.e.p();
            this.el = p.id("ar_"), this.img = p.cl("_me", e), this.tex = s.plane.main, this.texL = s.planeL.main, this.imgF = p.id("f0-me"), this.texF = s.plane.footer, this.texFL = s.planeL.footer, this.y = [], this.yF = [], this.bw = [];
            for (let o = 0; o < this.texL; o++) this.bw[o] = 0;
            this.resize()
        }
        resize() {
            let t = _A,
                s = t.e.s._[this.url].R;
            for (let o = 0; o < this.texL; o++) {
                let r = this.img[o],
                    n = this.tex[o].move.lerp,
                    h = F(r),
                    l = h.top + s;
                n.x = h.left, n.w = r.offsetWidth, n.h = r.offsetHeight, n.opacity = 1, this.y[o] = l
            }
            let e = F(this.imgF);
            for (let o = 0; o < this.texFL; o++) {
                let r = this.texF[o].move.lerp,
                    n = e.top + s;
                r.x = e.left, r.w = this.imgF.offsetWidth, r.h = this.imgF.offsetHeight, r.opacity = 1, this.yF[o] = n
            }
            this.rangeF = {
                s: 0,
                e: this.imgF.offsetHeight + t.P.h
            }, this.texSet()
        }
        texSet() {
            let t = _A.e.s._[this.url],
                s = t.R,
                e = t.A;
            for (let o = 0; o < this.texL; o++) {
                let {
                    lerp: r
                } = this.tex[o].move;
                r.y = this.y[o] - H(s, e, .11)
            }
            for (let o = 0; o < this.texFL; o++) {
                let {
                    lerp: r,
                    ease: n
                } = this.texF[o].move;
                r.y = this.yF[o] - H(s, e, .11);
                let h = q(this.rangeF.s, this.rangeF.e, -.1, .1, s);
                n.py = h
            }
            for (let o = 0; o < this.texL; o++) {
                let {
                    lerp: r
                } = this.tex[o].move;
                if (this.lt && this.over !== -1) {
                    let n = o === this.over ? 0 : 1;
                    this.bw[o] = H(this.bw[o], n, .1)
                } else this.bw[o] = H(this.bw[o], 0, .1);
                r.bw = this.bw[o]
            }
        }
        show(t) {
            let s = t.d,
                e = t.e,
                o = 15;
            for (let n = 0; n < this.texL; n++) {
                let h = this.tex[n].move.ease;
                h.scale = .05, h.y = 150
            }
            let r = [];
            for (let n = 0; n < this.texL; n++) {
                let h = n * o,
                    l = new P({
                        d: s,
                        delay: h,
                        u: a => {
                            let c = C[e](a.prog),
                                f = this.tex[n].move.ease;
                            f.scale = R(.08, 0, c), f.y = R(150, 0, c)
                        }
                    });
                r.push(l)
            }
            return {
                play: () => {
                    for (let n of r) n.play()
                }
            }
        }
        loop() {
            this.texSet(), this.overFn()
        }
        overFn() {
            let t = _A,
                s = -1,
                e = t.e.c._,
                o = e[0],
                r = e[1];
            for (let n = 0; n < this.texL; n++) {
                let {
                    lerp: h
                } = this.tex[n].move, l = o >= h.x && o <= h.x + h.w, a = r >= h.y && r <= h.y + h.h;
                if (l && a) {
                    s = n;
                    break
                }
            }
            this.over = s;
            for (let n = 0; n < this.texL; n++) {
                let h = n === this.over,
                    l = p.cl("_li")[n];
                l && w[h ? "a" : "r"](l, "o")
            }
            this.el.style.cursor = this.over !== -1 ? "pointer" : "default"
        }
        ov(t) {
            this.lt = t.type === "mouseenter"
        }
        l(t) {
            let s = ["enter", "leave"];
            for (let e = 0; e < 2; e++) T(this.el, t, "mouse" + s[e], this.ov)
        }
        on() {
            this.l("a")
        }
        off() {
            this.l("r")
        }
    };
    var Nt = class {
        constructor() {
            this.gl = new Ct
        }
        init() {
            let t = _A;
            this.b = t.is.ar, this.b && this.gl.init()
        }
        resize() {
            this.b && this.gl.resize()
        }
        on() {
            this.b && this.gl.on()
        }
        off() {
            this.b && this.gl.off()
        }
        loop() {
            this.b && this.gl.loop()
        }
    };
    var Ht = class {
        init() {
            this.y = p.cl("y_"), this.l = p.cl("l_")
        }
        show(t) {
            let s = t.d,
                e = t.e,
                o = new Q({
                    ch: 1,
                    el: this.y,
                    prop: [
                        ["y", 101, -101]
                    ],
                    delay: .02
                }),
                r = new Q({
                    ch: 1,
                    el: this.l,
                    prop: [
                        ["x", -100, 100]
                    ],
                    delay: .02
                }),
                n = o.motion({
                    N: t.N,
                    d: s,
                    e
                }),
                h = r.motion({
                    N: t.N,
                    d: s,
                    e
                });
            return {
                play: () => {
                    n.play(), h.play()
                }
            }
        }
    };
    var kt = class {
        constructor() {
            _(this, ["slFn"])
        }
        init() {
            let t = _A;
            this.url = t.route.new.url;
            let s = _A.T._[this.url],
                e = t.e.p();
            this.img = p.cl("_me", e), this.tex = s.plane.main, this.texL = s.planeL.main, this.y = [], this.yF = [], this.no = p.id("ad-cu"), this.slIndex = 0, this.resize()
        }
        resize() {
            let s = _A.e.s._[this.url].R;
            for (let e = 0; e < this.texL; e++) {
                let o = this.img[e],
                    {
                        lerp: r
                    } = this.tex[e].move,
                    n = F(o),
                    h = n.top + s;
                r.x = n.left, r.w = o.offsetWidth, r.h = o.offsetHeight, r.opacity = e === 0 ? 1 : 0, this.y[e] = h
            }
            this.texSet()
        }
        texSet() {
            let t = _A.e.s._[this.url],
                s = t.R,
                e = t.A;
            for (let o = 0; o < this.texL; o++) {
                let r = this.tex[o].move.lerp;
                r.y = this.y[o] - H(s, e, .11)
            }
        }
        show(t) {
            let s = t.d,
                e = t.e,
                o = this.tex[0].move.ease;
            o.scale = .3, o.x = 80;
            let r = new P({
                d: s,
                u: n => {
                    let h = C[e](n.prog);
                    o.scale = R(.3, 0, h), o.x = R(80, 0, h)
                }
            });
            return {
                play: () => {
                    r.play()
                }
            }
        }
        loop() {
            this.texSet()
        }
        slFn(t) {
            let e = t.target.id;
            if (e === "ad-ne") {
                this.slIndex++, this.texL - 1 < this.slIndex && (this.slIndex = 0);
                for (let r = 0; r < this.texL; r++) {
                    let {
                        lerp: n
                    } = this.tex[r].move;
                    n.opacity = r === this.slIndex ? 1 : 0
                }
            } else if (e === "ad-pr") {
                this.slIndex--, 0 > this.slIndex && (this.slIndex = this.texL - 1);
                for (let r = 0; r < this.texL; r++) {
                    let {
                        lerp: n
                    } = this.tex[r].move;
                    n.opacity = r === this.slIndex ? 1 : 0
                }
            }
            let o = this.slIndex + 1 < 10 ? `0${this.slIndex+1}` : this.slIndex + 1;
            this.no.children[0].textContent = o
        }
        l(t) {
            let s = ["ad-pr", "ad-ne"];
            for (let e = 0; e < 2; e++) T(p.id(s[e]), t, "click", this.slFn)
        }
        on() {
            this.l("a")
        }
        off() {
            this.l("r")
        }
    };
    var Bt = class {
        constructor() {
            this.F = new Ht, this.gl = new kt
        }
        init() {
            let t = _A;
            this.b = t.is.ad, this.b && (this.F.init(), this.gl.init())
        }
        resize() {
            this.b && this.gl.resize()
        }
        on() {
            this.b && this.gl.on()
        }
        off() {
            this.b && this.gl.off()
        }
        loop() {
            this.b && this.gl.loop()
        }
    };
    var Ot = class {
        constructor() {
            _(this, ["fn", "sT"])
        }
        init() {
            let t = _A;
            this._ = p.id("f0"), this.url = _A.route.new.url, this.b = t.is.ho || t.is.wo || t.is.ar, this.resize()
        }
        resize() {
            if (this.b) {
                let t = F(this._);
                this.t = scrollY + t.top + t.height * .25
            }
        }
        fn() {
            let t = _A;
            if (t.tt) return;
            let s = t.is,
                e = p.id("n-me").children;
            this.b ? this.sT() : (s.wd ? e[1].click() : s.ad && e[2].click(), _A.tt = !0)
        }
        sT() {
            let s = _A.e.s,
                e = s._[this.url].R;
            new P({
                d: 1e3,
                u: o => {
                    let r = C.o4(o.prog),
                        n = R(e, this.t, r);
                    s.J(n)
                },
                cb: () => {
                    _A.tt = !1
                }
            }).play()
        }
        l(t) {
            T(p.id("n-co"), t, "click", this.fn)
        }
        on() {
            this.l("a")
        }
        off() {
            this.l("r")
        }
    };
    var jt = class {
        constructor() {
            this.F = new Ot
        }
        S() {
            this.tt = !1
        }
        init() {
            this.F.init()
        }
        resize() {
            this.F.resize()
        }
        on() {
            this.F.on()
        }
        off() {
            this.F.off()
        }
    };

    function ne(i) {
        let t = p.cl("p" + (i || ""));
        return t[t.length - 1]
    }
    var Gt = class {
        constructor() {
            let t = _A;
            t.tr = {
                d: 1e3,
                o: {
                    d: 500,
                    e: "l"
                },
                y: {
                    d: 1500,
                    e: "o6"
                },
                i: {
                    d: 300
                }
            }, _(this, ["resize", "loop"]), this.p = ne, this.raf = new U(this.loop), this.s = new xt, this.c = new _t, this.t = new vt, this.n = new bt, this.f = new Lt, this.ho = new Rt, this.wo = new zt, this.wd = new Dt, this.ar = new Nt, this.ad = new Bt, this.co = new jt
        }
        S() {
            this.s.S(), this.t.S(), this.n.S(), this.co.S()
        }
        init() {
            this.s.init(), this.i = new yt, this.t.init(), this.n.init(), this.f.init(), this.ho.init(), this.wo.init(), this.wd.init(), this.ar.init(), this.ad.init(), this.co.init(), this.loop()
        }
        resize() {
            this.s.resize(), this.i.resize(), this.f.resize(), this.ho.resize(), this.wo.resize(), this.wd.resize(), this.ar.resize(), this.ad.resize(), this.co.resize()
        }
        run() {
            new K(this.resize).on(), this.raf.run(), this.c.run()
        }
        on() {
            this.s.on(), this.t.on(), this.f.on(), this.ho.on(), this.wo.on(), this.wd.on(), this.ar.on(), this.ad.on(), this.co.on()
        }
        off() {
            this.s.off(), this.t.off(), this.f.off(), this.ho.off(), this.wo.off(), this.wd.off(), this.ar.off(), this.ad.off(), this.co.off()
        }
        loop() {
            this.s.loop(), this.f.loop(), this.ho.loop(), this.wo.loop(), this.wd.loop(), this.ar.loop(), this.ad.loop(), _A.e.s.b && this.i.run()
        }
    };
    var Ut = class {
        constructor(t) {
            let s = _A;
            this.t = t, this.prop = Object.keys(s.data.gl), this._ = {}, this.D = this.prop.length, this.static()
        }
        static() {
            let t = _A.route.new[this.t];
            for (let s = 0; s < this.D; s++) {
                let e = this.prop[s];
                this._[e] = e === t
            }
        }
        mutation() {
            let t = _A.route;
            for (let s = 0; s < this.D; s++) {
                let e = this.prop[s];
                this._[e] = e === t.new[this.t] || s === t.old[this.t]
            }
        }
    };

    function $t() {
        let i = new Float32Array(16);
        return i[0] = 1, i[5] = 1, i[10] = 1, i[15] = 1, i
    }

    function ds(i) {
        return i[0] = 1, i[1] = 0, i[2] = 0, i[3] = 0, i[4] = 0, i[5] = 1, i[6] = 0, i[7] = 0, i[8] = 0, i[9] = 0, i[10] = 1, i[11] = 0, i[12] = 0, i[13] = 0, i[14] = 0, i[15] = 1, i
    }

    function js(i, t) {
        let s = t[0],
            e = t[1],
            o = t[2],
            r = t[3],
            n = t[4],
            h = t[5],
            l = t[6],
            a = t[7],
            c = t[8],
            f = t[9],
            d = t[10],
            u = t[11],
            m = t[12],
            y = t[13],
            g = t[14],
            x = t[15],
            b = s * h - e * n,
            A = s * l - o * n,
            v = s * a - r * n,
            E = e * l - o * h,
            I = e * a - r * h,
            S = o * a - r * l,
            D = c * y - f * m,
            k = c * g - d * m,
            B = c * x - u * m,
            O = f * g - d * y,
            j = f * x - u * y,
            G = d * x - u * g,
            W = b * G - A * j + v * O + E * B - I * k + S * D;
        if (!W) return null;
        let M = 1 / W;
        return i[0] = (h * G - l * j + a * O) * M, i[1] = (o * j - e * G - r * O) * M, i[2] = (y * S - g * I + x * E) * M, i[3] = (d * I - f * S - u * E) * M, i[4] = (l * B - n * G - a * k) * M, i[5] = (s * G - o * B + r * k) * M, i[6] = (g * v - m * S - x * A) * M, i[7] = (c * S - d * v + u * A) * M, i[8] = (n * j - h * B + a * D) * M, i[9] = (e * B - s * j - r * D) * M, i[10] = (m * I - y * v + x * b) * M, i[11] = (f * v - c * I - u * b) * M, i[12] = (h * k - n * O - l * D) * M, i[13] = (s * O - e * k + o * D) * M, i[14] = (y * A - m * E - g * b) * M, i[15] = (c * E - f * A + d * b) * M, i
    }

    function Gs(i, t, s, e, o) {
        let r = 1 / Math.tan(t / 2),
            n = 1 / (e - o);
        return i[0] = r / s, i[1] = 0, i[2] = 0, i[3] = 0, i[4] = 0, i[5] = r, i[6] = 0, i[7] = 0, i[8] = 0, i[9] = 0, i[10] = (o + e) * n, i[11] = -1, i[12] = 0, i[13] = 0, i[14] = 2 * o * e * n, i[15] = 0, i
    }

    function he(i, t, s) {
        let e = t[0],
            o = t[1],
            r = t[2],
            n = t[3],
            h = t[4],
            l = t[5],
            a = t[6],
            c = t[7],
            f = t[8],
            d = t[9],
            u = t[10],
            m = t[11],
            y = t[12],
            g = t[13],
            x = t[14],
            b = t[15],
            A = s[0],
            v = s[1],
            E = s[2],
            I = s[3],
            S = s[4],
            D = s[5],
            k = s[6],
            B = s[7],
            O = s[8],
            j = s[9],
            G = s[10],
            W = s[11],
            M = s[12],
            os = s[13],
            rs = s[14],
            ns = s[15];
        return i[0] = A * e + v * h + E * f + I * y, i[1] = A * o + v * l + E * d + I * g, i[2] = A * r + v * a + E * u + I * x, i[3] = A * n + v * c + E * m + I * b, i[4] = S * e + D * h + k * f + B * y, i[5] = S * o + D * l + k * d + B * g, i[6] = S * r + D * a + k * u + B * x, i[7] = S * n + D * c + k * m + B * b, i[8] = O * e + j * h + G * f + W * y, i[9] = O * o + j * l + G * d + W * g, i[10] = O * r + j * a + G * u + W * x, i[11] = O * n + j * c + G * m + W * b, i[12] = M * e + os * h + rs * f + ns * y, i[13] = M * o + os * l + rs * d + ns * g, i[14] = M * r + os * a + rs * u + ns * x, i[15] = M * n + os * c + rs * m + ns * b, i
    }

    function Us(i, t) {
        return he(i, i, t)
    }

    function le(i, t, s) {
        let e = s[0],
            o = s[1],
            r = s[2],
            n = t[0],
            h = t[1],
            l = t[2],
            a = t[3],
            c = t[4],
            f = t[5],
            d = t[6],
            u = t[7],
            m = t[8],
            y = t[9],
            g = t[10],
            x = t[11],
            b = t[12],
            A = t[13],
            v = t[14],
            E = t[15];
        return i[0] = n, i[1] = h, i[2] = l, i[3] = a, i[4] = c, i[5] = f, i[6] = d, i[7] = u, i[8] = m, i[9] = y, i[10] = g, i[11] = x, i[12] = n * e + c * o + m * r + b, i[13] = h * e + f * o + y * r + A, i[14] = l * e + d * o + g * r + v, i[15] = a * e + u * o + x * r + E, i
    }

    function ms(i, t) {
        return le(i, i, t)
    }

    function ae(i, t, s) {
        let e = s[0],
            o = s[1],
            r = s[2];
        return i[0] = t[0] * e, i[1] = t[1] * e, i[2] = t[2] * e, i[3] = t[3] * e, i[4] = t[4] * o, i[5] = t[5] * o, i[6] = t[6] * o, i[7] = t[7] * o, i[8] = t[8] * r, i[9] = t[9] * r, i[10] = t[10] * r, i[11] = t[11] * r, i[12] = t[12], i[13] = t[13], i[14] = t[14], i[15] = t[15], i
    }

    function $s(i, t) {
        return ae(i, i, t)
    }

    function ce(i, t, s, e) {
        let [o, r, n] = e, h = Math.hypot(o, r, n);
        if (h < 1e-6) return null;
        h = 1 / h, o *= h, r *= h, n *= h;
        let l = Math.sin(s),
            a = Math.cos(s),
            c = 1 - a,
            f = t[0],
            d = t[1],
            u = t[2],
            m = t[3],
            y = t[4],
            g = t[5],
            x = t[6],
            b = t[7],
            A = t[8],
            v = t[9],
            E = t[10],
            I = t[11],
            S = o * o * c + a,
            D = r * o * c + n * l,
            k = n * o * c - r * l,
            B = o * r * c - n * l,
            O = r * r * c + a,
            j = n * r * c + o * l,
            G = o * n * c + r * l,
            W = r * n * c - o * l,
            M = n * n * c + a;
        return i[0] = f * S + y * D + A * k, i[1] = d * S + g * D + v * k, i[2] = u * S + x * D + E * k, i[3] = m * S + b * D + I * k, i[4] = f * B + y * O + A * j, i[5] = d * B + g * O + v * j, i[6] = u * B + x * O + E * j, i[7] = m * B + b * O + I * j, i[8] = f * G + y * W + A * M, i[9] = d * G + g * W + v * M, i[10] = u * G + x * W + E * M, i[11] = m * G + b * W + I * M, t !== i && (i[12] = t[12], i[13] = t[13], i[14] = t[14], i[15] = t[15]), i
    }

    function Ys(i, t, s) {
        return ce(i, i, t, s)
    }
    var Yt = class {
        constructor() {
            this.aspect = 1, this.state = {
                x: null
            }, this.projectionM4 = $t(), this.camM4 = $t()
        }
        resize(t) {
            let s = _A,
                e = s.T,
                o = Math.PI;
            t && (this.aspect = t.aspect);
            let r = 45,
                n = 1,
                h = 2500;
            this.projectionM4 = Gs(this.projectionM4, r * o / 180, this.aspect, n, h);
            let l = s._t;
            this.posOrigin = {
                x: l.w,
                y: -l.h,
                z: l.h / Math.tan(r * o / 360)
            };
            for (let a = 0; a < e.Et; a++) e.M[e.ut[a]].uniform.umm.E = this.projectionM4;
            this.render({
                x: null
            })
        }
        render(t) {
            return this.state.x !== t.x && (this.state.x = t.x, this.camM4 = ds(this.camM4), this.camM4 = ms(this.camM4, [this.posOrigin.x + t.x, this.posOrigin.y, this.posOrigin.z + t.z]), this.viewM4 = js(this.camM4, this.camM4)), this.viewM4
        }
    };
    var Wt = class {
        constructor() {
            this.gl = _A.T.gl, this.first = !0, this.state = {
                pgmCur: null,
                viewport: {
                    x: 0,
                    w: 0,
                    h: 0
                },
                framebuffer: null,
                face: null
            }, this.blend(), this.gl.getExtension("OES_standard_derivatives");
            let t = this.gl.getExtension("OES_vertex_array_object"),
                s = ["create", "bind"];
            this.vertexArray = {};
            for (let e = 0; e < 2; e++) {
                let o = s[e];
                this.vertexArray[o] = t[o + "VertexArrayOES"].bind(t)
            }
            this.size = {
                w: 0,
                h: 0
            }, this.cam = new Yt, this.roRqd = !1
        }
        viewport(t, s, e) {
            let o = this.state.viewport;
            (o.x !== t || o.w !== s || o.h !== e) && (o.x = t, o.w = s, o.h = e, this.gl.viewport(t * this.dpr, 0, s, e))
        }
        framebuffer(t) {
            this.state.framebuffer !== t && (this.state.framebuffer = t, this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, t))
        }
        face(t) {
            this.state.face !== t && (this.state.face = t, this.gl.enable(this.gl.CULL_FACE), this.gl.cullFace(this.gl[t]))
        }
        blend() {
            let t = this.gl;
            t.enable(t.BLEND), t.blendFuncSeparate(t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA, t.ONE, t.ONE_MINUS_SRC_ALPHA)
        }
        resize() {
            let t = _A,
                s = t.P,
                e = this.gl,
                o = 2;
            s.w < 600 ? o = 3 : s.w > 1920 && (o = 1.5), this.dpr = Math.min(devicePixelRatio, o);
            let r = s.w * this.dpr,
                n = s.h * this.dpr;
            e.canvas.width = r, e.canvas.height = n, (this.size.w !== r || this.size.h !== n) && (this.cam.resize({
                aspect: e.canvas.width / e.canvas.height
            }), t.T.clear(), this.size.w = r, this.size.h = n, this.roRqd = !0)
        }
        render(t) {
            let s = _A.T,
                e = s.st;
            s.b = !1;
            for (let o = 0; o < e.D; o++) {
                let r = e.prop[o];
                (e._[r] || this.first) && z(t[r]) && t[r].moving()
            }
            for (let o = 0; o < e.D; o++) {
                let r = e.prop[o];
                (e._[r] || this.first) && z(t[r]) && t[r].draw()
            }
            this.first && (this.first = !1), this.roRqd && (this.roRqd = !1)
        }
    };
    var Vt = class {
        constructor(t) {
            let s = _A.T;
            this.gl = s.gl, this.ren = s.ren, this.uniform = t.uniform, this.pts = t.pts, this.name = t.name, this.fbo = z(t.fbo), this.M = this.crP(t.shader);
            let e = this.uniform;
            e.umm = {
                type: "Matrix4fv"
            }, e.uvm = {
                type: "Matrix4fv"
            }, this.getL(e, "Uniform")
        }
        crP(t) {
            let s = this.gl,
                e = [this.crS(t.vertex, s.VERTEX_SHADER), this.crS(t.fragment, s.FRAGMENT_SHADER)],
                o = s.createProgram();
            return e.forEach(r => s.attachShader(o, r)), s.linkProgram(o), e.forEach(r => s.deleteShader(r)), o
        }
        crS(t, s) {
            let e = this.gl,
                o = e.createShader(s);
            return e.shaderSource(o, t), e.compileShader(o), o
        }
        getL(t, s) {
            for (let e in t) L(t, e) && (t[e].location = this.gl[`get${s}Location`](this.M, e))
        }
        setUniform() {
            for (let t in this.uniform)
                if (L(this.uniform, t)) {
                    let s = this.uniform[t],
                        e = s.location,
                        o = `uniform${s.type}`;
                    s.type.startsWith("Matrix") ? this.gl[o](e, !1, s.E) : this.gl[o](e, s.E)
                }
        }
        run() {
            this.texIndex = -1, this.ren.state.pgmCur !== this.name && (this.gl.useProgram(this.M), this.ren.state.pgmCur = this.name)
        }
    };
    var Xt = class {
        constructor(t) {
            var s = _A.T;
            this.gl = s.gl, this.ren = s.ren, this.M = t.M, this.mode = t.mode, this.face = t.face, this.attrib = t.attrib, this.type = t.type, this.ren.vertexArray.bind(null), this.M.getL(this.attrib, "Attrib"), this.modelM4 = $t()
        }
        setVAO() {
            var t = this.ren;
            this.vao = t.vertexArray.create(), t.vertexArray.bind(this.vao), this.setAttrib(), t.vertexArray.bind(null)
        }
        setAttrib() {
            var t, s, e, o = this.gl;
            for (let r in this.attrib) L(this.attrib, r) && (t = this.attrib[r], s = r === "index", e = t.data.constructor, t.type = e === Float32Array ? o.FLOAT : e === Uint16Array ? o.UNSIGNED_SHORT : o.UNSIGNED_INT, t.count = t.data.length / t.size, t.A = s ? o.ELEMENT_ARRAY_BUFFER : o.ARRAY_BUFFER, t.normalize = !1, o.bindBuffer(t.A, o.createBuffer()), o.bufferData(t.A, t.data, o.STATIC_DRAW), s || (o.enableVertexAttribArray(t.location), o.vertexAttribPointer(t.location, t.size, t.type, t.normalize, 0, 0)))
        }
        draw(t) {
            let s = this.gl,
                e = this.ren,
                o = t.move,
                r = o.lerp,
                n = o.ease,
                h = n.view;
            e.framebuffer(null), e.viewport(h, s.canvas.width, s.canvas.height), e.face(this.face), this.M.run(), this.modelM4 = ds(this.modelM4);
            let l = e.cam.render({
                    x: h,
                    y: 0,
                    z: 0
                }),
                a = Us(this.modelM4, l),
                c = r.x + n.x,
                f = r.y + n.y,
                d = r.w,
                u = r.h;
            a = $s(Ys(ms(a, [c, -f, 0]), r.rotate, [1, 0, 0]), [d, u, 1]);
            let m = this.M.uniform;
            if (this.type > 0) {
                let y = 1,
                    g = t.media.wh / (d / u);
                g < 1 && (y = 1 / g, g = 1);
                let x = r.scale + n.scale;
                m.r.E = [g * x, y * x]
            } else m.r.E = [1, 1];
            if (m.o.E = r.opacity * n.opacity, m.g.E = r.bw, m.mT.E = [n.mT, n.mB], m.mL.E = [n.mL, n.mR], m.mY.E = n.mY, m.of.E = [n.px, n.py], m.uvm.E = a, this.M.setUniform(), this.type > 0) {
                let y, g = this.attrib.a_t.tex,
                    x = g.length,
                    b = t.media.data;
                for (let A = 0; A < x; A++) this.tex(g[A]), b[A].E && (y = b[A].element)._.isPlaying && s.texImage2D(s.TEXTURE_2D, 0, s.RGBA, s.RGBA, s.UNSIGNED_BYTE, y.dom)
            }
            this.drawGL()
        }
        tex(t) {
            let s = this.gl,
                e = this.M;
            e.texIndex = e.texIndex + 1, s.activeTexture(s["TEXTURE" + e.texIndex]), s.bindTexture(s.TEXTURE_2D, t)
        }
        drawGL() {
            this.ren.vertexArray.bind(this.vao);
            let t = this.attrib.index;
            this.gl.drawElements(this.gl[this.mode], t.count, t.type, 0)
        }
    };

    function Ws(i) {
        let {
            p: t,
            z: s
        } = i, e = t.h, o = t.v, r = e - 1, n = o - 1, h = 1 / r, l = 1 / n, a = {
            mode: "TRIANGLE_STRIP",
            pos: {
                arr: [],
                size: s ? 3 : 2
            },
            index: [],
            uv: []
        }, c = 0;
        for (let g = 0; g < o; g++) {
            let x = g * l - 1;
            for (let b = 0; b < e; b++) a.pos.arr[c++] = b * h, a.pos.arr[c++] = x, s && (a.pos.arr[c++] = 0)
        }
        let f = 0,
            d = o - 1,
            u = o - 2,
            m = e - 1;
        for (let g = 0; g < d; g++) {
            let x = e * g,
                b = x + e,
                A = e * (g + 1);
            for (let v = 0; v < e; v++) {
                let E = b + v;
                a.index[f++] = x + v, a.index[f++] = E, v === m && g < u && (a.index[f++] = E, a.index[f++] = A)
            }
        }
        let y = 0;
        for (let g = 0; g < o; g++) {
            let x = 1 - g / n;
            for (let b = 0; b < e; b++) a.uv[y++] = b / r, a.uv[y++] = x
        }
        return a
    }
    var Vs = ["x", "y", "w", "h", "scale", "opacity", "bw", "rotate"],
        Xs = ["x", "y", "scale", "opacity", "mL", "mR", "mT", "mB", "mY", "px", "py", "view"],
        qs = ["scale", "opacity", "rotate"],
        pe = ["scale", "opacity", "mL", "mR", "mT", "mB", "mY", "px", "py"],
        Ks = (i, t) => i.reduce((s, e) => (s[e] = t, s), {}),
        at = class {
            constructor(t) {
                let s = _A;
                this.M = t.p, this.prop = t.prop, this._ = {
                    lerp: Ks(Vs, 0),
                    ease: Ks(Xs, 0)
                }, this._.lerp.scale = 1, this._.lerp.opacity = 1, this._.ease.opacity = 1, this.data = Ws({
                    p: this.M.pts,
                    z: !1
                });
                let e = (n, h, l) => n.reduce((a, c) => (h[c].forEach(f => {
                        a.push({
                            type: c,
                            prop: f,
                            r: l[c].includes(f) ? 6 : 3
                        })
                    }), a), []),
                    o = {
                        lerp: Vs,
                        ease: Xs
                    },
                    r = {
                        lerp: qs,
                        ease: pe
                    };
                this.all = e(["lerp", "ease"], o, r), this.allL = this.all.length, this.lerp = qs.map(n => ({
                    prop: n,
                    r: 6
                })), this.media = s.T.media[this.prop], this.et = Object.keys(this.media), this.St = this.et.length, this.plane = {}, this.planeL = {}, this.wh = {}, this.et.forEach(n => {
                    let h = this.media[n];
                    this.set(n, h, h.length)
                })
            }
            set(t, s, e) {
                let o = this._,
                    r = this.data;
                this.plane[t] = [], this.wh[t] = [];
                for (let n = 0; n < e; n++) {
                    let h = s[n],
                        l = new Xt({
                            type: 1,
                            M: this.M,
                            mode: r.mode,
                            face: "FRONT",
                            attrib: {
                                a_p: {
                                    size: r.pos.size,
                                    data: new Float32Array(r.pos.arr)
                                },
                                index: {
                                    size: 1,
                                    data: new Uint16Array(r.index)
                                },
                                a_t: {
                                    size: 2,
                                    tex: h.attrib,
                                    data: new Float32Array(r.uv)
                                }
                            }
                        });
                    l.setVAO(), this.plane[t].push({
                        move: ys(o),
                        save: ys(o),
                        visible: !1,
                        out: !0,
                        media: h,
                        wh: 0,
                        geo: l
                    }), this.wh[t].push(h.wh)
                }
                this.planeL[t] = this.plane[t].length
            }
            moving() {
                let t = _A,
                    s = t.T,
                    e = t.P.w,
                    o = t.P.h,
                    r = t.B || t.e.s.b || t.T.ren.roRqd;
                this.et.forEach((n, h) => {
                    this.plane[n].forEach((a, c) => {
                        let f = r;
                        f || (f = this.all.some(v => ls(a.move[v.type][v.prop], a.save[v.type][v.prop], v.r))), (f || a.media.wh !== this.wh[n][c]) && (this.wh[n][c] = a.media.wh, f = !0), f || (f = a.media.data.some(v => v.v && v.element._.isPlaying)), this.all.forEach(v => {
                            a.save[v.type][v.prop] = a.move[v.type][v.prop]
                        });
                        let {
                            x: d,
                            y: u,
                            w: m,
                            h: y,
                            opacity: g
                        } = a.save.lerp, x = a.save.ease, b = d < e && d + m > 0, A = u < o && u + y > 0;
                        a.visible = b && A && m > 0 && y > 0 && N(J(0, 1, g), 6) > 0 && x.mT < 1 && x.mB < 1 && x.mL < 1 && x.mR < 1, (s.b || f && a.visible) && (s.b = !0)
                    })
                })
            }
            draw() {
                let t = _A.T;
                this.et.forEach((s, e) => {
                    this.plane[s].forEach((r, n) => {
                        r.visible && t.b ? (r.out && (r.out = !1), r.media.data.forEach(h => {
                            h.v && h.element.play()
                        }), r.geo.draw(r)) : !r.visible && !r.out && (r.out = !0, r.media.data.forEach(h => {
                            h.v && h.element.pause()
                        }), r.geo.draw(r))
                    })
                })
            }
        };
    var Js = "precision highp float;attribute vec2 a_p;attribute vec2 a_t;uniform mat4 umm;uniform mat4 uvm;uniform float depth;uniform vec2 r;uniform vec2 v;uniform vec2 of;varying vec2 m;varying vec2 l;void main(){vec4 a=uvm*vec4(a_p.x,a_p.y,1.0,1.0);gl_Position=umm*a;m=(a_t-0.5)/r+0.5-of;l=(a.xy/v)+0.5;}";
    var Zs = `#extension GL_OES_standard_derivatives : enable
precision highp float;uniform sampler2D texture;varying vec2 m;varying vec2 l;uniform float o;uniform float g;uniform vec2 mT;uniform vec2 mL;uniform float mY;float d(float h,float i){float g=fwidth(i);return smoothstep(h-g,h+g,i);}vec3 f(vec3 b){return vec3((b.r+b.g+b.b)/3.0);}void main(){vec3 b;float c=1.0;b=texture2D(texture,m).rgb;b=mix(b,f(b),g);c=d(mT.x,1.0-l.y)*d(mT.y,l.y);c*=d(mL.x,l.x)*d(mL.y,1.0-l.x);gl_FragColor=vec4(b,o*c);}`;
    var me = {
            vertex: Js,
            fragment: Zs
        },
        qt = class {
            constructor() {
                this._ = {}, this.media = {}, this.b = !1, this.Mt = !1, this.st = new Ut("url"), this.gl = p.id("gl").getContext("webgl", {
                    antialias: !0,
                    alpha: !0
                }), _(this, ["resize", "loop"]), this.raf = new U(this.loop)
            }
            load() {
                this.ren = new Wt;
                let t = {
                    name: "default",
                    shader: me,
                    pts: {
                        h: 2,
                        v: 2
                    },
                    uniform: {
                        Pt: {
                            type: "1i",
                            E: 0
                        },
                        r: {
                            type: "2fv",
                            E: [1, 1]
                        },
                        o: {
                            type: "1f",
                            E: 0
                        },
                        g: {
                            type: "1f",
                            E: 0
                        },
                        of: {
                            type: "2fv",
                            E: [0, 0]
                        },
                        v: {
                            type: "2fv",
                            E: [0, 0]
                        },
                        mL: {
                            type: "2fv",
                            E: [0, 0]
                        },
                        mT: {
                            type: "2fv",
                            E: [0, 0]
                        },
                        mY: {
                            type: "1f",
                            E: 0
                        }
                    }
                };
                this.M = {
                    default: new Vt(t)
                }, this.ut = Object.keys(this.M), this.Et = this.ut.length
            }
            S() {
                let t = _A,
                    s = this.st,
                    e = t.route.new[s.t],
                    o = t.data.gl;
                for (let r = 0; r < s.D; r++) {
                    let n = s.prop[r];
                    (n === e || o[n].tex.preload) && (this._[n] = new at({
                        p: this.M.default,
                        prop: n
                    }))
                }
            }
            init() {
                let t = _A,
                    s = t.route.new[this.st.t],
                    e = t.data.gl[s];
                $(this._[s]) && e && (this._[s] = new at({
                    p: this.M.default,
                    prop: s
                }))
            }
            run() {
                new K(this.resize).on(), this.resize(), this.raf.run()
            }
            resize() {
                let t = _A,
                    s = t.P.w,
                    e = t.P.h;
                this.M.default.uniform.v.E = [s, e], this.ren.resize()
            }
            loop() {
                this.ren.render(this._)
            }
            clear() {
                this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
            }
        };
    var nt = class {
        constructor(t) {
            let s = _A,
                e = s.e,
                o = s.is,
                r = t.S,
                n = s.tr.o.d * .5,
                h = [],
                l = 1500,
                a = "o6";
            o.ho && (l = 1125), o.ho ? (h.push(e.ho.F.show({
                d: l,
                e: a
            })), h.push(e.ho.gl.show({
                d: l,
                e: a
            }))) : o.wo ? (h.push(e.wo.F.show({
                N: "show",
                d: l,
                e: a
            })), h.push(e.wo.gl.show({
                d: l,
                e: a
            }))) : o.wd ? h.push(e.wd.gl.show({
                d: l,
                e: a
            })) : o.ar ? h.push(e.ar.gl.show({
                d: l,
                e: a
            })) : o.ad && (h.push(e.ad.F.show({
                N: "show",
                d: l,
                e: a
            })), h.push(e.ad.gl.show({
                d: l,
                e: a
            }))), r ? new Y(() => {
                e.on(), s.B = !1, s.S = !1
            }, n).run() : new Y(() => {
                e.on(), s.B = !1
            }, n).run();
            let c = h.length;
            return {
                play: () => {
                    if (c > 0)
                        for (let f = 0; f < c; f++) h[f].play()
                }
            }
        }
    };
    var Kt = class {
        constructor() {
            this._ = [], this.d = 0
        }
        from(t) {
            this.d += L(t, "delay") ? t.delay : 0, t.delay = this.d, this._.push(new P(t))
        }
        play(t) {
            this.run("play", t)
        }
        pause() {
            this.run("pause")
        }
        run(t, s) {
            let e = 0,
                o = this._.length,
                r = s || void 0;
            for (; e < o;) this._[e][t](r), e++
        }
    };
    var Jt = class {
        constructor() {
            let s = _A.tr.i.d,
                e = new nt({
                    S: !0
                }),
                o = new Kt;
            o.from({
                el: "#lo-co",
                p: {
                    y: [0, -110]
                },
                d: s,
                e: "o4"
            }), o.from({
                el: "#lo-me",
                p: {
                    o: [1, 0]
                },
                d: s,
                e: "l",
                cb: () => {
                    p.id("lo-co_").remove(), p.id("lo-me").remove()
                }
            }), o.from({
                el: "#lo-bg",
                p: {
                    o: [1, 0]
                },
                d: s,
                e: "l",
                delay: s * 1.5,
                cb: () => {
                    p.id("lo").removeAttribute("class"), tt.n(p.id("lo"))
                }
            }), o.play(), new Y(() => {
                e.play()
            }, s * 1.5).run()
        }
    };
    var Zt = class {
        constructor(t) {
            let s = _A.T.gl,
                e = s.createTexture();
            s.bindTexture(s.TEXTURE_2D, e);
            let o;
            z(t.color) ? (o = "NEAREST", s.texImage2D(s.TEXTURE_2D, 0, s.RGB, 1, 1, 0, s.RGB, s.UNSIGNED_BYTE, new Uint8Array(t.color))) : z(t.data) ? (o = "NEAREST", s.texImage2D(s.TEXTURE_2D, 0, s.RGB, t.data.vert, t.data.hori, 0, s.RGB, s.FLOAT, new Float32Array(t.data.arr))) : z(t.fbo) ? (o = "LINEAR", s.texImage2D(s.TEXTURE_2D, 0, s.RGBA, t.fbo.w, t.fbo.h, 0, s.RGBA, s.FLOAT, null)) : (o = "LINEAR", s.texImage2D(s.TEXTURE_2D, 0, s.RGBA, s.RGBA, s.UNSIGNED_BYTE, t.obj));
            let r = ["S", "T", "MIN", "MAG"];
            for (let n = 0; n < 4; n++) {
                let h = n < 2 ? `WRAP_${r[n]}` : `${r[n]}_FILTER`,
                    l = n < 2 ? "CLAMP_TO_EDGE" : o;
                s.texParameteri(s.TEXTURE_2D, s[`TEXTURE_${h}`], s[l])
            }
            return e
        }
    };
    var Qt = class {
        constructor(t) {
            this.o = t, this.src = t.src.url, this.hasFormat = !ct(this.src), this.G = "", this.first = !0, this.preloadEl = p.id("lo-co-me"), this.hasFormat && (_(this, ["resize"]), this.ro = new et(this.resize), this.ro.on()), this.resize()
        }
        resize() {
            let t = this.o,
                s = t.gl,
                e = t.tex,
                o = t.layer,
                r = t.cb;
            if (_A.G !== this.G) {
                this.G = _A.G;
                let n = this.hasFormat ? this.src[this.G] : this.src,
                    h = new Image;
                h.onload = () => {
                    s && (o === 0 && (e.wh = h.width / h.height), e.data[o] = {
                        v: !1,
                        element: h
                    }, z(e.attrib[o]) && s.deleteTexture(e.attrib[o]), e.attrib[o] = new Zt({
                        obj: h
                    })), this.first && (this.first = !1, r())
                }, h.crossOrigin = "anonymous", h.src = n
            }
        }
    };
    var ts = class {
        constructor(t) {
            this.dom = t.dom, this.isPlaying = !1, this.isPause = !1
        }
        play() {
            this.isPause = !1, this.isPlaying || (this.dom.muted = !1, this.playPromise = this.dom.play(), this.playPromise.then(() => {
                this.isPlaying = !0, this.isPause && this.pause()
            }))
        }
        pause() {
            this.isPause = !0, this.isPlaying && (this.dom.pause(), this.isPlaying = !1, this.dom.muted = !0)
        }
    };
    var ht = class {
        constructor(t) {
            this.cb = t;
            let s = _A;
            this.isIntro = s.S, this.X = s.route.old.url, this.dom_ = p.id("lo-pr"), this.dom = this.dom_.children[0], this.dom.style.transition = "none", this.isIntro && (this.preEl = p.id("lo-me").children), V(this.dom_, 0, 0), V(this.dom, -110, 0), this.domStart = this.X ? -60 : -100, this.first = !0, this.loading = !1, this.no = 0, this.prevNo = 0, _(this, ["loop"]), this.raf = new U(this.loop), this.raf.run()
        }
        preload() {
            let t = _A,
                e = t.route.new.url,
                o = t.T,
                r = t.data.gl,
                n = Object.keys(r),
                h = n.length;
            if (this.loading = !0, this.texL = 0, this.X) this.gt({
                store: r[e].tex.store,
                url: e,
                gl: !0
            });
            else
                for (let l = 0; l < h; l++) {
                    let a = n[l],
                        c = r[a].tex;
                    !c.preload && e !== a || this.gt({
                        store: c.store,
                        url: a,
                        gl: !0
                    })
                }
            if (this.X) {
                let l = t.data.gl.cache,
                    a = 0,
                    c = Object.keys(o.media);
                for (let f = c.length - 1; f >= 0; f--) {
                    let d = c[f];
                    if (r[d].tex.delete && (a++, d !== e && a > l)) {
                        let m = o.media[d],
                            y = Object.keys(m),
                            g = y.length;
                        for (let x = 0; x < g; x++) {
                            let b = m[y[x]],
                                A = b.length;
                            for (let v = 0; v < A; v++) {
                                let E = b[v].data,
                                    I = b[v].layerL;
                                for (let S = 0; S < I; S++) L(E[S], "destroy") && E[S].destroy(), o.gl.deleteTexture(b[v].attrib[S])
                            }
                        }
                        delete o.media[d], delete o._[d]
                    }
                }
            }
        }
        gt(t) {
            let s = _A.T.media,
                e = t.url,
                o = t.store,
                r = Object.keys(o),
                n = r.length,
                h = t.gl;
            h && (s[e] = {});
            for (let l = 0; l < n; l++) {
                let a = r[l],
                    c = o[a],
                    f = c.length;
                h && (s[e][a] = []);
                for (let d = 0; d < f; d++) {
                    let u = c[d],
                        m = u.length;
                    h && (s[e][a][d] = {
                        attrib: [],
                        data: [],
                        layerL: m
                    });
                    for (let y = 0; y < m; y++) this.media({
                        src: u[y],
                        url: e,
                        element: a,
                        index: d,
                        layer: y,
                        gl: h
                    }), this.texL++
                }
            }
        }
        media(t) {
            let s = t.src,
                e = t.index,
                o = t.layer,
                r = t.gl,
                h = {
                    gl: r,
                    tex: r ? _A.T.media[t.url][t.element][e] : void 0,
                    layer: o,
                    src: s,
                    cb: () => this.no++
                };
            new(s.type === "img" ? Qt : ts)(h)
        }
        loop() {
            let t = _A;
            if (this.first && (this.first = !1, this.X && (rt(this.dom, 3e3, ".25,1,.5,1"), V(this.dom, this.domStart, 0))), !this.loading)
                if (this.X) {
                    let s = !1;
                    (t.is.wd || t.is.ad | t.is.wo | t.is.ar) && (s = !0), s && (rt(this.dom, 3500, "0.16, 1, 0.36, 1"), this.preload())
                } else rt(this.dom, 3500, "0.16, 1, 0.36, 1"), this.preload();
            if (this.no !== this.prevNo) {
                this.prevNo = this.no;
                let s = this.no / this.texL;
                if (this.isIntro) {
                    let e = N(R(0, 100, this.no / this.texL), 0);
                    p.id("lo-co-pr").textContent = this.pad(e) + "%";
                    let o = this.preEl.length,
                        r = Math.ceil(s * o);
                    for (let n = 0; n < o; n++) n < r ? w.a(this.preEl[n], "o") : w.r(this.preEl[n], "o")
                }
                V(this.dom, N(R(this.domStart, 0, s)), 0)
            }
            this.texL > 0 && this.no === this.texL && (V(this.dom_, 100.1, 0), rt(this.dom_, 800, "0.53, 0.23, 0.25, 1"), this.raf.stop(), this.cb())
        }
        pad(t) {
            return t.toString().padStart(3, "0")
        }
    };
    var ss = class {
        constructor(t) {
            let s = _A;
            t(() => {
                s.T = new qt, new ht(() => this.cb()), s.T.load()
            })
        }
        cb() {
            let t = _A,
                s = t.T,
                e = t.e;
            s.S(), e.S(), s.init(), e.init(), s.run(), e.run(), new Jt
        }
    };
    var es = class {
        constructor() {
            let t = _A,
                s = this.t = p.id("lo-bg"),
                {
                    d: e,
                    e: o
                } = t.tr.o;
            this.tA = new P({
                el: s,
                p: {
                    o: [0, 1]
                },
                d: e,
                e: o
            })
        }
        out(t) {
            tt.a(this.t), this.tA.play({
                cb: t.cb
            })
        } in () {
            let s = _A.T.st;
            s.mutation(), new nt({
                S: !1
            }).play(), this.tA.play({
                reverse: !0,
                cb: () => {
                    s.static(), tt.n(this.t)
                }
            })
        }
    };
    var is = class {
        constructor() {
            this.F = new es
        }
        out() {
            let t = _A,
                s = t.route.new.url,
                e = t.T;
            t.e.off(), z(t.data.gl[s]) && $(e._[s]) && (p.id("lo-pr").style.transition = "none", V(p.id("lo-pr"), -100.1, 0)), this.F.out({
                cb: () => t.page.update()
            })
        } in () {
            let t = _A,
                s = t.T,
                e = t.e,
                o = t.route.new.url;
            t.page.insertNew(), t.page.removeOld(), z(t.data.gl[o]) && $(s._[o]) ? (rt(p.id("lo-pr"), 800, "0.53, 0.23, 0.25, 1"), new ht(() => {
                s.clear(), s.init(), e.init(), this.F.in()
            })) : (s.clear(), e.init(), t.tt && e.co.F.sT(), this.F.in())
        }
    };
    new dt([!0, Gt, is, ss]);
})();