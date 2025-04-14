const errors = require('./erorr.json');

errors.forEach(error => {
    const payload = JSON.parse(error.request_history.payload);
    console.log('Status:', error.request_history.status);
    console.log('Tracking Number:', payload.shipment.tracking_number);
    console.log('Line Items:');
    payload.shipment.line_items.forEach(item => {
        console.log(`  - ID: ${item.id}, Quantity: ${item.quantity}`);
    });
});