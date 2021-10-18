/*iGEr7jsLTpd/n+WcDubKzYraKaFlIfH7BfPV0sP1a6AvcP+v+EaJeEFkan5DjrW0*/
import { getDefData } from "../../util/cacheDataManager";
import { REF21_CONST } from "../const";
import clickSerachBtn from "./commonSearch_BtnClick";

export default function buttonClick(props) {
  let queryInfo = getDefData(REF21_CONST.Ref21DataSource, REF21_CONST.searchId);
  clickSerachBtn.call(this, props, queryInfo);
}

/*iGEr7jsLTpd/n+WcDubKzYraKaFlIfH7BfPV0sP1a6AvcP+v+EaJeEFkan5DjrW0*/