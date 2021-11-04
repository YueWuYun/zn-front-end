// 1.引入NCUploader控件，默认渲染，外部控制是否渲染。
import { high } from 'nc-lightapp-front';  // 从nc-lightapp-front引入high 高阶组件。
const { NCUploader } = high;               // 从 高阶组件引入NCUploader。

class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showUploader: false,
            target: null
        }
    }
    // 附件的关闭点击
    onHideUploader = () => {
        this.setState({
            showUploader: false,
            groupLists: []
        })
    }

        //获取当前附件列表
    getGroupList=(list)=>{
    //要在state里面顶一个变量，用来存储列表数组
        this.setState({
            groupLists:list
        })
    }

    beforeUpload(billId, fullPath, file, fileList) {
        // 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
        console.log(billId, fullPath, file, fileList);

        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
            alert('只支持jpg格式图片')
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            alert('上传大小小于2M')
        }
        return isJPG && isLt2M;
        // 备注： return false 不执行上传  return true 执行上传
    }

    // 界面渲染
}