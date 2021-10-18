/*rqgAB70FiVv8RWSJRd7YxueibN7y3TAPNEb1Z3KQGHGXVzaNcbujn3YEUwAHwH2c*/
/**
 * 按钮可用性控制
 */
import { getDefData } from "../../util/cacheDataManager";
import { REF21_CONST } from "../const";
export default function(props) {
  let queryInfo = getDefData(REF21_CONST.Ref21DataSource, REF21_CONST.searchId);
  if (queryInfo == null) {
    this.props.button.setButtonDisabled(["Refresh"], true);
  } else {
    this.props.button.setButtonDisabled(["Refresh"], false);
  }
}

/*rqgAB70FiVv8RWSJRd7YxueibN7y3TAPNEb1Z3KQGHGXVzaNcbujn3YEUwAHwH2c*/