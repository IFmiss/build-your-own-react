import { deletions, setCurrentRoot } from "./reconciliation";
import { isEvent, isGone, isNew, isProperty } from "./utils";

// 当前 渲染到的 fiber信息
export let wipRoot: FiberNextWork  = null;
export let currentRoot: FiberNextWork  = null;

export function setWipRoot(val: FiberNextWork) {
  wipRoot = val;
}

export function getWipRoot() {
  return wipRoot;
}

export function commitRoot() {
  // 移除需要删除的元素
  deletions?.forEach(commitWork);

  // TODO add nodes to dom
  // 从根root开始commit 一步步往下
  if (wipRoot?.child) {
    commitWork(wipRoot?.child);
  }

  // 存储当前的 fiber 信息 默认是 // !根元素
  
  // 因此，在完成提交之后，我们需要
  // ! 保存对“我们提交给DOM的最后一棵纤维树”的引用。
  // 我们称它为currentRoot
  setCurrentRoot(wipRoot);

  wipRoot = null
}

// 递归注入到 wipRoot 的子元素上
export function commitWork(fiber: FiberNextWork) {
  // 不存在则结束
  if (!fiber) {
    return;
  }

  // 由于可能传递的是 函数 模版， 现在我们有了没有DOM节点的光纤，我们需要更改两件事。
  // 首先，要找到DOM节点的父节点，我们需要沿着光纤树向上移动，直到找到带有DOM节点的光纤。
  let domParentFiber = fiber.parent;
  while(!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }

  // 拿到 通用的父元素信息
  const domParent = domParentFiber.dom;
  // 将当前 fiber的 dom 注入到父元素
  // fiber.dom && domParent?.appendChild(fiber.dom);
  if (
    // ! 新增
    fiber.effectTag === 'PLACEMENT' &&
    fiber.dom !== null
  ) {
    console.info('fiber.dom', fiber.dom);
    domParent?.appendChild(fiber.dom);
  } else if (
    // ! 更新
    fiber.effectTag === 'UPDATE' &&
    fiber.dom !== null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate?.props || {},
      fiber.props || {}
    )
  } else if (
    // ! 删除
    fiber.effectTag === 'DELETE' &&
    fiber.dom
  ) {
    commitDeletion(fiber, domParent);
  }

  // 继续其子元素 的重复动作
  fiber.child && commitWork(fiber.child);
  // 继续其兄弟元素的重复动作
  fiber.sibling && commitWork(fiber.sibling);
}

function commitDeletion (fiber: DedooFiber, domParent: FiberDom) {
  // 由于可能传递的是 函数 模版
  // 在删除节点时，我们还需要继续操作，直到找到带有DOM节点的子节点为止
  if (fiber.dom) {
    // 如果存在fiber dom  直接 删除
    domParent?.removeChild(fiber.dom);
  } else {
    // 向下寻找 直到找到带有DOM节点的子节点为止
    fiber.child && commitDeletion(fiber.child, domParent);
  }
}

// 更新 dom 信息
// event
// props
function updateDom (
  dom: FiberDom,
  prevProps: DedooElementProps,
  nextProps: DedooElementProps
) {
  // TODO remove or change eventLister
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => (
      // 如果新的props 不存在这个key 或者
      !(key in nextProps) ||
      isNew(prevProps, nextProps)(key)
    ))
    .forEach(name => {
      const eventName = name.toLocaleLowerCase().substring(2);
      dom.removeEventListener(
        eventName,
        prevProps[name]
      );
    })

  // remove old prop
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = '';
    })

  // set new changed prop
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name];
    })
  
  // TODO add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventName = name.toLocaleLowerCase().substring(2);
      dom.addEventListener(
        eventName,
        nextProps[name]
      );
    })
}
