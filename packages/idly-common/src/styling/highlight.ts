export const enum Highlight {
  'KIND_NEVER' = 'KIND_NEVER', // restrictions, urgent, NO!
  'KIND_GOOD' = 'KIND_GOOD', // default, greenish, ok stuff
  'KIND_SELECTION' = 'KIND_SELECTION', // restrictions, urgent, NO!
  'KIND_ONLY' = 'KIND_ONLY', // Selection
  'KIND_HOVER' = 'KIND_HOVER', // Hover
  'KIND_NORMAL' = 'KIND_NORMAL', // ok , default, starting
  'KIND_UNIMPORTANT' = 'KIND_UNIMPORTANT', // Unimportant
}

export const HighlightColor = {
  [Highlight.KIND_NEVER]: '#FF0000',
  [Highlight.KIND_GOOD]: '#32CD32',
  [Highlight.KIND_SELECTION]: '#00f9ff',
  [Highlight.KIND_ONLY]: '#B036FF',
  [Highlight.KIND_NORMAL]: '#9999ff',
  [Highlight.KIND_HOVER]: '#fbb03b',
  [Highlight.KIND_UNIMPORTANT]: '#aaa',
};
