/*PFSo7vFSif6TPS9ylElSOHkHICmHWBfw8r+SWUIGrKqzd837JBbJM/9nVaIEsPx/*/
/*
 * @Author: yinliang 
 * @PageInfo: 有关树的工具文件
 * @Date: 2019-03-07 11:34:12 
 * @Last Modified by: yinliang
 * @Last Modified time: 2019-03-07 17:34:38
 */

/**
 * 拼装树，适用于同步树，左树右卡
 * @param {Array} rows 数组，NC返回的树的数据结构是一个平铺的结构
 * @param {string} constance 常量，需要获取的各种属性的常量
 * @param {function} callback 回调函数
 * @returns 返回的是一个数组，其中是组装好的树
 * @author yinliangc
 */
function assemblySyncTree(rows, constance, callback) {
	let { FIELD } = constance;
	const PARENT = 'parent';
	/**
     * idMap 存放id和树节点的映射关系
     * pidMap 存放pid和树节点的映射关系
     * pidRows 存放所有的pid
     * root 存放pid为空的树节点
	 * visableTreeIcons 设置树节点上的新增、修改、删除显隐的数组
     * resultTree 最终返回对的树结构
     */
	let idMap = new Map();
	let pidMap = new Map();
	let pidRows = [];
	let root = [];
	let visableTreeIcons = [];
	let resultTree = [];

	/**
     * 返回的数据是平铺的数据，因此需要在这里遍历平铺数据，将平铺的数据拼装成树结构数据
     */
	rows.map((item) => {
		/**
         * 1、将返回的数据，转化为树节点数据结构
         */
		let branch = {
			id: item.values[FIELD.id].value,
			pid: item.values[FIELD.pid].value,
			refcode: item.values[FIELD.code].value,
			refname: item.values[FIELD.name].value,
			refpk: item.values[FIELD.id].value,
			values: item.values
		};
		/**
         * 2、将id和树节点的映射关系存入idMap中
         */
		idMap.set(item.values[FIELD.id].value, branch);
		/**
         * 3、将pid和树节点的映射关系存入pidMap中
         */
		pidMap.set(item.values[FIELD.id].value + PARENT + item.values[FIELD.pid].value, branch);
		/**
         * 4、将所有的pid放入pidRows中，如果没有pid则为根节点，将根节点放入root中
         */
		if (item.values[FIELD.pid].value) {
			pidRows.push(item.values[FIELD.id].value + PARENT + item.values[FIELD.pid].value);
		} else {
			root.push(branch);
		}
	});

	/**
     * 遍历所有的pid数组
     * 1、通过pid在idMap中获取父节点的树节点
     * 2、通过pid在pidMap中获取pid所在的树节点
     * 3、将在第2步中获取的节点，赋值给在第1步中获取的节点的children属性，children为数组，如果是第一次赋值，需要定义该数组
     * 这样执行完成之后idMap中存放了各种完整的树结构，包括根节点需要的完整的树
     * 最后只要通过遍历根节点，将其中根节点需要的完整的树取出来即可
     */
	if (pidRows && pidRows.length > 0) {
		pidRows.map((item) => {
			let index = item.indexOf(PARENT);
			let key = item.substring(index + 6);
			if (idMap.get(key).children) {
				idMap.get(key).children.push(pidMap.get(item));
			} else {
				idMap.get(key).children = [];
				idMap.get(key).children.push(pidMap.get(item));
			}
			/**
			 * value中的元素：addIcon(新增),delIcon(删除),editIcon(修改),默认为true显示,隐藏设为false,stopUpIon(显示停用，配'up','down')
			 * root为根节点，没有修改和删除
			 * 有子节点的节点不允许删除
			 */
			let visableTreeIcon = {
				key: item,
				value: {
					delIcon: false
				}
			};
			visableTreeIcons.push(visableTreeIcon);
		});
	}

	/**
     * 遍历root，将id中拼装的完整的树取出来，拼装成真正可用的树结构
     */
	root.map((item) => {
		resultTree.push(idMap.get(item.id));
	});

	if (typeof callback == 'function') {
		callback.call(this);
	}

	let treeDatas = { resultTree: resultTree, visableIcons: visableTreeIcons };

	return treeDatas;
}

export { assemblySyncTree };

/*PFSo7vFSif6TPS9ylElSOHkHICmHWBfw8r+SWUIGrKqzd837JBbJM/9nVaIEsPx/*/