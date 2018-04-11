export default {
  name: '🚋  Neighbourhoods',

  visible: true,

  style: `
    #layer {
      line-color: #000;
    }
  `,

  source: `
    SELECT * FROM neighbourhoods
  `,

  options: {
  }
};
