import { wipRoot } from './commit';
import {
  getWipFiber,
  getHookIndex,
  setHookIndex,
  setNextUnitOfWork
} from './concurrent';

import {
  getWipRoot,
  setWipRoot
} from './commit';
import { getCurrentRoot, setDeletions } from './reconciliation';

export function useState<T>(initial:T): [
  T,
  (action: T | ((prevState: T) => T)) => void
] {
  let wipFiber = getWipFiber();
  let hookIndex = getHookIndex();
  console.info(hookIndex)
  const oldHook = wipFiber && wipFiber.alternate &&
                  wipFiber.alternate.hooks &&
                  wipFiber.alternate.hooks[hookIndex]
  console.info('oldHook', oldHook)

  // 如果有一个旧钩子，则将状态从旧钩子复制到新钩子，如果没有，则初始化状态。
  const hook: {
    state: T,
    queue: any[]
  } = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  }

  console.info('hook', hook);

  // let wipRoot = getWipRoot();
  // let currentRoot = getCurrentRoot();

  const actions = oldHook ? oldHook.queue : [];
  console.info('actions', actions);
  actions?.forEach(action => {
    hook.state = action(hook.state);
  });

  console.info('hook.state', hook.state);

  const setState = (action: T | ((prevState: T) => T)) => {
    let act = action;
    if (typeof action !== 'function') {
      act = () => action;
    }
    console.info(act)
    hook.queue.push(act);
    console.info(hook)
    
    let currentRoot = getCurrentRoot();

    console.info('getCurrentRoot()', getCurrentRoot(), currentRoot);
    setWipRoot({
      dom: currentRoot?.dom || null,
      props: currentRoot?.props || null,
      alternate: currentRoot,
    } as any)
    console.info('getWipRoot()', getWipRoot());
    setNextUnitOfWork(getWipRoot());
    setDeletions([]);
  }

  // 然后我们向纤维添加新的钩子，钩子索引增加1，并返回状态
  getWipFiber()?.hooks?.push(hook);
  setHookIndex((hookIndex as number)++);
  return [hook.state, setState];
}
