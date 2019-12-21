import Block from '../blots/block';
import Container from '../blots/container';
import Quill from '../core/quill';
import { ListItemSizeClass } from './size';

class ListContainer extends Container {}
ListContainer.blotName = 'list-container';
ListContainer.tagName = 'OL';

class ListItem extends Block {
  static create(value) {
    const node = super.create();
    node.setAttribute('data-list', value);
    return node;
  }

  static formats(domNode) {
    return domNode.getAttribute('data-list') || undefined;
  }

  static register() {
    Quill.register(ListContainer);
  }

  constructor(scroll, domNode) {
    super(scroll, domNode);
    const ui = domNode.ownerDocument.createElement('span');
    const listEventHandler = e => {
      if (!scroll.isEnabled()) return;
      const format = this.statics.formats(domNode, scroll);
      if (format === 'checked') {
        this.format('list', 'unchecked');
        e.preventDefault();
      } else if (format === 'unchecked') {
        this.format('list', 'checked');
        e.preventDefault();
      }
    };
    ui.addEventListener('mousedown', listEventHandler);
    ui.addEventListener('touchstart', listEventHandler);
    this.attachUI(ui);
  }

  format(name, value) {
    if (name === this.statics.blotName && value) {
      this.domNode.setAttribute('data-list', value);
    } else {
      super.format(name, value);
    }
  }

  formatAt(index, length, name, value) {
    super.formatAt(index, length, name, value);

    if (name === 'size') {
      if (value && this.isSameSize(value)) {
        // Remove size attributes:
        super.formatAt(index, length, 'size');
        // Add size to the entire list item:
        super.formatAt(index, length + 1, 'list-item-size', value);
      } else {
        this.doSplitSize();
        super.formatAt(index, length, name, value);
      }
    }
  }

  isSameSize(size) {
    let sameSize = true;
    let hasDefaultValue = false;
    let hasNonDefaultValue = false;

    this.children.forEach(child => {
      if (!child.attributes) {
        hasDefaultValue = true;
      } else if (!child.attributes.values().size) {
        hasDefaultValue = true;
      } else {
        hasNonDefaultValue = true;
        console.log(
          'child.attributes.values().size, size',
          child.attributes.values().size,
          size,
        );
        sameSize = child.attributes.values().size === size && sameSize;
      }
    });
    console.log('sameSize', hasDefaultValue, hasNonDefaultValue, sameSize);
    if (hasDefaultValue && hasNonDefaultValue) {
      return false;
    }
    return sameSize;
  }

  doSplitSize() {
    const propName = 'list-item-size';
    const uniSize = this.attributes.values()[propName];
    if (uniSize) {
      super.formatAt(0, 100, 'size', uniSize);
      // Remove the list-item-level size;
      // super.formatAt(index, length + 1, 'list-item-size');
      this.attributes.attribute(ListItemSizeClass);
    }
  }
}
ListItem.blotName = 'list';
ListItem.tagName = 'LI';

ListContainer.allowedChildren = [ListItem];
ListItem.requiredContainer = ListContainer;

export { ListContainer, ListItem as default };
