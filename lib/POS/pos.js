function POS() {

}

POS.prototype.setInfoes = function (itemsInfo) {
  this.itemsInfo = itemsInfo;
};

POS.prototype.setPromotions = function (buyTwoGetOneFree, fivePercentDiscount) {
  this.promotions = {buyTwoGetOneFree : buyTwoGetOneFree, fivePercentDiscount : fivePercentDiscount};
}

POS.prototype.sameBarcodeCounts = function (barcodes) {
  this.barcodeCounts = [];

  barcodes.forEach((barcode) => {
    this.searchSameCode(barcode);
  });
}

POS.prototype.searchSameCode = function (barcode) {
  for(var i = 0 ; i < this.barcodeCounts.length; i++) {
    if(this.barcodeCounts[i].barcode === barcode) {
      this.barcodeCounts[i].count ++;
      break;
    }
  }

  if(i === this.barcodeCounts.length){
    this.barcodeCounts.push({barcode: barcode, count: 1});
  }
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

module.exports = POS;
