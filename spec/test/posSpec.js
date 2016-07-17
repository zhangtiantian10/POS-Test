describe('POS', () => {
  var POS = require('../../lib/POS/pos');
  itemsInfo = [
    {
      barcode: 'ITEM000001',
      name: '可口可乐',
      unit: '瓶',
      category: '食品',
      subCategory: '碳酸饮料',
      price: 26.00
    },{
      barcode: 'ITEM000002',
      name: '脉动',
      unit: '瓶',
      category: '食品',
      subCategory: '功能饮料',
      price: 4.00
    },{
      barcode: 'ITEM000003',
      name: '雪碧',
      unit: '瓶',
      category: '食品',
      subCategory: '碳酸饮料',
      price: 3.00
    },{
      barcode: 'ITEM000004',
      name: '加多宝',
      unit: '罐',
      category: '食品',
      subCategory: '凉茶饮料',
      price: 4.00
    }
  ];

  describe('setInfoes', () => {
    it('should pos.itemsInfo is right', () => {
      var pos = new POS();
      pos.setInfoes(itemsInfo);
      expect(pos.itemsInfo).toEqual(itemsInfo);
    });
  });

  describe('setPromotions', () => {
    var buyTwoGetOneFree = ['ITEM000001','ITEM000002'];
    var fivePercentDiscount = ['ITEM000001'];
    it('should pos.promotions is right', () => {
      var pos = new POS();
      pos.setPromotions(buyTwoGetOneFree, fivePercentDiscount);
      var promotions = {buyTwoGetOneFree: buyTwoGetOneFree, fivePercentDiscount: fivePercentDiscount};
      expect(pos.promotions).toEqual(promotions);
    })
  });

  describe('sameBarcodeCount', () => {
    var codes = [
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000004',
        'ITEM000004',
        'ITEM000004'
    ];
    it('should pos.barcodeCounts is data', () => {
      var pos = new POS();
      pos.sameBarcodeCounts(codes);

      expect(pos.barcodeCounts).toEqual([{barcode: 'ITEM000001', count: 5}, {barcode: 'ITEM000004', count: 3}]);
    });
  });
});
