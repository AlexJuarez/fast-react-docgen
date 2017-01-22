import {
  COLOR_ERROR,
  COLOR_NEUTRAL,
} from 'txl/styles/theme';

const APP_CONTAINER_STYLES = {
  background: COLOR_NEUTRAL[50],
};

const MONOSPACE_STYLE = {
  fontFamily: '"Courier New", "Courier", monospace',
  fontWeight: 'bold',
};

const TABLE_STYLE = {
  borderCollapse: 'collapse',
  width: '100%',
};

const CELL_STYLE = {
  borderBottom: `dashed 1px ${COLOR_NEUTRAL['200']}`,
  paddingBottom: 20,
  paddingRight: 20,
  paddingTop: 20,
  verticalAlign: 'top',
};

const HEAD_CELL_STYLE = {
  ...CELL_STYLE,
  fontSize: 22,
  fontWeight: 100,
  textAlign: 'left',
};

const SHORT_CELL_STYLE = {
  ...CELL_STYLE,
  whiteSpace: 'nowrap',
};

const LONG_CELL_STYLE = {
  ...CELL_STYLE,
  width: '100%',
};

const CONTENT_PANE_STYLE = {
  WebKitFlex: 1,
  WebkitBoxFlex: 1,
  flex: 1,
  msFlex: 1,
  padding: '10px 40px',
};

const CONTENT_COLUMN_STYLE = {
  margin: '0 auto',
  maxWidth: 980,
  minHeight: '100%',
  position: 'relative',
};

const PAGE_CONTAINER_STYLE = {
  display: 'flex',
};

const NAVBAR_STYLE = {
  flexBasis: 200,
};

const SPLASH_STYLE = {
  color: COLOR_NEUTRAL['200'],
  fontSize: 48,
  fontWeight: 100,
  paddingTop: 240,
  textAlign: 'center',
};

const DOCUMENTATION_STYLE = {
  paddingTop: 40,
};

const DOCUMENTATION_ERROR_STYLE = {
  color: COLOR_ERROR['500'],
  fontStyle: 'italic',
};

export {
  APP_CONTAINER_STYLES,
  MONOSPACE_STYLE,
  TABLE_STYLE,
  CELL_STYLE,
  HEAD_CELL_STYLE,
  SHORT_CELL_STYLE,
  LONG_CELL_STYLE,
  CONTENT_PANE_STYLE,
  CONTENT_COLUMN_STYLE,
  PAGE_CONTAINER_STYLE,
  NAVBAR_STYLE,
  SPLASH_STYLE,
  DOCUMENTATION_STYLE,
  DOCUMENTATION_ERROR_STYLE,
};
