/**
 * @author : Pasan Pahasara
 * @since : 0.1.0
 **/

class orderDTO {
    constructor(oId, cId, oDate, subTotal, discount) {
        this.oId = oId;
        this.cId = cId;
        this.oDate = oDate;
        this.subTotal = subTotal;
        this.discount = discount;
    }
}