require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'fastfree',
  database: 'fastfree',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
