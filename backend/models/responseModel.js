class ResponseModel {
  data;
  rows;
  page;

  constructor(data, rows, page) {
    this.data = data;
    this.rows = rows;
    this.page = page;
  }
}

module.exports = {
  ResponseModel,
};
