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
    it('should return right data', () => {
      var pos = new POS();

      expect(pos.sameBarcodeCounts(codes)).toEqual([{barcode: 'ITEM000001', count: 5}, {barcode: 'ITEM000004', count: 3}]);
    });
  });

  describe('transCodeToInfo', () => {
    it('should return right data', () => {
      var pos = new POS();
      pos.setInfoes(itemsInfo);
      var barcode = 'ITEM000001';
      expect(pos.transCodeToInfo(barcode)).toEqual({
        barcode: 'ITEM000001',
        name: '可口可乐',
        unit: '瓶',
        category: '食品',
        subCategory: '碳酸饮料',
        price: 26.00
      });
    });
  });

  describe('transCodesToInfoes', () => {
    var barcodeCounts = [{barcode: 'ITEM000001', count: 5}, {barcode: 'ITEM000004', count: 3}];
    it('should return right data', () => {
      var pos = new POS();
      pos.setInfoes(itemsInfo);
      var itemInfoCounts = [{
        item:{
          barcode: 'ITEM000001',
          name: '可口可乐',
          unit: '瓶',
          category: '食品',
          subCategory: '碳酸饮料',
          price: 26.00
        },
        count: 5
      },{
        item:{
          barcode: 'ITEM000004',
          name: '加多宝',
          unit: '罐',
          category: '食品',
          subCategory: '凉茶饮料',
          price: 4.00
        },
        count: 3
      }];
      expect(pos.transCodesToInfoes(barcodeCounts)).toEqual(itemInfoCounts);
    });
  });

  describe('getSubTotal', () => {
    var itemInfoCounts = [{
      item:{
        barcode: 'ITEM000001',
        name: '可口可乐',
        unit: '瓶',
        category: '食品',
        subCategory: '碳酸饮料',
        price: 26.00
      },
      count: 6
    },{
      item:{
        barcode: 'ITEM000004',
        name: '加多宝',
        unit: '罐',
        category: '食品',
        subCategory: '凉茶饮料',
        price: 4.00
      },
      count: 3
    }];

    describe('when no promotions', () => {
      it('should return right data', () => {
        var pos = new POS();
        var itemsGetSubToal = [{
          itemInfoCount: {
            item: {
              barcode: 'ITEM000001',
              name: '可口可乐',
              unit: '瓶',
              category: '食品',
              subCategory: '碳酸饮料',
              price: 26.00
            },count: 6
          },subTotal: 156,
          saveTotal: 0
        },{
          itemInfoCount: {
            item : {
              barcode: 'ITEM000004',
              name: '加多宝',
              unit: '罐',
              category: '食品',
              subCategory: '凉茶饮料',
              price: 4.00
            },count: 3
          },subTotal: 12,
          saveTotal: 0
        }];
        expect(pos.getSubTotal(itemInfoCounts)).toEqual(itemsGetSubToal);
      });
    });

    describe('when promotion is buy two send one', () => {
      it('should return right data', () => {
        var pos = new POS();
        pos.setPromotions(['ITEM000001','ITEM000003'],['ITEM000002']);
        var itemsGetSubToal = [{
          itemInfoCount: {
            item: {
              barcode: 'ITEM000001',
              name: '可口可乐',
              unit: '瓶',
              category: '食品',
              subCategory: '碳酸饮料',
              price: 26.00
            },count: 6
          },subTotal: 104,
          saveTotal: 52
        },{
          itemInfoCount: {
            item : {
              barcode: 'ITEM000004',
              name: '加多宝',
              unit: '罐',
              category: '食品',
              subCategory: '凉茶饮料',
              price: 4.00
            },count: 3
          },subTotal: 12,
          saveTotal: 0
        }];
        expect(pos.getSubTotal(itemInfoCounts)).toEqual(itemsGetSubToal);
      });
    });

    describe('when promotion is five percent discount', () => {
      it('should return right data', () => {
        var pos = new POS();
        pos.setPromotions(['ITEM000002'],['ITEM000001','ITEM000003']);
        var itemsGetSubToal = [{
          itemInfoCount: {
            item: {
              barcode: 'ITEM000001',
              name: '可口可乐',
              unit: '瓶',
              category: '食品',
              subCategory: '碳酸饮料',
              price: 26.00
            },count: 6
          },subTotal: 148.2,
          saveTotal: 7.8
        },{
          itemInfoCount: {
            item : {
              barcode: 'ITEM000004',
              name: '加多宝',
              unit: '罐',
              category: '食品',
              subCategory: '凉茶饮料',
              price: 4.00
            },count: 3
          },subTotal: 12,
          saveTotal: 0
        }];
        expect(pos.getSubTotal(itemInfoCounts)).toEqual(itemsGetSubToal);
      });
    });

    describe('when promotions are five percent discount and buy two send one', () => {
      it('should return right data', () => {
        var pos = new POS();
        pos.setPromotions(['ITEM000001','ITEM000003'],['ITEM000001','ITEM000002']);
        var itemsGetSubToal = [{
          itemInfoCount: {
            item: {
              barcode: 'ITEM000001',
              name: '可口可乐',
              unit: '瓶',
              category: '食品',
              subCategory: '碳酸饮料',
              price: 26.00
            },count: 6
          },subTotal: 104,
          saveTotal: 52
        },{
          itemInfoCount: {
            item : {
              barcode: 'ITEM000004',
              name: '加多宝',
              unit: '罐',
              category: '食品',
              subCategory: '凉茶饮料',
              price: 4.00
            },count: 3
          },subTotal: 12,
          saveTotal: 0
        }];
        expect(pos.getSubTotal(itemInfoCounts)).toEqual(itemsGetSubToal);
      });
    });
  });

  describe('searchPromotions', () => {
    var barcode = 'ITEM000001';

    describe('when no promotions', () => {
      it('should return 0', () => {
        var pos = new POS();
        expect(pos.searchPromotions(barcode)).toEqual(0)
      });
    });

    describe('when promotion is buy two send one', () => {
      it('should return 1', () => {
        var pos = new POS();
        pos.setPromotions(['ITEM000001','ITEM000003'],['ITEM000002']);
        expect(pos.searchPromotions(barcode)).toEqual(1);
      });
    });

    describe('when promotion is five percent discount', () => {
      it('should return 2', () => {
        var pos = new POS();
        pos.setPromotions(['ITEM000002'],['ITEM000001','ITEM000003']);
        expect(pos.searchPromotions(barcode)).toEqual(2);
      });
    });

    describe('when promotions are five percent discount and buy two send one', () => {
      it('should return 1', () => {
        var pos = new POS();
        pos.setPromotions(['ITEM000001','ITEM000002'],['ITEM000001','ITEM000003']);
        expect(pos.searchPromotions(barcode)).toEqual(1);
      });
    });
  });

  describe('getTotal', () => {
    describe('when no promotions', () => {
      var itemsGetSubToal = [{
        itemInfoCount: {
          item: {
            barcode: 'ITEM000001',
            name: '可口可乐',
            unit: '瓶',
            category: '食品',
            subCategory: '碳酸饮料',
            price: 26.00
          },count: 6
        },subTotal: 156,
        saveTotal: 0
      },{
        itemInfoCount: {
          item : {
            barcode: 'ITEM000004',
            name: '加多宝',
            unit: '罐',
            category: '食品',
            subCategory: '凉茶饮料',
            price: 4.00
          },count: 3
        },subTotal: 12,
        saveTotal: 0
      }];

      it('should return right data', () => {
        var pos = new POS();
        var itemsGetTotal = {
          itemsGetSubToal : [{
            itemInfoCount: {
              item: {
                barcode: 'ITEM000001',
                name: '可口可乐',
                unit: '瓶',
                category: '食品',
                subCategory: '碳酸饮料',
                price: 26.00
              },count: 6
            },subTotal: 156,
            saveTotal: 0
          },{
            itemInfoCount: {
              item : {
                barcode: 'ITEM000004',
                name: '加多宝',
                unit: '罐',
                category: '食品',
                subCategory: '凉茶饮料',
                price: 4.00
              },count: 3
            },subTotal: 12,
            saveTotal: 0
          }],
          total : 168,
          saved : 0
        }

        expect(pos.getTotal(itemsGetSubToal)).toEqual(itemsGetTotal);
      });
    });

    describe('when promotion is buy two send one', () => {
      var itemsGetSubToal = [{
        itemInfoCount: {
          item: {
            barcode: 'ITEM000001',
            name: '可口可乐',
            unit: '瓶',
            category: '食品',
            subCategory: '碳酸饮料',
            price: 26.00
          },count: 6
        },subTotal: 104,
        saveTotal: 52
      },{
        itemInfoCount: {
          item : {
            barcode: 'ITEM000004',
            name: '加多宝',
            unit: '罐',
            category: '食品',
            subCategory: '凉茶饮料',
            price: 4.00
          },count: 3
        },subTotal: 12,
        saveTotal: 0
      }];

      it('should return right data', () => {
        var pos = new POS();
        pos.setPromotions(['ITEM000001','ITEM000003'],['ITEM000002']);
        var itemsGetTotal = {
          itemsGetSubToal : [{
            itemInfoCount: {
              item: {
                barcode: 'ITEM000001',
                name: '可口可乐',
                unit: '瓶',
                category: '食品',
                subCategory: '碳酸饮料',
                price: 26.00
              },count: 6
            },subTotal: 104,
            saveTotal: 52
          },{
            itemInfoCount: {
              item : {
                barcode: 'ITEM000004',
                name: '加多宝',
                unit: '罐',
                category: '食品',
                subCategory: '凉茶饮料',
                price: 4.00
              },count: 3
            },subTotal: 12,
            saveTotal: 0
          }],
          total : 116,
          saved : 52
        }

        expect(pos.getTotal(itemsGetSubToal)).toEqual(itemsGetTotal);
      });
    });

    describe('when promotion is five percent discount', () => {
      var itemsGetSubToal = [{
        itemInfoCount: {
          item: {
            barcode: 'ITEM000001',
            name: '可口可乐',
            unit: '瓶',
            category: '食品',
            subCategory: '碳酸饮料',
            price: 26.00
          },count: 6
        },subTotal: 148.2,
        saveTotal: 7.8
      },{
        itemInfoCount: {
          item : {
            barcode: 'ITEM000004',
            name: '加多宝',
            unit: '罐',
            category: '食品',
            subCategory: '凉茶饮料',
            price: 4.00
          },count: 3
        },subTotal: 12,
        saveTotal: 0
      }];

      it('should return right data', () => {
        var pos = new POS();
        pos.setPromotions(['ITEM000002'],['ITEM000001','ITEM000003']);
        var itemsGetTotal = {
          itemsGetSubToal : [{
            itemInfoCount: {
              item: {
                barcode: 'ITEM000001',
                name: '可口可乐',
                unit: '瓶',
                category: '食品',
                subCategory: '碳酸饮料',
                price: 26.00
              },count: 6
            },subTotal: 148.2,
            saveTotal: 7.8
          },{
            itemInfoCount: {
              item : {
                barcode: 'ITEM000004',
                name: '加多宝',
                unit: '罐',
                category: '食品',
                subCategory: '凉茶饮料',
                price: 4.00
              },count: 3
            },subTotal: 12,
            saveTotal: 0
          }],
          total : 160.2,
          saved : 7.8
        }

        expect(pos.getTotal(itemsGetSubToal)).toEqual(itemsGetTotal);
      });
    });

    describe('when promotions are five percent discount and buy two send one', () => {
      var itemsGetSubToal = [{
        itemInfoCount: {
          item: {
            barcode: 'ITEM000001',
            name: '可口可乐',
            unit: '瓶',
            category: '食品',
            subCategory: '碳酸饮料',
            price: 26.00
          },count: 6
        },subTotal: 104,
        saveTotal: 52
      },{
        itemInfoCount: {
          item : {
            barcode: 'ITEM000004',
            name: '加多宝',
            unit: '罐',
            category: '食品',
            subCategory: '凉茶饮料',
            price: 4.00
          },count: 3
        },subTotal: 12,
        saveTotal: 0
      }];

      it('should return right data', () => {
        var pos = new POS();
        pos.setPromotions(['ITEM000001','ITEM000003'],['ITEM000001','ITEM000002']);
        var itemsGetTotal = {
          itemsGetSubToal : [{
            itemInfoCount: {
              item: {
                barcode: 'ITEM000001',
                name: '可口可乐',
                unit: '瓶',
                category: '食品',
                subCategory: '碳酸饮料',
                price: 26.00
              },count: 6
            },subTotal: 104,
            saveTotal: 52
          },{
            itemInfoCount: {
              item : {
                barcode: 'ITEM000004',
                name: '加多宝',
                unit: '罐',
                category: '食品',
                subCategory: '凉茶饮料',
                price: 4.00
              },count: 3
            },subTotal: 12,
            saveTotal: 0
          }],
          total : 116,
          saved : 52
        }

        expect(pos.getTotal(itemsGetSubToal)).toEqual(itemsGetTotal);
      });
    });


  });
});
