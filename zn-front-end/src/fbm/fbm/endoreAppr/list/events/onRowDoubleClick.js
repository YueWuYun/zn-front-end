/*xbBNZdDFBeHR0NxHIc8oEPkDxn5gdZjz67Cv7PPpmuLldQ2jCpj2y84EIno/IP0v*/
import { CARD } from "../../cons/constant";

/**
 * 背书办理列表行双击事件
 * @author：gaokung
 */
/**
 * record(行数据),index(当前index), props, e (事件对象)
 */
const onRowDoubleClick = ( record,index, props,event) => {
    props.pushTo("/card", {
        status: "browse",
        id: record.pk_endore &&
            record.pk_endore.value,
        pagecode: CARD.pageCode
    });
};
export default onRowDoubleClick;

/*xbBNZdDFBeHR0NxHIc8oEPkDxn5gdZjz67Cv7PPpmuLldQ2jCpj2y84EIno/IP0v*/