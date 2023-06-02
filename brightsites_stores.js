require('dotenv').config()

let store_key = [
    {
      ENV_KEY: "BS_API_KEY_FTG_SHOP",
      URL: "https://ftg-shop.mybrightsites.com",
      API_Key: process.env.BS_API_KEY_FTG_SHOP,
    },
    {
      ENV_KEY: "BS_API_KEY_FTG_REDEMPTION",
      URL: "https://ftg-redemption.mybrightsites.com",
      API_Key: process.env.BS_API_KEY_FTG_REDEMPTION,
    },
  ];

module.exports = {
  store_key
}