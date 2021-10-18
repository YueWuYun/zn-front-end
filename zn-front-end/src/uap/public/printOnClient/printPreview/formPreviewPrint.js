/**
 * form下载
 * 参数：
 * {
 *     params: {             // 操作需要的参数
 *          billId: '',
 *          ...
 *     },
 *     url: '',             // 操作的url
 *     enctype: 1/2/3       // form提交的方式  1和默认、multipart/form-data 2、application/x-www-form-urlencoded 3、text/plain
 * }
 */
import ReactDOM from 'react-dom';
import {toast} from "nc-lightapp-front";
import PrintPreviewModal from './../PrintPreviewModal';
import websocketLink from '../PrintPreviewModal/websocketLink';
export default async function handleDownload({
  newProps,
  params,
  url,
  enctype,
  hasModal = false
}, call=function(){}, json) {
  // 从ajax哪里取得，目的获取busiaction
  let resVO = await websocketLink(
    newProps,
    url,
    params
  );
  if (!hasModal) {
    if("error" === resVO) {
      toast({color: 'error', content: json["index_052"]})
      return ;
    } 

    let container = document.body;
    let section = document.createElement("section");
    section.classList.add("form-preview-print-contain");
    container.appendChild(section);
    ReactDOM.render(
      <PrintPreviewModal {...newProps} params={params} url={url} 
        onEnsureInfoSave={call}/>,
      section
    );
  }

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
      target: "printPreviewModal", //'_blank',
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
        //el_form.append(input);
        el_form.appendChild(input);
      });
    } else {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = config[key];
      //el_form.append(input);
      el_form.appendChild(input);
    }
  }
  //document.body.append(el_form);
  document.body.appendChild(el_form);
  // let submitData = ''
  // for (let item of Object.keys(config)) {
  //     submitData += `${item}=${config[item]}&&`
  // }
  /*ajax({
        method: 'post',
        url: url,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: submitData.slice(0, -2),
        success: (res) => {
            if (res.data) {
                var newWin = window.open('');//新开页面
                if (newWin) {
                    newWin.document.write(res.data);//输入要打印的内容
                    newWin.print();
                    newWin.close();
                } else {
                    toast({color: 'warning', content: '您的浏览器阻止了弹出式窗口,请查看浏览器设置'});
                }
            }
        },
        error: (err) => {
            toast({color: 'warning', content: err});
        }
    })*/

  el_form.submit();
  document.body.removeChild(el_form);

  return false;
}
