function POS() {

}

POS.prototype.setInfoes = function (itemsInfo) {
  this.itemsInfo = itemsInfo;
};

POS.prototype.setPromotions = function (buyTwoGetOneFree, fivePercentDiscount) {
  this.promotions = {buyTwoGetOneFree : buyTwoGetOneFree, fivePercentDiscount : fivePercentDiscount};
}

POS.prototype.sameBarcodeCounts = function (barcodes) {
  var barcodeCounts = [];

  barcodes.forEach((barcode) => {
    barcodeCounts = this.searchSameCode(barcodeCounts, barcode);
  });

  return barcodeCounts;
}

POS.prototype.searchSameCode = function (barcodeCounts, barcode) {
  for(var i = 0 ; i < barcodeCounts.length; i++) {
    if(barcodeCounts[i].barcode === barcode) {
      barcodeCounts[i].count ++;
      break;
    }
  }

  if(i === barcodeCounts.length){
    barcodeCounts.push({barcode: barcode, count: 1});
  }

  return barcodeCounts;
}

POS.prototype.transCodeToInfo = function (barcode) {
  var itemInfo = this.itemsInfo.filter((itemInfo) => {
    return itemInfo.barcode === barcode;
  });
  return itemInfo[0];
}

POS.prototype.transCodesToInfoes = function (barcodeCounts) {
  var itemInfoCounts = barcodeCounts.map((barcodeCount) => {
    var item = this.transCodeToInfo(barcodeCount.barcode);
    return {item : item, count: barcodeCount.count};
  });

  return itemInfoCounts;
}

POS.prototype.getSubTotal = function (itemInfoCounts) {
  var itemsGetSubToal = itemInfoCounts.map((itemInfoCount) => {
    var subTotal = itemInfoCount.item.price * itemInfoCount.count;
    return {itemInfoCount: itemInfoCount, subTotal: subTotal};
  });

  return itemsGetSubToal;
}

module.exports = POS;
