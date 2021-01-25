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

/**
 *! render 函数需要创建 root fiber  且 设置为 nextUnitOfWork
 *! 剩下的函数在 performUnitOfWork 中执行， 每一个fiber 会做三件事
 *!  - 将元素添加至 dom
 *!  - 为元素的子元素创建 fiber
 *!  - 选择下一个工作单元
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
 */

// 下一个需要执行的任务
let nextUnitOfWork = null;

export function workLoop () {
  let shouldYield = false;  // 是否要挂起
  
  // 如果存在任务 且 未暂停
  while (nextUnitOfWork && !shouldYield) {
    // todo
    // 执行任务
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  window.requestIdleCallback(workLoop);
};

// 创建工作单元
// 执行工作
// 并返回下一个工作单元
export function performUnitOfWork(nextUnitOfWork) {
  // todo
}
