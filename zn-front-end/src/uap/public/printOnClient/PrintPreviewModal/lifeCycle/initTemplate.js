import {getMultiLang} from "nc-lightapp-front";
export default function(props) {
  let meta = {};
  let callback = (json, status, inlt) => {
    if(status) {
      meta = {
        printTemplate: {
          moduletype: "form",
          items: [
            {
              attrcode: "templateInfoList",
              placeholder: "",
              value: "",
              leftspace: 0,
              rightspace: 0,
              required: false,
              visible: true,
              itemtype: "select",
              options: [],
              label: `${json["index_004"]}：`//打印模板
            }
          ],
          status: "edit"
        },
        printRange: {
          moduletype: "form",
          items: [
            {
              attrcode: "pageRangeType",
              placeholder: "",
              value: "",
              leftspace: 0,
              rightspace: 0,
              required: false,
              visible: true,
              itemtype: "radio",
              options: [
                {
                  display: `${json["index_000"]}`,//"所有页面"
                  value: 0
                },
                {
                  display: `${json["index_016"]}`,//"页面",
                  value: 1
                }
              ],
              label: ""
            },
            {
              attrcode: "pageFrom",
              placeholder: "",
              value: "",
              leftspace: 0,
              rightspace: 0,
              required: false,
              visible: true,
              itemtype: "number",
              label: `${json["index_018"]}`,//"从",
            },
            {
              attrcode: "pageTo",
              placeholder: "",
              value: "",
              leftspace: 0,
              rightspace: 0,
              required: false,
              visible: true,
              itemtype: "number",
              label: `${json["index_019"]}`,//"到",
            },
            {
              attrcode: "pageWholeType",
              placeholder: "",
              value: "",
              leftspace: 0,
              rightspace: 0,
              required: false,
              visible: true,
              itemtype: "select",
              options: [
                {
                  display: `${json["index_020"]}`,//"全部页面",
                  value: 0
                },
                {
                  display: `${json["index_021"]}`,//"奇数页",
                  value: 1
                },
                {
                  display: `${json["index_022"]}`,//"偶数页",
                  value: 2
                }
              ],
              label: `${json["index_023"]}`,//"打印奇偶："
            },
            {
              attrcode: "copies",
              placeholder: "",
              value: "",
              leftspace: 0,
              rightspace: 0,
              required: false,
              visible: true,
              itemtype: "number",
              label: `${json["index_024"]}`,//"打印份数："
            },
            {
              attrcode: "collated",
              placeholder: "",
              value: "",
              leftspace: 0,
              rightspace: 0,
              required: false,
              visible: true,
              itemtype: "switch",
              label: `${json["index_025"]}`,//"逐份打印："
            },
            {
              attrcode: "doubleside",
              placeholder: "",
              value: "",
              leftspace: 0,
              rightspace: 0,
              required: false,
              visible: true,
              itemtype: "select",
              label: `${json["index_026"]}`,//"双面打印：",
              options: [
                {
                  display: `${json["index_027"]}`,//"关闭",
                  value: 0
                },
                {
                  display: `${json["index_028"]}`,//"向左翻页",
                  value: 1
                },
                {
                  display: `${json["index_029"]}`,//"向上翻页",
                  value: 2
                }
              ]
            },
          ],
          status: "edit"
        },
  
        printMachine: {
          moduletype: "form",
          items: [
            {
              attrcode: "PrinterList",
              placeholder: "",
              value: "",
              leftspace: 0,
              rightspace: 0,
              required: false,
              visible: true,
              itemtype: "select",
              options: [],
              label: `${json["index_030"]}`//"名称："
            },
            {
              attrcode: "printerStatus",
              placeholder: "",
              value: "",
              leftspace: 0,
              rightspace: 0,
              required: false,
              visible: true,
              disabled: true,
              itemtype: "input",
              label: `${json["index_031"]}`,//"状态：",
              disabled: true
            },
            {
              attrcode: "paperResourceList",
              placeholder: "",
              value: "",
              leftspace: 0,
              rightspace: 0,
              required: false,
              visible: true,
              itemtype: "select",
              options: [],
              label: `${json["index_032"]}`,//"纸张来源："
            },
            {
              attrcode: "twoSide",
              placeholder: "",
              value: "",
              leftspace: 0,
              rightspace: 0,
              required: false,
              visible: true,
              itemtype: "switch",
              label: `${json["index_033"]}`,//"双面：",
              disabled: true
            }
          ],
          status: "edit"
        },
        printStyle: {
          moduletype: "form",
          items: [
            {
              attrcode: "paperList",
              placeholder: "",
              value: "",
              leftspace: 0,
              rightspace: 0,
              required: false,
              visible: true,
              itemtype: "select",
              options: [],
              label: `${json["index_034"]}`,//"纸张尺寸："
            },
            {
              attrcode: "paperWidth",
              placeholder: "",
              value: "",
              leftspace: 0,
              rightspace: 0,
              required: false,
              visible: true,
              itemtype: "input",
              label: `${json["index_035"]}`,//"宽度(mm)：",
              disabled: true
            },
            {
              attrcode: "paperHeight",
              placeholder: "",
              value: "",
              leftspace: 0,
              rightspace: 0,
              required: false,
              visible: true,
              itemtype: "input",
              label: `${json["index_036"]}`,//"高度(mm)：",
              disabled: true
            },
            {
              attrcode: "nccloudPaperDirect",
              placeholder: "",
              value: "",
              leftspace: 0,
              rightspace: 0,
              required: false,
              visible: true,
              itemtype: "radio",
              label: `${json["index_037"]}`,//"纸张方向：",
              options: [
                {
                  display: `${json["index_038"]}`,//"横向",
                  value: false
                },
                {
                  display: `${json["index_039"]}`,//"纵向",
                  value: true
                }
              ]
            },
            {
              attrcode: "printMode",
              placeholder: "",
              value: "",
              leftspace: 0,
              rightspace: 0,
              required: false,
              visible: true,
              itemtype: "switch",
              label: `${json["index_040"]}`,//"彩色："
            }
          ],
          status: "edit"
        }
      };
      props.meta.setMeta(meta);
    }else {
      console.log('未加载到多语资源');   // 未请求到多语资源的后续操作
    }
    
  };
  getMultiLang({ 'moduleId': 'contains_printOnClient', callback })
}