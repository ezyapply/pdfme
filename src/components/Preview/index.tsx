import React, { useState } from 'react';
import { PreviewProp } from '../../libs/type';
import { rulerHeight } from '../../libs/constants';
import Pager from './Pager';
import Root from '../Root';
import Paper from '../Paper';
import Schema from '../Schemas';
import { useUiPreProcessor } from '../../libs/hooks';

const LabelEditorPreview = ({ template, inputs, size }: PreviewProp) => {
  const { backgrounds, pageSizes, scale } = useUiPreProcessor({
    template,
    size,
    offset: rulerHeight,
  });

  const [pageCursor, setPageCursor] = useState(0);

  // const handleChangeInput = ({ key, value }: { key: string; value: string }) =>
  //   onChange && onChange({ index: pageCursor, key, value });

  const editable = false;
  // const editable = Boolean(onChange);
  const input = inputs[pageCursor];
  const { schemas } = template;

  return (
    <Root template={template} size={size} scale={scale}>
      <Pager pageCursor={pageCursor} pageNum={inputs.length} setPageCursor={setPageCursor} />
      <Paper
        scale={scale}
        schemas={schemas}
        pageSizes={pageSizes}
        backgrounds={backgrounds}
        render={({ schema }) =>
          Object.entries(schema).map((entry) => {
            const [key, s] = entry;

            return (
              <Schema
                key={key}
                schema={Object.assign(s, { key, id: key, data: input[key] ? input[key] : '' })}
                editable={editable}
                placeholder={template.sampledata[0][key] || ''}
                tabIndex={(template.columns.findIndex((c) => c === key) || 0) + 100}
                onChange={(value) => {
                  // handleChangeInput({ key, value })
                }}
                border={editable ? '1px dashed #4af' : 'transparent'}
              />
            );
          })
        }
      />
    </Root>
  );
};

export default LabelEditorPreview;
