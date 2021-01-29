type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: (() => number);
};

declare global {
  interface Window {
    requestIdleCallback: ((
      callback: ((deadline: RequestIdleCallbackDeadline) => void),
      opts?: RequestIdleCallbackOptions,
    ) => RequestIdleCallbackHandle);
    cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);
  }
}

import { commitRoot, getWipRoot } from "./commit";
import { reconcileChildren } from "./reconciliation";
/**
 * ! render 函数需要创建 root fiber  且 设置为 nextUnitOfWork
 * ! 剩下的函数在 performUnitOfWork 中执行， 每一个fiber 会做三件事
 * !  - 将元素添加至 dom
 * !  - 为元素的子元素创建 fiber
 * !  - 选择下一个工作单元
 */

/**
 * ==================
 *        HTML
 * ==================
 * <div>
 *   <h1>
 *     this is H1
 *     <p>
 *       this is p
 *     </p>
 *     <a>
 *       this is a
 *     </a>
 *   </h1>
 *   <h2>
 *     this is H2
 *   </h2>
 * </div>
 * ==================
 * 
 * ==================
 *       TREE
 * ==================
 * root 
 *  |
 * div
 *  |  \   
 * h1 -- h2
 *  |  \
 *  p -- a
 * 
 * 
 * 过程
 * 先 root 
 * 然后到 root 的子元素 div 
 * 再到 div 的子元素 p
 * 此时 p 已经没有子元素的，这时候找到 p 的同级兄弟元素 p.sibling --> a
 * 如果 a 也没有子元素此时则去找到父元素的兄弟节点，如果父元素没有兄弟节点，则查找父元素的父元素的兄弟元素
 * 一直如此，直到 root
 * 结束
 * 
 * ! 当我们完成对光纤的工作时，如果有子级，则光纤将成为下一个工作单元
 * ! 如果光纤没有孩子，我们将兄弟姐妹作为下一个工作单位
 * ! 如果光纤既没有孩子也没有兄弟姐妹，那么我们去“叔叔”：父母的兄弟姐妹。就像示例中的a和h2光纤一样
 * ! 另外，如果父母没有兄弟姐妹，我们会不断检查父母，直到找到有兄弟姐妹的父母，或者直到找到根。如果到达根目录，则意味着我们已经完成了此渲染的所有工作。
 */

import { createDom } from "./render";

// 下一个需要执行的任务
let nextUnitOfWork: FiberNextWork  = null;

export function setNextUnitOfWork (val: any) {
  nextUnitOfWork = val;
};

export function getNextUnitOfWork () {
  return nextUnitOfWork;
}

// 循环渲染函数
// 在渲染函数中，将nextUnitOfWork设置为纤维树的根。
// 然后，当浏览器准备就绪时，它将调用我们的workLoop，我们将开始在根目录上工作
export function workLoop(deadLine) {
  let shouldYield = false;  // 是否要挂起
  
  // 如果存在任务 且 未暂停
  while (nextUnitOfWork && !shouldYield) {
    // todo
    // 执行任务
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  // 如果没有后续任务，且wipRoot存在，则执行 commit动作；
  if (!nextUnitOfWork && getWipRoot()) {
    commitRoot()
  }

  window.requestIdleCallback(workLoop);
};

// 创建工作单元
// 执行工作
// 并返回下一个工作单元
export function performUnitOfWork(fiber: DedooFiber): FiberNextWork {
  // ? add dom node
  // ? create new fibers
  // ? return next unit of work
  // 首先，我们创建一个新节点并将其附加到DOM
  // 我们在fiber.dom属性中跟踪DOM节点
  // ! add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 元素加载到父元素中
  // ! 每次处理元素时，我们都会向DOM添加一个新节点。而且，请记住，在完成渲染整个树之前，
  // ! 浏览器可能会中断我们的工作。在这种情况下，用户将看到不完整的UI。而且我们不想要那样。
  // ! 所以这段代码被注释
  // if (fiber.parent) {
  //   fiber?.parent?.dom?.appendChild(fiber.dom);
  // }

  // 元素的子元素
  // 为每个孩子创建一个新的纤维
  // ! create new fibers
  const elements = fiber.props?.children || [];

  // reconcileChildren  协调
  reconcileChildren(fiber, elements);

  // ! return next unit of work
  // 如果任务操作完成之后，则进行下一个任务的 fiber 信息
  // 如果有子节点，则返回子元素
  // ! 最后，我们搜索下一个工作单元。我们首先尝试与孩子，然后与兄弟姐妹，然后与叔叔，依此类推
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  // 这个循环用于 sibling，或者parent 查找以及
  while(nextFiber) {
    // 如果有同级fiber，选择兄弟fiber 用于下一个工作单元
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    // 如果没有这一层的则直接返回父元素
    nextFiber = nextFiber.parent;
  }
  return null;
}
