/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { ContentUtils } from 'braft-utils-v2';

import Switch from 'components/common/Switch';
import DropDown from 'components/common/DropDown';
import ControlGroup from 'components/business/ControlGroup';

import './style.scss';

const LinkEditor = (props) => {
  const { language, getContainerNode, allowInsertLinkText, defaultLinkTarget, editor, editorState, hooks } = props;

  const dropDownInstance = useRef(null)
  const [textSelected, setTextSelected] = useState(false)
  const [target, setTarget] = useState(defaultLinkTarget || '')
  const [text, setText] = useState('')
  const [rel, setRel] = useState('')
  const [href, setHref] = useState('')

  useEffect(() => {
    const entity = ContentUtils.getSelectionEntityData(
      props.editorState,
      'LINK',
    );
    const istextSelected =
      !ContentUtils.isSelectionCollapsed(props.editorState) &&
      ContentUtils.getSelectionBlockType(props.editorState) !== 'atomic';

    let selectedText = '';

    if (istextSelected) {
      selectedText = ContentUtils.getSelectionText(props.editorState);
    }

    setTarget(typeof entity.target === 'undefined' ? props.defaultLinkTarget || '' : entity.target || '')
    setText(selectedText)
    setTextSelected(istextSelected)
    setHref(entity.href || '')
    setRel(entity.rel || '')
  }, [props])

  const handleConfirm = () => {
    let hrefStr = href
    let targetStr = target
    const hookReturns = hooks('toggle-link', { href: hrefStr, target: targetStr, rel })({
      href: hrefStr,
      target: targetStr,
      rel,
    });

    dropDownInstance.current.hide();
    editor.requestFocus();

    if (hookReturns === false) {
      return false;
    }

    if (hookReturns) {
      if (typeof hookReturns.href === 'string') {
        hrefStr = hookReturns.href;
      }
      if (typeof hookReturns.target === 'string') {
        targetStr = hookReturns.target;
      }
    }

    if (textSelected) {
      if (hrefStr) {
        editor.setValue(
          ContentUtils.toggleSelectionLink(
            editorState,
            hrefStr,
            {
              target: targetStr,
              rel,
            }
          ),
        );
      } else {
        editor.setValue(
          ContentUtils.toggleSelectionLink(editorState, false, {}),
        );
      }
    } else {
      editor.setValue(
        ContentUtils.insertText(editorState, text || hrefStr, null, {
          type: 'LINK',
          data: { href: hrefStr, target: targetStr, rel },
        }),
      );
    }
    return true;
  }

  const handeKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleConfirm();
      e.preventDefault();
      return false;
    }
    return true;
  };

  const handleUnlink = () => {
    dropDownInstance.current.hide();
    editor.setValue(
      ContentUtils.toggleSelectionLink(editorState, false, {}),
    );
  };

  const handleCancel = () => {
    dropDownInstance.current.hide();
  };

  const caption = <i className="bfi-link" />;

  return (
    <ControlGroup>
      <DropDown
        key={0}
        caption={caption}
        title={language.controls.link}
        autoHide
        getContainerNode={getContainerNode}
        showArrow={false}
        ref={dropDownInstance}
        className="control-item dropdown link-editor-dropdown"
      >
        <div className="bf-link-editor">
          {allowInsertLinkText ? (
            <div className="input-group">
              <input
                type="text"
                value={text}
                spellCheck={false}
                disabled={textSelected}
                placeholder={
                  language.linkEditor.textInputPlaceHolder
                }
                onKeyDown={handeKeyDown}
                onChange={(e) => {
                  e.stopPropagation();
                  setText(e.currentTarget.value)
                }}
              />
            </div>
          ) : null}
          <div className="input-group">
            <input
              type="text"
              value={href}
              spellCheck={false}
              placeholder={
                language.linkEditor.linkInputPlaceHolder
              }
              onKeyDown={handeKeyDown}
              onChange={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setHref(e.currentTarget.value)
              }}
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              value={rel}
              spellCheck={false}
              placeholder={
                language.linkEditor.relInputPlaceHolder
              }
              // onKeyDown={handeKeyDown}
              onChange={(e) => {
                e.stopPropagation();
                setRel(e.currentTarget.value)
              }}
            />
          </div>
          <div className="switch-group">
            <Switch active={target === '_blank'} onClick={() => {
              setTarget(target === '_blank' ? '' : '_blank')
            }} />
            <label>{language.linkEditor.openInNewWindow}</label>
          </div>
          <div className="buttons">
            <a
              onClick={handleUnlink}
              role="presentation"
              className="primary button-remove-link pull-left"
            >
              <i className="bfi-close" />
              <span>{language.linkEditor.removeLink}</span>
            </a>
            <button
              type="button"
              onClick={handleConfirm}
              className="primary pull-right"
            >
              {language.base.confirm}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="default pull-right"
            >
              {language.base.cancel}
            </button>
          </div>
        </div>
      </DropDown>
      <button
        key={1}
        type="button"
        data-title={language.controls.unlink}
        className="control-item button"
        onClick={handleUnlink}
        disabled={!textSelected || !href}
      >
        <i className="bfi-link-off" />
      </button>
    </ControlGroup>
  )
}

LinkEditor.propTypes = {
  defaultLinkTarget: PropTypes.any,
  language: PropTypes.any,
  getContainerNode: PropTypes.any,
  editorState: PropTypes.any,
  editor: PropTypes.any,
  allowInsertLinkText: PropTypes.any,
  hooks: PropTypes.any,
};

export default LinkEditor
