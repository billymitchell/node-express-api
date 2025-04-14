// server.js

// Import required modules
const express = require("express");
const app = express();
require("dotenv").config();

const updateOrder = require("./update_order");
const brightsites_stores = require("./brightsites_stores");
const testing_data = require("./test.json");

const run_test = "false";

// Middleware to parse JSON bodies
app.use(express.json());

// Function to get the current date formatted as ISO but with a space instead of T.
// This returns a string like "2025-02-06 14:30:00".
function formatCurrentDate() {
  return new Date().toISOString().replace("T", " ").split(".")[0];
}

// Function to group order items by their tracking number and order number.
// Also attaches the appropriate Brightsites API key based on URL match
// and formats the ship date from mm/dd/yyyy to yyyy-mm-dd.
function groupItemsByTrackingAndOrder(items) {
  return items.reduce((acc, item) => {
    const trackingNumber = item.tracking_number;
    const orderNumber = item.brightstores_order_id; // Use the correct field for order number

    // Attach the appropriate Brightsites API key based on URL match
    const storeKey = brightsites_stores.store_key.find(
      (key) => key.URL === item.order_metadata_brightstores_site_url
    );
    item.api_key = storeKey ? storeKey.API_Key : null;

    if (!storeKey) {
      console.error(
        `No API key found for URL: ${item.order_metadata_brightstores_site_url}`
      );
    }

    if (!acc[trackingNumber]) {
      acc[trackingNumber] = {};
    }
    if (!acc[trackingNumber][orderNumber]) {
      acc[trackingNumber][orderNumber] = [];
    }
    acc[trackingNumber][orderNumber].push(item);

    // Format the ship date as yyyy-mm-dd
    const [month, day, year] = item.ship_date.split("/");
    item.formatted_ship_date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    return acc;
  }, {});
}

// Main handler for POST requests.
async function handlePostRequest(req, res) {
  const { mail_attachments: items, received_at: date_received } = req.body;
  const apiKey = req.headers["general_access_key"];

  if (!apiKey || apiKey !== process.env.GENERAL_ACCESS_KEY) {
    return res.status(401).send("Unauthorized");
  }

  const current_date_formatted = formatCurrentDate();
  const groupedItems = groupItemsByTrackingAndOrder(items);

  let oneOrMoreErrors = false;
  const all_request_history = [];

  for (const tracking in groupedItems) {
    const orders = groupedItems[tracking];

    for (const orderNumber in orders) {
      const items_in_order = orders[orderNumber];

      if (!items_in_order || items_in_order.length === 0) continue;

      let shipping_method = items_in_order[0].brightstores_shipping_method;
      if (
        ["Unknown Shipping Method", "No Shipping Method", "Free Shipping"].includes(shipping_method)
      ) {
        shipping_method = "UPS Ground";
      }

      const items_in_order_minified = items_in_order.map((item) => ({
        id: Number(item.order_items_brightstores_line_item_id),
        quantity: Number(item.shipment_quantity.replace(/,/g, "")),
      }));

      let additionalNote = "";
      if (Object.keys(orders).length > 1) {
        const otherOrders = Object.keys(orders).filter((num) => num !== orderNumber).join(", ");
        additionalNote = ` Shipped with orders: ${otherOrders}.`;
      }

      const updateOrderPayload = JSON.stringify({
        shipment: {
          tracking_number: tracking,
          send_shipping_confirmation: true,
          ship_date: items_in_order[0].formatted_ship_date,
          note: `Updated From Centricity API on ${current_date_formatted} from data received ${date_received}.${additionalNote}`,
          shipping_method,
          line_items: items_in_order_minified,
        },
      });

      try {
        const request_history = await updateOrder.updateOrder(items_in_order, updateOrderPayload);
        if (!request_history.response_okay) {
          console.error(`API returned failure for order ${orderNumber}:`, request_history);
          oneOrMoreErrors = true;
        }
        all_request_history.push({ tracking, orderNumber, request_history });
      } catch (err) {
        console.error(`Error updating order ${orderNumber} for tracking ${tracking}:`, err);
        all_request_history.push({ tracking, orderNumber, request_history: { response_okay: false, error: err.message } });
        oneOrMoreErrors = true;
      }
    }
  }

  if (!oneOrMoreErrors) {
    res.status(200).send(all_request_history);
  } else {
    res.status(400).send(all_request_history);
  }
}

// Define route for handling POST updates
app.post(
  "/brightsites/shipping/tracking/mailparser/order-items/",
  async (req, res) => {
    await handlePostRequest(req, res);
  }
);

// Start the server listening on the defined port
const port = process.env.PORT || 8080;
app.listen(port, async () => {
  console.log(`Server running on port ${port}`);

  if (run_test === "true") {
    const dummyReq = {
      body: testing_data,
      headers: { "general_access_key": process.env.GENERAL_ACCESS_KEY },
    };
    const dummyRes = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      send(data) {
        console.log("Local POST response:", this.statusCode, data);
      },
    };
    await handlePostRequest(dummyReq, dummyRes);
  }
});
