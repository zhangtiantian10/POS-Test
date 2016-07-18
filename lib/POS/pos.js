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

POS.prototype.getSubTotal = function (itemInfoCounts) {
  var itemsGetSubToal = itemInfoCounts.map((itemInfoCount) => {
    if (this.searchPromotions(itemInfoCount.item.barcode) === 1) {
      var subTotal = itemInfoCount.item.price * (itemInfoCount.count - parseInt(itemInfoCount.count/3));
      var saveTotal = itemInfoCount.item.price * parseInt(itemInfoCount.count/3);

      return {itemInfoCount: itemInfoCount, subTotal: subTotal, saveTotal: saveTotal};
    } else if (this.searchPromotions(itemInfoCount.item.barcode) === 2) {
      var subTotal = itemInfoCount.item.price * itemInfoCount.count * 0.95;
      var saveTotal = itemInfoCount.item.price * itemInfoCount.count * 5 / 100;

      return {itemInfoCount: itemInfoCount, subTotal: subTotal, saveTotal: saveTotal};
    }
    var subTotal = itemInfoCount.item.price * itemInfoCount.count;
    return {itemInfoCount: itemInfoCount, subTotal: subTotal};
  });

  return itemsGetSubToal;
}

POS.prototype.searchPromotions = function (barcode) {
  if(!this.promotions) {
    return 0;
  }
  var filteredBuytwo = this.promotions.buyTwoGetOneFree.filter((promotion) => {
    return promotion === barcode;
  });
  var filteredFivePercent = this.promotions.fivePercentDiscount.filter((promotion) => {
    return promotion === barcode
  });
  if (filteredBuytwo.length != 0) {
    return 1;
  }else if (filteredFivePercent.length != 0 && filteredBuytwo.length === 0) {
    return 2;
  }else {
    return 0;
  }
}

module.exports = POS;
