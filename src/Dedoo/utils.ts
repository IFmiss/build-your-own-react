// 是否是正常属性 (移除children & event prop)
export const isProperty = (key: string) => key !== 'children' && !isEvent(key);

// 是否新增 或者 是需要更新的属性
export const isNew = (prev, next) => (key: string) => prev[key] === next[key];

// 是否是已被移除的属性
export const isGone = (prev, next) => (key: string) => !(key in next);

// 是否是时间
export const isEvent = (key: string) => key.startsWith('on');

