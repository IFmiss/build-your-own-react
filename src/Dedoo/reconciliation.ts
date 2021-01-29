// 这就是我们现在要做的，我们需要将在render函数上收到的元素与我
// 们提交给DOM的最后一棵纤维树进行比较
// currentRoot 与 alternate 对比

export let currentRoot: FiberNextWork = null;
export let deletions: null | DedooFiber[] = null;

export function getCurrentRoot() {
  return currentRoot;
}

export function setCurrentRoot(val: FiberNextWork) {
  currentRoot = val;
}

export function setDeletions (val: null | DedooFiber[] ) {
  deletions = val;
}

// 调和子元素 （增删改）的数据更新
// ! 在这里，我们将旧纤维与新元素进行协调。
// wipFiber 当前父元素的 fiber
// elements 子元素的dom数据
export function reconcileChildren(wipFiber: DedooFiber, elements: DedooElement[]) {
  let index = 0;
  let olderFiber: DedooFiber | null = wipFiber?.alternate?.child || null;

  let prevSibling: DedooFiber | null = null;

  // 循环生成一个 fiber 链表
  while (
    index < elements.length ||
    olderFiber != null
  ) {
    const element = elements[index];
    let newFiber: DedooFiber | null = null

    // TODO compare oldFiber to element

    const sameType =
      olderFiber &&
      element &&
      element.type === olderFiber.type;
    
    if (sameType) {
      // TODO update the node
      newFiber = {
        type: (olderFiber as DedooFiber)?.type,
        props: (olderFiber as DedooFiber)?.props,
        dom: (olderFiber as DedooFiber)?.dom,
        parent: wipFiber,
        alternate: olderFiber,
        effectTag: 'UPDATE'
      }
    }

    if (element && !sameType) {
      // TODO add node
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'ADD'
      }
    }

    if (olderFiber && !sameType) {
      // TODO remove oldFiber node
      olderFiber.effectTag = 'DELETE',
      deletions?.push(olderFiber);
    }



    // 每一个 element 创建一个fiber
    // const newFiber: DedooFiber = {
    //   type: element.type,
    //   props: element.props,
    //   parent: wipFiber,
    //   dom: null,
    //   child: null,
    //   sibling: null,
    //   alternate: null,
    // }

    // 对于 newFiber 的处理
    // 如果 index 是第一个，则 newFiber 可以理解为是 fiber 的 子元素
    // 除了第一个以外的，则属于前一个 fiber 的兄弟节点关系 sibling
    // ! 将其添加到纤维树中，将其设置为孩子还是兄弟姐妹，具体取决于它是否是第一个孩子。
    if (index === 0) {
      wipFiber.child = newFiber;
    } else {
      // 此时 prevSibling 已经有值了
      (prevSibling as DedooFiber).sibling = newFiber;
    }

    // 基于 newFiber 设置新的  prevSibling，用于设置 fiber 的 sibling
    // linkList 操作
    prevSibling = newFiber;
    index ++;
  }
}
