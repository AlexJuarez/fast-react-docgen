import React, { PropTypes } from 'react';
import { COLOR_ACCENT } from 'txl/styles/theme';

const HIGHLIGHT_STYLE = {
  background: 'rgb(255, 191, 109)',
};

class LinkTemplate extends React.Component {
  render() {
    const {
      active,
      display,
      router,
      style,
      to,
    } = this.props;

    if (active) {
      style.backgroundColor = COLOR_ACCENT['500'];
    }

    const highlight = (name, r) => {
      if (typeof name !== 'string' || r == null) {
        return name;
      }

      const { query } = r.getCurrentLocation();
      if (query.search == null || !query.search.length) {
        return name;
      }

      const re = new RegExp(query.search.split('').map(t => `(${t})`).join('(.*)'), 'ig');
      const matches = re.exec(name);
      if (matches == null) {
        return name;
      }
      const [match, ...rest] = matches;
      const highlights = rest.map((v, i) => {
        if (i % 2 === 0) {
          return <span key={i} style={HIGHLIGHT_STYLE}>{v}</span>;
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
        {highlight(display, router)}
      </span>
    );
  }
}

LinkTemplate.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default LinkTemplate;
