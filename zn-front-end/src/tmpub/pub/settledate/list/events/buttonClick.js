/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/
import { toast, print } from "nc-lightapp-front";
import {
  card,
  baseReqUrl,
  javaUrl,
  list,
  insPrintData
} from "../../cons/constant.js";
import { searchBtnClick } from "./search";

/**
 * 按钮交互
 * @param {*} props        页面内置对象
 * @param {*} id           注册按钮编码
 */
export default function buttonClick(props, id) {
  let selectDatas = props.table.getCheckedRows(this.tableId); //获取已勾选数据
  if (!["Add", "Refresh"].includes(id) && !selectDatas.length) {
    //非新增刷新按钮时要判断是否已勾选数据
    toast({ color: "warning", content: "请勾选数据!" });
    return;
  }
  // let pks= selectDatas && selectDatas.map(item => item.data.values && selectDatas[0].data.values[this.primaryId] && selectDatas[0].data.values[this.primaryId].value);
  let pks =
    selectDatas &&
    selectDatas.map(item => item.data.values[this.primaryId].value);
  let checkDelDataLen = props.table.getCheckedRows(list.tableCode).length; //获取勾选的行
  switch (id) {
    //头部 新增
    case "Add":
      props.pushTo("/card", {
        status: "add",
        pagecode: card.pageCode
      });
      break;
    //头部 删除
    case "Delete":
      if (checkDelDataLen == 1) {
        this.setState({ pks, showToast: false }, () => {
          props.modal.show("deleteModal");
        });
      } else {
        this.setState({ pks, showToast: false }, () => {
          props.modal.show("deleteModalBatch");
        });
      }
      break;
    //头部 打印
    case "Print":
      insPrintData.oids = pks;
      print("pdf", `${baseReqUrl}${javaUrl.print}.do`, {
        ...insPrintData,
        userjson: JSON.stringify(selectDatas)
      });
      break;
    //头部 输出
    case "Output":
      insPrintData.oids = pks;
      this.setState(
        {
          printOut: {
            appcode: "36010ISDC",
            nodekey: "", //模板节点标识
            outputType: "output",
            oids: pks
          }
        },
        () => {
          this.refs.printOutput.open();
        }
      );
      break;
    //头部 刷新
    case "Refresh":
      searchBtnClick.call(this, props, null, null, null, () => {
        toast({
          color: "success",
          content: this.state.json[
            "36010ISDC-000022"
          ] /* 国际化处理： 刷新成功 */
        });
      });
      break;
    default:
      break;
  }
}

/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/