import ReactDOM from "react-dom";
export default function handleDownload({
  newProps,
  params,
  url,
  enctype,
  hasModal = false
}, call=function(){}) {
  // 从ajax哪里取得，目的获取busiaction
  var app = "",
    appcode = "";
  let appN = window.parent.location.hash.split("?");
  if (appN && appN[1]) {
    let appPrams = appN[1].split("&");
    if (appPrams && appPrams instanceof Array) {
      appPrams.forEach(item => {
        if (
          item.indexOf("=") != -1 &&
          item.split("=") &&
          item.split("=") instanceof Array
        ) {
          if (item.split("=")[0] === "n") {
            if (item.split("=")[1]) {
              app = decodeURIComponent(decodeURIComponent(item.split("=")[1]));
            }
          }
          if (item.split("=")[0] === "c") {
            if (item.split("=")[1]) {
              appcode = decodeURIComponent(
                decodeURIComponent(item.split("=")[1])
              );
            }
          }
        }
      });
    }
  }

  let busiaction = `${app || null}-${window.actionName || null}`;
  const sysParamJson = {
    sys_busiaction: busiaction,
    sys_appcode: appcode,
    sys_ts: new Date().getTime()
    // busiaction: busiaction ,
    // appcode: appcode,
    // ts: new Date().getTime()
  };
  enctype = (type => {
    switch (type) {
      case 1:
        return "multipart/form-data";
      case 2:
        return "application/x-www-form-urlencoded";
      case 3:
        return "text/plain";
      default:
        return "multipart/form-data";
    }
  })(enctype);

  const [attrs, el_form] = [
    {
      target: "totalPageIframe", //'_blank',
      method: "POST",
      enctype,
      type: "hidden",
      action: url || ""
    },
    document.createElement("form")
  ];
  Object.assign(el_form, attrs);
  const config = { ...params, ...sysParamJson };
  for (let key in config) {
    if (config[key] instanceof Array) {
      config[key].forEach((item, index) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = item;
        el_form.appendChild(input);
      });
    } else {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = config[key];
      el_form.appendChild(input);
    }
  }

  document.body.appendChild(el_form);

  el_form.submit();
  document.body.removeChild(el_form);

  return false;
}
