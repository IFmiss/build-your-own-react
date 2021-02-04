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

export function useState<T>(initial:T) {
  let wipFiber = getWipFiber();
  let hookIndex = getHookIndex();
  const oldHook = wipFiber?.alternate?.hooks?.[hookIndex || 0];

  // 如果有一个旧钩子，则将状态从旧钩子复制到新钩子，如果没有，则初始化状态。
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  }

  console.info('hook', hook);

  let wipRoot = getWipRoot();
  let currentRoot = getCurrentRoot();

  const actions = oldHook ? oldHook.queue : [];
  console.info('actions', actions);
  actions?.forEach(action => {
    hook.state = action(hook.state);
  });

  const setState = (action) => {
    hook.queue.push(action);
    console.info('hookhookhook', hook);
    setWipRoot({
      dom: currentRoot?.dom || null,
      props: currentRoot?.props || null,
      alternate: currentRoot,
    } as any)

    setNextUnitOfWork(wipRoot);
    setDeletions([]);
  }

  // 然后我们向纤维添加新的钩子，钩子索引增加1，并返回状态
  wipFiber?.hooks?.push(hook, setState);
  setHookIndex((hookIndex as number)++);
  return [hook.state];
}
