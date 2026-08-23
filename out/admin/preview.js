/*
  预览面板模板。
  ===========================================================================

  Decap 默认的预览是把字段名和值一行行列出来，看不出内容在页面上长什么样。
  这里给产品、案例、新闻各注册一个模板，按页面上的实际结构渲染。

  用 window.h 而不是 JSX —— 这是浏览器直接加载的脚本，没有编译步骤。
  h 就是 Decap 暴露出来的 React.createElement。

  entry 是 Immutable 结构，所以取值一律走 getIn(['data', ...])。
*/
(function () {
  var h = window.h;
  var CMS = window.CMS;
  if (!h || !CMS) return;

  CMS.registerPreviewStyle("/admin/preview.css");

  /**
   * 在顶栏塞一个「内容健康度」入口。
   *
   * Decap 没有扩展导航的接口，所以只能等它渲染完再往 DOM 里加。用 MutationObserver
   * 而不是 setTimeout：登录之后整个界面会重挂，定时器碰运气，观察者不会。
   * 加完就断开，避免长期占着回调。
   */
  function injectStatusLink() {
    if (document.getElementById("cms-status-link")) return true;
    var nav = document.querySelector('[class*="-AppHeaderNavList"]');
    if (!nav) return false;

    var li = document.createElement("li");
    var a = document.createElement("a");
    a.id = "cms-status-link";
    a.href = "/status/";
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "内容健康度";
    a.style.cssText =
      "display:inline-flex;align-items:center;padding:8px 12px;border-radius:6px;" +
      "color:#646a73;font-size:14px;font-weight:500;text-decoration:none;";
    a.addEventListener("mouseenter", function () {
      a.style.background = "#eef1f6";
      a.style.color = "#1f2329";
    });
    a.addEventListener("mouseleave", function () {
      a.style.background = "transparent";
      a.style.color = "#646a73";
    });
    li.appendChild(a);
    nav.appendChild(li);
    return true;
  }

  if (!injectStatusLink()) {
    var observer = new MutationObserver(function () {
      if (injectStatusLink()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /** Immutable List / Map 都转成普通数组，模板里就不用再关心类型。 */
  function toArray(value) {
    if (!value) return [];
    if (typeof value.toJS === "function") return value.toJS();
    return Array.isArray(value) ? value : [];
  }

  function get(entry, key) {
    var v = entry.getIn(["data", key]);
    return v && typeof v.toJS === "function" ? v.toJS() : v;
  }

  function section(title, children) {
    return [h("div", { className: "cp-h", key: title + "-h" }, title), children];
  }

  function empty(text) {
    return h("p", { className: "cp-empty" }, text);
  }

  /**
   * 图片预览走 getAsset：正在上传、还没提交的图片只存在于浏览器内存里，
   * 直接用路径取会是 404。
   */
  function imageList(images, getAsset) {
    var refs = toArray(images).filter(function (i) {
      return i && i.src;
    });
    if (!refs.length) return null;
    return h(
      "div",
      { className: "cp-images" },
      refs.map(function (img, i) {
        var src = getAsset ? getAsset(img.src) : img.src;
        return h("img", {
          key: img.src + i,
          src: String(src),
          alt: img.label || "",
          title: img.label || "",
        });
      }),
    );
  }

  // ---------------------------------------------------------------- 产品

  CMS.registerPreviewTemplate("products", function ProductPreview(props) {
    var entry = props.entry;
    var getAsset = props.getAsset;

    var model = get(entry, "model");
    var name = get(entry, "name");
    var series = get(entry, "series");
    var summary = get(entry, "summary");
    var specs = toArray(entry.getIn(["data", "specs"]));
    var finishes = toArray(entry.getIn(["data", "finishes"]));
    var doorTypes = toArray(entry.getIn(["data", "doorTypes"]));
    var certs = toArray(entry.getIn(["data", "certifications"]));
    var hero = get(entry, "heroImage");
    var gallery = toArray(entry.getIn(["data", "gallery"]));
    var modelTbc = get(entry, "modelTbc");

    var allImages = [];
    if (hero && hero.src) allImages.push(hero);
    allImages = allImages.concat(
      gallery.filter(function (g) {
        return g && g.src;
      }),
    );

    var warnings = [];
    if (!specs.length) {
      warnings.push("规格表是空的 —— 详情页会显示「尺寸待确认」的空状态。");
    }
    if (certs.length) {
      warnings.push("填了认证。请确认手上有一份点名本型号的检测报告。");
    }

    return h("div", null, [
      series ? h("p", { className: "cp-eyebrow", key: "s" }, series) : null,
      h("h1", { className: "cp-title", key: "t" }, name || "（未填产品名称）"),
      h(
        "p",
        { className: "cp-model", key: "m" },
        modelTbc ? "型号待确认" : model || "（未填型号）",
      ),

      warnings.map(function (w, i) {
        return h("div", { className: "cp-warn", key: "w" + i }, w);
      }),

      summary ? h("p", { className: "cp-summary", key: "sum" }, summary) : null,

      allImages.length
        ? imageList(allImages, getAsset)
        : h("p", { className: "cp-empty", key: "noimg" }, "还没有图片。"),

      h("div", { className: "cp-prose", key: "desc" }, props.widgetFor("description")),

      section(
        "技术规格",
        specs.length
          ? h(
              "table",
              { className: "cp-specs", key: "spec-t" },
              h(
                "tbody",
                null,
                specs.map(function (s, i) {
                  return h("tr", { key: i }, [
                    h("td", { key: "l" }, s.label),
                    h("td", { key: "v" }, s.value + (s.unit ? " " + s.unit : "")),
                  ]);
                }),
              ),
            )
          : empty("没有规格行。空表是诚实的，但采购商会问，能补就补。"),
      ),

      section(
        "配置",
        h("div", { className: "cp-facts", key: "facts" }, [
          h("div", { key: "f1" }, [
            h("div", { className: "cp-fact-label", key: "l" }, "表面处理"),
            finishes.length ? finishes.join(" · ") : h("span", { className: "cp-empty" }, "未填"),
          ]),
          h("div", { key: "f2" }, [
            h("div", { className: "cp-fact-label", key: "l" }, "适用门型"),
            doorTypes.length ? doorTypes.join(" · ") : h("span", { className: "cp-empty" }, "未填"),
          ]),
        ]),
      ),

      certs.length
        ? section(
            "认证",
            h(
              "div",
              { key: "certs" },
              certs.map(function (c, i) {
                return h("span", { className: "cp-tag", key: i }, c.name + (c.standard ? " · " + c.standard : ""));
              }),
            ),
          )
        : null,
    ]);
  });

  // ---------------------------------------------------------------- 新闻

  CMS.registerPreviewTemplate("news", function NewsPreview(props) {
    var entry = props.entry;
    var kind = get(entry, "kind");
    var title = get(entry, "title");
    var publishedAt = get(entry, "publishedAt");
    var draft = get(entry, "draft");
    var summary = get(entry, "summary");
    var body = toArray(entry.getIn(["data", "body"]));
    var hero = get(entry, "heroImage");

    var warnings = [];
    if (draft) warnings.push("这是草稿，不会出现在网站上。");
    if (publishedAt && publishedAt > new Date().toISOString().slice(0, 10)) {
      warnings.push("发布日期在未来。静态站不会自动定时发布 —— 到那天要有人重新构建。");
    }

    return h("div", null, [
      h(
        "p",
        { className: "cp-eyebrow", key: "k" },
        kind === "press-release" ? "新闻稿 Press release" : "观点 Insight",
      ),
      h("h1", { className: "cp-title", key: "t" }, title || "（未填标题）"),
      h("p", { className: "cp-date", key: "d" }, publishedAt || "（未填日期）"),

      warnings.map(function (w, i) {
        return h("div", { className: "cp-warn", key: "w" + i }, w);
      }),

      hero && hero.src ? imageList([hero], props.getAsset) : null,
      summary ? h("p", { className: "cp-summary", key: "s" }, summary) : null,

      body.length
        ? h(
            "div",
            { className: "cp-prose", key: "b" },
            body.map(function (p, i) {
              return h("p", { key: i }, p);
            }),
          )
        : empty("正文还是空的。"),
    ]);
  });

  // ---------------------------------------------------------------- 案例

  CMS.registerPreviewTemplate("projects", function ProjectPreview(props) {
    var entry = props.entry;
    var name = get(entry, "name");
    var status = get(entry, "referenceStatus");
    var buildingType = get(entry, "buildingType");
    var summary = get(entry, "summary");
    var body = toArray(entry.getIn(["data", "body"]));
    var models = toArray(entry.getIn(["data", "productModels"]));
    var hero = get(entry, "heroImage");

    return h("div", null, [
      buildingType ? h("p", { className: "cp-eyebrow", key: "b" }, buildingType) : null,
      h("h1", { className: "cp-title", key: "t" }, name || "（未填名称）"),

      status === "verified-project"
        ? h(
            "div",
            { className: "cp-warn", key: "w" },
            "标为「真实项目」。只有甲方确认确有供货才能这样标 —— 声称一个不存在的业绩是实打实的商业风险。",
          )
        : h("p", { className: "cp-date", key: "d" }, "代表性应用（示意用途，非指名项目）"),

      hero && hero.src ? imageList([hero], props.getAsset) : null,
      summary ? h("p", { className: "cp-summary", key: "s" }, summary) : null,

      body.length
        ? h(
            "div",
            { className: "cp-prose", key: "bd" },
            body.map(function (p, i) {
              return h("p", { key: i }, p);
            }),
          )
        : empty("正文还是空的。"),

      models.length
        ? section(
            "使用的产品型号",
            h(
              "div",
              { key: "m" },
              models.map(function (m, i) {
                return h("span", { className: "cp-tag", key: i }, m);
              }),
            ),
          )
        : null,
    ]);
  });
})();
