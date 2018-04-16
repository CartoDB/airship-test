import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import carto from 'carto.js';
import { CategoryWidget } from '@carto/airship'
import Widget from './Widget';

class Neighbourhoods extends Component {
  static propTypes = {
    context: PropTypes.shape({
      client: PropTypes.object,
      layers: PropTypes.object,
      map: PropTypes.object,
    }),
  }

  state = {
    categories: [],
    selected: [],
  }

  constructor(props) {
    super(props);

    const { client, layers, map } = props;
    const { source } = layers.listings;

    const sql = source.getQuery();
    const bboxFilter = new carto.filter.BoundingBoxLeaflet(map);

    this.baseQuery = this.props.layers.neighbourhoods.source.getQuery()

    this.dataView = new carto.dataview.Category(new carto.source.SQL(sql), 'neighbourhood', {
      limit: 10,
      operation: carto.operation.COUNT,
      operationColumn: 'cartodb_id'
    });
    this.dataView.addFilter(bboxFilter);
    this.dataView.on('dataChanged', this.onDataChanged);

    client.addDataview(this.dataView);
  }

  componentWillUnmount() {
    this.dataView.off('dataChanged');
  }

  onDataChanged = (data) => {
    this.setState(data);
  }

  onCategoryClicked = (selected) => {
    const { source } = this.props.layers.listings;
    const neighSource = this.props.layers.neighbourhoods.source;
    const filter = selected.map(category => `'${category}'`).join(',');
    const originalQuery = this.dataView.getSource()._query;

    this.setState({ selected }, () => {
      if (selected.length === 0) {
        source.setQuery(originalQuery)
        neighSource.setQuery(this.baseQuery)
      } else {
        source.setQuery(`${originalQuery} AND neighbourhood IN (${filter})`);
        neighSource.setQuery(`${this.baseQuery} WHERE neighbourhood IN (${filter})`);
      }
    })
  }

  render() {
    const { categories, max, selected } = this.state;

    return (
      <Widget>
        <Widget.Title>Neighbourhoods</Widget.Title>
        <Widget.Description>Amount of hosts per neighbourhood.</Widget.Description>

        <CategoryWidget
          categories={categories}
          max={max}
          color="#3AB5F0"
          onCategoryClick={this.onCategoryClicked}
          selected={selected}
        />
      </Widget>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client,
  map: state.map,
  layers: state.layers,
});

export default connect(mapStateToProps)(Neighbourhoods);
