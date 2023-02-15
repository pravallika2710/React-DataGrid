import React from 'react';
import { css } from "@linaria/core"

const textEditorInternalClassname = css`
  @layer rdg.TextEditor {
    appearance: none;

    box-sizing: border-box;
    inline-size: 100%;
    block-size: 100%;
    padding-block: 0;
    padding-inline: 6px;
    border: 2px solid #ccc;
    vertical-align: top;
    color: var(--rdg-color);
    background-color: var(--rdg-background-color);

    font-family: inherit;
    font-size: var(--rdg-font-size);

    &:focus {
      border-color: var(--rdg-selection-color);
      outline: none;
    }

    &::placeholder {
      color: #999;
      opacity: 1;
    }
  }
`

export const textEditorClassname = `rdg-text-editor ${textEditorInternalClassname}`

function autoFocusAndSelect(input) {
  input?.focus()
  input?.select()
}

export default function textEditor({ row, column, onRowChange, onClose }) {
  return (
    <input
      spellCheck="false"
      className={textEditorClassname}
      ref={autoFocusAndSelect}
      value={row[column.field]}
      onChange={event =>
        onRowChange({ ...row, [column.field]: event.target.value })
      }
      onBlur={() => onClose(true)}
    />
  )
}
