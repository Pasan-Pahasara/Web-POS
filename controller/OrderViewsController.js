/**
 * @author : Pasan Pahasara
 * @since : 0.1.0
 **/

// load all orders functions
function loadAllOrders() {

    $("#tblOrder").empty();

    for (let order of orderDB) {
        let row = `<tr><td>${order.oId}</td><td>${order.cId}</td><td>${order.oDate}</td><td>${order.subTotal}</td><td>${order.discount}</td></tr>`;
        $("#tblOrder").append(row);
    }
}

// load all order details functions
function loadAllOrderDetails() {

    $("#tblOrderDetails").empty();

    for (let orderDetail of orderDetails) {
        let row = `<tr><td>${orderDetail.orderId}</td><td>${orderDetail.cusId}</td><td>${orderDetail.itemId}</td><td>${orderDetail.qty}</td><td>${orderDetail.total}</td></tr>`;
        $("#tblOrderDetails").append(row);
    }
}