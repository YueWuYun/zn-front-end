/*rHj9g3bA/d+Zhwn3vodsgvdWfiF/AJ2D9iel2WdJYk1uIDbLZeti5+idehNgNX1J*/
import { REF21_CONST } from "../const";

export default function(props) {
  props.createUIDom(
    {
      pagecode: REF21_CONST.singleTableId, //卡片页面编码
      appcode: REF21_CONST.appcode //应用主键
    },
    data => {
      if (data) {
        if (data.template) {
          let meta = data.template;
          props.meta.addMeta(meta);
        }
      }
    }
  );
}

/*rHj9g3bA/d+Zhwn3vodsgvdWfiF/AJ2D9iel2WdJYk1uIDbLZeti5+idehNgNX1J*/