export type KeyUnion = string | number | symbol;

export function renameKey(obj: { [key: KeyUnion]: unknown }, oldKey: KeyUnion, newKey: KeyUnion) {
  const copiedObj = { ...obj };
  const value = copiedObj[oldKey];
  copiedObj[newKey] = value;
  delete copiedObj[oldKey];
  return copiedObj;
}
