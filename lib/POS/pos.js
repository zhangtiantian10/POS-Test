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
    var barcodeArray = barcode.split('-');
    if (barcodeArray.length === 1) {
      barcodeCounts = this.searchSameCode(barcodeCounts, barcodeArray[0],1);
    }else {
      barcodeCounts = this.searchSameCode(barcodeCounts, barcodeArray[0],parseInt(barcodeArray[1]));
    }
  });

  return barcodeCounts;
}

POS.prototype.searchSameCode = function (barcodeCounts, barcode, count) {
  for(var i = 0 ; i < barcodeCounts.length; i++) {
    if(barcodeCounts[i].barcode === barcode) {
      barcodeCounts[i].count += count;
      break;
    }
  }

  if(i === barcodeCounts.length){
    barcodeCounts.push({barcode: barcode, count: count});
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

module.exports = POS;
