
function POS() {
  this.promotions = [];
}

POS.prototype.setInfoes = function (itemsInfo) {
  this.itemsInfo = itemsInfo;
};

POS.prototype.setPromotions = function (type, barcodes) {
  this.promotions.push({type, barcodes});
}

POS.prototype.sameBarcodeCounts = function (barcodes) {
  var barcodeCounts = [];

  barcodes.forEach((barcode) => {
    var barcodeArray = barcode.split('-');
    var count = parseFloat(barcodeArray[1] || 1);

    var barcodeCount = barcodeCounts.find(barcodeCount => barcodeCount.barcode === barcode);

    if(barcodeCount) {
      barcodeCount.count += count;
    } else {
      barcodeCounts.push({barcode: barcodeArray[0], count: count});
    }
  });

  return barcodeCounts;
}

POS.prototype.transCodesToInfoes = function (barcodeCounts) {
  var itemInfoCounts = barcodeCounts.map((barcodeCount) => {
    var item = this.itemsInfo.find(item => item.barcode === barcodeCount.barcode);
    return {item : item, count: barcodeCount.count};
  });

  return itemInfoCounts;
}

POS.prototype.getSubTotal = function (itemInfoCounts) {
  var itemsGetSubToal = itemInfoCounts.map((itemInfoCount) => {
    var promotionType = this.getPromotionType(itemInfoCount.item.barcode);
    var priceArray = this.discount(promotionType, itemInfoCount);

    return {itemInfoCount: itemInfoCount, subTotal: priceArray[0], saveTotal: priceArray[1]};
  });

  return itemsGetSubToal;
}

POS.prototype.discount = function (promotionType, itemInfoCount) {
  var subTotal = itemInfoCount.item.price * itemInfoCount.count;
  var saveTotal = 0;
  if(promotionType === 'BUY_TWO_GET_ONE_FREE') {
    saveTotal = itemInfoCount.item.price * parseInt(itemInfoCount.count / 3);
    subTotal -= saveTotal;
  } else if(promotionType === 'FIVE_PERCENT_DISCOUNT') {
    saveTotal = subTotal * 5 / 100;
    subTotal = subTotal * 95 / 100;
  }

  return [subTotal, saveTotal];
}

POS.prototype.getPromotionType = function (barcode) {
  if(this.promotions.length === 0) {
    return '';
  }
  var promotion = this.promotions.find(promotion => promotion.barcodes.some(code => code === barcode));
  var promotionType = promotion ? promotion.type : '';

  return promotionType;
}

POS.prototype.getTotal = function (itemsGetSubToal) {
  var total = 0, saved = 0;
  itemsGetSubToal.forEach((itemGetSubToal) => {
    total += itemGetSubToal.subTotal;
    saved += itemGetSubToal.saveTotal;
  });

  return {itemsGetSubToal: itemsGetSubToal, total: total, saved: saved};
}

POS.prototype.print = function (itemsGetTotal) {
  var printText = '';
  var promotionsText = '';

  itemsGetTotal.itemsGetSubToal.forEach((itemGetSubToal) => {
    printText += this.getItemsText(itemGetSubToal);
    promotionsText += this.getPromotionsText(itemGetSubToal);
  });

  if(promotionsText != '') {
    promotionsText = `----------------------
买二赠一商品：
${promotionsText}`;
  }
  var totalText = this.getTotalText(itemsGetTotal);

  return `***<没钱赚商店>购物清单***
${printText}${promotionsText}${totalText}`;
}

POS.prototype.getItemsText = function (itemGetSubToal) {
  var item = itemGetSubToal.itemInfoCount.item;
  var itemsText;
  if(this.getPromotionType(item.barcode) === 'FIVE_PERCENT_DISCOUNT') {
    itemsText = `，节省${itemGetSubToal.saveTotal.toFixed(2)}(元)`;
  } else {
    itemsText = ``;
  }

  return `名称：${item.name}，\
数量：${itemGetSubToal.itemInfoCount.count}${item.unit}，\
单价：${item.price.toFixed(2)}(元)，\
小计：${itemGetSubToal.subTotal.toFixed(2)}(元)${itemsText}
`;
}

POS.prototype.getPromotionsText = function (itemGetSubToal) {
  var item = itemGetSubToal.itemInfoCount.item;
  var promotionsText = '';
  if(this.getPromotionType(item.barcode) === 'BUY_TWO_GET_ONE_FREE') {
    promotionsText = `名称：${item.name}，\
数量：${parseInt(itemGetSubToal.itemInfoCount.count / 3)}${item.unit}
`;
  }

  return promotionsText;
}

POS.prototype.getTotalText = function (itemsGetTotal) {
  var totalText = `**********************`;
  if(itemsGetTotal.saved != 0) {
    totalText = `节省：${itemsGetTotal.saved.toFixed(2)}(元)
**********************`;
  }
  return `----------------------
总计：${itemsGetTotal.total.toFixed(2)}(元)
${totalText}`
}

module.exports = POS;
