import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'txl/buttons/Button';
import { COLOR_NEUTRAL } from 'txl/styles/theme';
import { gridUnits as gu } from 'txl/styles/helpers';

import DemoCard from '../components/DemoCard';

class DemosPage extends Component {
  constructor(props, context) {
    super(props, context);

    this._handleShowMore = this._handleShowMore.bind(this);

    this.state = {
      rendered: 5,
    };
  }

  _getDocs(file, title) {
    const { docs } = this.props;

    return docs.getIn([file, title]);
  }

  _filterCategory() {
    const { demos, docs, category } = this.props;

    if (demos == null || docs == null) {
      return [];
    }

    const orderedDemos = demos.sort((a, b) => {
      return docs.getIn([`${b.id}`, '_mtime']) - docs.getIn([`${a.id}`, '_mtime']);
    });

    if (category == null) {
      return orderedDemos;
    }

    return orderedDemos
      .filter(demo => demo.category === category);
  }

  _getDemos() {
    const { search } = this.props;
    const demos = this._filterCategory();

    if (search == null || !search.length) {
      return demos;
    }

    const searchRE = new RegExp(search.split('').join('(.*)'), 'ig');
    return demos.filter(demo => searchRE.test(demo.title) || searchRE.test(demo.category));
  }

  _handleShowMore() {
    this.setState({ rendered: this.state.rendered + 5 });
  }

  _renderMoreButton(show) {
    if (!show) {
      return null;
    }

    return <Button onClick={this._handleShowMore} variant="neutral">More</Button>;
  }

  _renderMore(demos) {
    const Max = Math.min(this.state.rendered, demos.length);

    if (Max === 0) {
      return null;
    }

    return (
      <div style={{ marginBottom: gu(2), textAlign: 'right' }}>
        <span
          style={{
            color: COLOR_NEUTRAL['500'],
            fontStyle: 'italic',
            lineHeight: gu(5),
            marginRight: gu(2),
          }}
        >
          Showing {Max} of {demos.length}
        </span>
        {this._renderMoreButton(Max < demos.length)}
      </div>
    );
  }

  render() {
    const demos = this._getDemos();
    const cards = demos.slice(0, this.state.rendered).map((file) => {
      const { category, title, path } = file;

      return (
        <DemoCard
          key={path}
          link
          category={category}
          title={title}
          file={path}
          docs={this._getDocs(file, title)}
        />
      );
    }).slice(0, this.state.rendered);

    return (
      <div>
        {this._renderMore(demos)}
        {cards}
        {this._renderMore(demos)}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  category: ownProps.params.category,
  demos: state.nav.files,
  docs: state.docs,
  search: ownProps.location.query.search,
});

export default connect(mapStateToProps)(DemosPage);
