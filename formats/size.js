import { ClassAttributor, Scope, StyleAttributor } from 'parchment';

const ListItemSizeClass = new ClassAttributor('list-item-size', 'ql-li-size', {
  scope: Scope.BLOCK,
  whitelist: ['small', 'large', 'huge'],
});
const ListItemSizeStyle = new StyleAttributor('list-item-size', 'font-size', {
  scope: Scope.BLOCK,
  whitelist: ['10px', '18px', '32px'],
});

const SizeClass = new ClassAttributor('size', 'ql-size', {
  scope: Scope.INLINE,
  whitelist: ['small', 'large', 'huge'],
});
const SizeStyle = new StyleAttributor('size', 'font-size', {
  scope: Scope.INLINE,
  whitelist: ['10px', '18px', '32px'],
});

export { SizeClass, SizeStyle, ListItemSizeClass, ListItemSizeStyle };
