/**
 * @author : Pasan Pahasara
 * @since : 0.1.0
 **/
class orderDetailDTO {
    constructor(orderId, cusId, itemId, qty, total) {
        this.orderId = orderId;
        this.cusId = cusId;
        this.itemId = itemId;
        this.qty = qty;
        this.total = total;
    }
}