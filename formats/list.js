import Block from '../blots/block';
import Container from '../blots/container';
import Quill from '../core/quill';

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

  insertBefore(childBlot, refBlot) {
    super.insertBefore(childBlot, refBlot);
    if (childBlot.attributes && childBlot.attributes.values().size) {
      const nonDefaultSize = childBlot.attributes.values().size;
      this.evaluateSizeAttributor(nonDefaultSize);
    }
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
      if (this.isSameSize(value)) {
        this.evaluateSizeAttributor(value);
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
        sameSize = child.attributes.values().size === size && sameSize;
      }
    });
    if (hasDefaultValue && hasNonDefaultValue) {
      return false;
    }
    return sameSize;
  }

  evaluateSizeAttributor(value) {
    const cls = Quill.import('attributors/class/size');
    const sty = Quill.import('attributors/style/size');
    const sizeAttor = Quill.import('formats/size');
    if (cls && cls.whitelist && cls.whitelist.indexOf(value) > -1) {
      this.uiNode.classList.forEach(token => {
        if (token.startsWith('ql-size-')) {
          this.uiNode.classList.remove(token);
        }
      });
      this.uiNode.classList.add(`${cls.keyName}-${value}`);
    } else if (sty && sty.whitelist && sty.whitelist.indexOf(value) > -1) {
      this.uiNode.setAttribute('style', `font-size: ${value}`);
    } else if (value) {
      console.warn('!!!!!!!! no size attributor found');
    } else if (sizeAttor === cls) {
      this.uiNode.removeAttribute('class');
      this.attachUI(this.uiNode);
    } else if (sizeAttor === sty) {
      this.uiNode.removeAttribute('style');
    } else {
      console.warn('!!!!!!!! no size attributor found');
    }
  }
}
ListItem.blotName = 'list';
ListItem.tagName = 'LI';

ListContainer.allowedChildren = [ListItem];
ListItem.requiredContainer = ListContainer;

export { ListContainer, ListItem as default };
