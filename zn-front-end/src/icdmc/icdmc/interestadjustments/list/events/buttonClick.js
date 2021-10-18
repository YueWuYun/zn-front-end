/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { toast, print, output, promptBox } from "nc-lightapp-front";
import { card, printData, baseReqUrl, javaUrl,busistatusvalue } from "../../cons/constant.js";
import { bodyBtnOperation } from "./bodyButtonClick";
import { searchBtnClick } from "./search";
import { interestBill } from "../../util/util";
import { fileMgrList } from "../../../public/listEvent";

/**
 * 按钮交互
 * @param {*} props        页面内置对象
 * @param {*} id           注册按钮编码
 */
export default function buttonClick(props, id) {
    let selectDatas = props.table.getCheckedRows(this.tableId); //获取已勾选数据
    if (["ApproveDetail", "Interestbills", "Loan", "Attachment"].includes(id) && selectDatas.length > 1) {
      toast({
        color: "warning",
        content: this.state.json["36360ICIA-000021"]
      }); /* 国际化处理： 请选中单条数据进行操作!*/
      return;
    }
    let pks = selectDatas &&
      selectDatas.map(
        item => item.data.values && item.data.values[this.primaryId] && item.data.values[this.primaryId].value
      );
    switch (id) {
      
      case "Add"://头部 新增
        props.pushTo("/card", {
          status: "add",
          pagecode: this.card.pageCode
        });
        break;
      
      // case "Copy"://头部 复制。经需求确认，去掉复制功能。
      //   let pk = pks[0];
      //   props.pushTo("/card", {
      //     status: "copy",
      //     id: pk,
      //     pagecode: this.card.pageCode
      //   });
      //   break;
      
      case "Delete"://头部 删除
        promptBox({
          color: "warning",
          title: this.state.json["36360ICIA-000005"] /* 国际化处理： 删除*/,
          content:
            pks.length > 1
              ? this.state.json["36360ICIA-000022"]
              : this.state.json[
                  "36360ICIA-000006"
                ] /* 国际化处理： 确定要删除所选数据吗?,确定要删除吗?*/,
          beSureBtnClick: bodyBtnOperation.bind(
            this,
            selectDatas,
            javaUrl.delete,
            null,
            true,
            null,
            this.state.json["36360ICIA-000005"]
          ) /* 国际化处理： 删除*/
        });
        break;
      
      case "commit_head"://头部 提交
        bodyBtnOperation.call(
          this,
          selectDatas,
          javaUrl.commit,
          this.state.json["36360ICIA-000001"],
          pks.length > 1,
          null,
          this.state.json["36360ICIA-000023"]
        ); /* 国际化处理： 提交成功!,提交,提交*/
        break;
      
      case "uncommit_head"://头部 收回
        bodyBtnOperation.call(
          this,
          selectDatas,
          javaUrl.uncommit,
          this.state.json["36360ICIA-000010"],
          true,
          null,
          this.state.json["36360ICIA-000024"]
        ); /* 国际化处理： 收回成功!,收回,收回*/
        break;
      
      case "Commit_group"://头部 提交
        bodyBtnOperation.call(
          this,
          selectDatas,
          javaUrl.commit,
          this.state.json["36360ICIA-000001"],
          pks.length > 1,
          null,
          this.state.json["36360ICIA-000023"]
        ); /* 国际化处理： 提交成功!,提交,提交*/
        break;
      
      case "UnCommit"://头部 收回
        bodyBtnOperation.call(
          this,
          selectDatas,
          javaUrl.uncommit,
          this.state.json["36360ICIA-000010"],
          true,
          null,
          this.state.json["36360ICIA-000024"]
        ); /* 国际化处理： 收回成功!,收回,收回*/
        break;
      
      case "Print"://头部 打印
        print("pdf", `${baseReqUrl}${javaUrl.print}.do`, {
          ...printData,
          oids: pks
        });
        break;
      
      case "Output"://头部 输出
        output({
          url: `${baseReqUrl}${javaUrl.print}.do`,
          data: {
            ...printData,
            outputType: "output",
            oids: pks
          }
        });
        break;
      
      case "Attachment"://头部 附件
        if (selectDatas.length === 1) {
          fileMgrList.call(this, props, selectDatas);
        } else {
          toast({
            content: this.state.json[
              "36360ICIA-000020"
            ] /* 国际化处理： 请选择至少一条数据 */,
            color: "warning"
          });
          return;
        }
        break;
      
      case "ApproveDetail"://头部 审批详情
        this.billInfo = { billId: pks[0] };
        this.setState({ showApproveDetail: true });
        break;
      
      case "Refresh"://头部 刷新
        searchBtnClick.call(this, props, null, null, null, true, true);
        break;

      default:
        break;
    }
}

export function buttonDisabled() {
    let selected = this.props.table.getCheckedRows(this.tableId);
    let btnArray = ["Delete", "Print", "Output", "Attachment", "ApproveDetail", "commit_head", "uncommit_head"];
    let btnObj = {};
    for (let item of btnArray) {
        btnObj[item] = !selected.length;
    }
    if (selected.length) {
      let vbillstatus = selected[0] && selected[0].data && selected[0].data.values.vbillstatus.value;// 单据状态 1：待提交，2：待审批，3：审批通过
      let approvestatus = selected[0] && selected[0].data && selected[0].data.values.approvestatus.value;// 审批状态
      if (selected.length === 1) {
        btnObj.Delete = vbillstatus !== "1";// 待提交的才可以显示
        btnObj.commit_head = vbillstatus !== "1";// 待提交才可以显示
        btnObj.uncommit_head = !["2", "3"].includes(vbillstatus);// 不是待提交，才可以收回。
      }
      btnObj.ApproveDetail = !["2", "3"].includes(vbillstatus);// 不是待提交，才可以显示。
    }
    this.props.button.setButtonDisabled(btnObj);
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/