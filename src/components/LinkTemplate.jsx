import React, { PropTypes } from 'react';
import shallowCompare from 'shallow-compare';
import { COLOR_ACCENT } from 'txl/styles/theme';

const HIGHLIGHT_STYLE = {
  background: 'rgb(255, 191, 109)',
};

class LinkTemplate extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const {
      active,
      display,
      router,
      style,
      to,
      meta,
    } = this.props;

    if (active) {
      style.backgroundColor = COLOR_ACCENT['500'];
    }

    const highlight = (name) => {
      if (typeof name !== 'string' || meta.get('search') == null) {
        return name;
      }

      const search = meta.get('search');
      const re = new RegExp(search
        .split('')
        .map(t => `([${t}])`)
        .join('(.*?)'),
        'i'
      );
      const matches = re.exec(name);
      if (matches == null) {
        return name;
      }
      const [match, ...rest] = matches;
      const highlights = rest.map((v, i) => {
        if (i % 2 === 0) {
          return <span key={i + v} style={HIGHLIGHT_STYLE}>{v}</span>;
        }

        return v;
      });

      const index = name.indexOf(match);

      return (
        <span>
          {name.substr(0, index)}
          {highlights}
          {name.substr(index + match.length)}
        </span>
      );
    };

    const onClick = () => {
      if (to != null) {
        const location = router.getCurrentLocation();
        location.pathname = to;
        router.push(location);
      }
    };

    return (
      <span {...{ name, onClick, style }}>
        {highlight(display)}
      </span>
    );
  }
}

LinkTemplate.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default LinkTemplate;
