export default {
  name: '🏠 Airbnb Listings',

  visible: true,

  style: `
    #layer {
      marker-width: 7;
      marker-fill-opacity: 1;
      marker-line-width: 1;
      marker-line-color: white;
      marker-allow-overlap: true;

      [room_type="Shared room"] {
        marker-fill: #F45171;
      }

      [room_type="Private room"] {
        marker-fill: #7E78E2;
      }

      [room_type="Entire home/apt"] {
        marker-fill: #3AB5F0;
      }
    }
  `,

  source: `
    SELECT
      *
    FROM
      airbnb_listings_filtered
    WHERE availability_365 > 0
  `,

  options: {
    featureClickColumns: ['price', 'neighbourhood', 'room_type', 'name', 'picture_url']
  }
};
