import { deletions, setCurrentRoot } from "./reconciliation";
import { isGone, isNew, isProperty } from "./utils";

// 当前 渲染到的 fiber信息
export let wipRoot: FiberNextWork  = null;
export let currentRoot: FiberNextWork  = null;

export function setWipRoot(val: any) {
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
  // 拿到父元素信息
  const domParent = fiber.parent.dom;
  // 将当前 fiber的 dom 注入到父元素
  // fiber.dom && domParent?.appendChild(fiber.dom);
  // 新增
  if (
    fiber.effectTag === 'ADD' &&
    fiber.dom !== null
  ) {
    domParent?.appendChild(fiber.dom);
  } else if (
    fiber.effectTag === 'UPDATE' &&
    fiber.dom !== null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate?.props,
      fiber.props
    )
  } else if (
    fiber.effectTag === 'DELETE' &&
    fiber.dom
  ) {
    domParent?.removeChild(fiber.dom);
  }

  // 继续其子元素 的重复动作
  fiber.child && commitWork(fiber.child);
  // 继续其兄弟元素的重复动作
  fiber.sibling && commitWork(fiber.sibling);
}

function updateDom (
  dom: FiberDom,
  prevProps: DedooElementProps,
  nextProps: DedooElementProps
) {
  // TODO
  // remove or change eventLister
  Object.keys(prevProps)
    // .filter(is)

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
}
