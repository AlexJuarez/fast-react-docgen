import React, { PropTypes } from 'react';
import Container from 'txl/containers/Container';

import {
  MONOSPACE_STYLE,
  TABLE_STYLE,
  HEAD_CELL_STYLE,
  SHORT_CELL_STYLE,
  LONG_CELL_STYLE,
} from '../styles';

const typeToString = (typeDoc) => {
  if (!typeDoc) {
    return 'not specified';
  }
  if (typeDoc.name === 'union') {
    return `oneOfType([${typeDoc.value.map(typeToString).join(', ')}])`;
  }
  if (typeDoc.name === 'enum') {
    return `oneOf([${typeDoc.value.map(item => item.value).join(', ')}])`;
  }
  return `${typeDoc.name}`;
};

const flowTypeToString = (typeDoc) => {
  if (!typeDoc) {
    return 'not specified';
  }

  if (typeDoc.name === 'union' || typeDoc.name === 'enum') {
    return `oneOf([${typeDoc.elements.map(item => item.value).join(', ')}])`;
  }

  return `${typeDoc.name}`;
};

const PropTable = (props) => {
  if (!props.docs.props) {
    return <div>No PropTypes defined.</div>;
  }
  return (
    <Container style={{ padding: '20px' }}>
      <h2 style={{ margin: '5px 0' }}>Prop Documentation</h2>
      <table style={TABLE_STYLE}>
        <thead>
          <tr>
            <th style={{ ...HEAD_CELL_STYLE, ...SHORT_CELL_STYLE }}>Property</th>
            <th style={{ ...HEAD_CELL_STYLE, ...SHORT_CELL_STYLE }} />
            <th style={{ ...HEAD_CELL_STYLE, ...LONG_CELL_STYLE }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(props.docs.props).map((propName) => {
            const propDoc = props.docs.props[propName];
            return (
              <tr key={propName}>
                <td style={SHORT_CELL_STYLE}>
                  <span style={MONOSPACE_STYLE}>{propName}</span>
                </td>
                <td style={SHORT_CELL_STYLE}>
                  <div
                    style={{
                      whiteSpace: 'normal',
                      width: 200,
                      wordWrap: 'break-word',
                    }}
                  >
                    {!propDoc.flowType && typeToString(propDoc.type)}
                    {propDoc.flowType && flowTypeToString(propDoc.flowType)}
                    {propDoc.required && ', required'}
                  </div>
                </td>
                <td style={LONG_CELL_STYLE}>
                  {propDoc.description && `${propDoc.description} `}
                  {propDoc.defaultValue && (
                    <span>
                        {'Default: '}
                      <span style={MONOSPACE_STYLE}>
                        {propDoc.defaultValue.value}
                      </span>.{' '}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Container>
  );
};

PropTable.propTypes = {
  docs: PropTypes.shape({
    props: PropTypes.object,
  }),
};

export default PropTable;
