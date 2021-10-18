/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/
import { list, allBtns } from "../../cons/constant";

/**
 * 根据table的状态（browse或edit）渲染页面
 * @param {*} props  页面内置对象
 */
export function listButtonVisible(props) {
    let { getStatus } = props.editTable;
    let { setButtonVisible, setMainButton, setPopContent } = props.button;
    let statusOfTable = getStatus(list.tableCode); //获取表格状态（编辑or浏览）
    let isBrowse = statusOfTable === "browse";
    if (isBrowse) {
        setButtonVisible({
            Save: false,
            Cancel: false,
            Refresh: true,
            Edit: true,
            Field: true,
            Import: true,
            ExportData: false,
            Export_Group: true,
            ExportExcel: true,
            Print: true,
            Output: true
        });
        setMainButton("Add", true);
        setMainButton("Save", false);
        setPopContent(
            "DelLine",
            this.props.MutiInit.getIntl("361805IBR") &&
                this.props.MutiInit.getIntl("361805IBR").get("361805IBR-000011")
        ); /* 国际化处理： 确定要删除吗?*/
        window.onbeforeunload = () => {
            // 可改为卸载事件
        };

        let selectRows = props.editTable.getCheckedRows(list.tableCode);
        if (!selectRows || selectRows.length == 0) {
            props.button.setButtonDisabled(allBtns, true);
        } else {
            props.button.setButtonDisabled(allBtns, false);
        }
        let alnum = props.editTable.getNumberOfRows(list.tableCode);
        if (alnum && alnum > 0) {
            props.button.setButtonDisabled("Edit", false);
        }
    } else {
        setButtonVisible({
            Save: true,
            Delete: true,
            Cancel: true,
            Refresh: false,
            Edit: false,
            Field: false,
            Import: false,
            ExportData: false,
            Export_Group: false,
            ExportExcel: false,
            Print: false,
            Output: false
        });
        setMainButton("Save", true);
        setMainButton("Add", false);
        setPopContent("DelLine", ""); // content传空，操作列按钮就不会弹出气泡
        window.onbeforeunload = () => {
            return (
                this.props.MutiInit.getIntl("361805IBR") &&
                this.props.MutiInit.getIntl("361805IBR").get("361805IBR-000015")
            ); /* 国际化处理： 当前单据未保存, 您确定离开此页面?*/
        };
        let selectRows = props.editTable.getCheckedRows(list.tableCode);
        if (!selectRows || selectRows.length == 0) {
            props.button.setButtonDisabled(allBtns, true);
        } else {
            props.button.setButtonDisabled(allBtns, false);
        }
    }
}

/*2+0Qf+roUlDHXBeA/o9JMOfjmr9rgjuRtKho0d7xEu/Xc1C+tCSuF7XqFzQBjqDq*/