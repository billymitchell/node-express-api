async function updateOrder(items_in_shipment, updateOrderPayload) {


    // request object
    let request_history = []


    let url = `${items_in_shipment[0].order_metadata_brightstores_site_url}/api/v2.6.0/orders/${items_in_shipment[0].brightstores_order_id}/shipments?token=${items_in_shipment[0].api_key}`;
    let response = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
      body: updateOrderPayload,
    });
    // // if error
    if (!response.ok) {
      
      request_history.push({
        "response_okay": response.ok,
        "status_text": response.statusText,
        "status": response.status,
        "error": response.error,
        "payload": updateOrderPayload,
      })
      
    }
      // if no error
    if (response.ok) {
     
      request_history.push({
        "response_okay": response.ok,
        "status_text": response.statusText,
        "status": response.status,
        "error": response.error,
        "payload": updateOrderPayload,
      })
    }
    return request_history[0]
}


module.exports = {
    updateOrder
}