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

module.exports = POS;
